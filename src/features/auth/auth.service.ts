/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 15:24:21
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 15:55:13
 */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from '@/dtos/user-register.dto';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { md5, throwBadException } from '@/utils';
import { LoginUserDto } from '@/dtos/user-login.dto';
import { LoginUserVo } from '@/vo/user-login.vo';
import { Permission } from '@/entities/permission.entity';
import { User } from '@/entities/user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger();

  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @InjectRepository(User)
  private userRepository: Repository<User>;

  /**
   * Register a new user.
   *
   * @param user - The user object containing registration details.
   * @returns A success or failure message.
   */
  async register(user: RegisterUserDto) {
    const { username, password, email, nickName, captcha: userCaptcha } = user;

    // Get the captcha stored in Redis for the provided email.
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    // Verify if the captcha exists and matches the user-provided captcha.
    if (!captcha) {
      throwBadException('验证码已失效');
    }

    if (userCaptcha !== captcha) {
      throwBadException('验证码不正确');
    }

    // Check if a user with the same username already exists.
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throwBadException('用户已存在');
    }

    // Create a new User entity and assign the provided details.
    const newUser = new User();

    Object.assign(newUser, {
      username,
      password: md5(password),
      email,
      nickName,
    });

    try {
      // Save the new user to the database.
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      // Log any errors that occur during the registration process.
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  /**
   * Authenticates a user by logging them in.
   *
   * @param {LoginUserDto} loginUserDto - The login details of the user.
   * @param {boolean} isAdmin - Indicates whether the user is an admin.
   * @throws {HttpException} Throws an exception if the user does not exist or if the password is incorrect.
   * @return {Promise<User>} The authenticated user.
   */
  async login(loginUserDto: LoginUserDto) {
    // 1. 查询用户
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin: loginUserDto.isAdmin,
      },
      // 同时查询用户的角色和权限
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const loginVo = new LoginUserVo();

    const permissions = new Set<Permission>();
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.add(permission);
      });
    });

    loginVo.userInfo = {
      ...user,
      createTime: user.createTime.getTime(),
      roles: user.roles.map((item) => item.name),
      // 当前用户可能会有多个角色，且角色的权限可能会有重复，所以要去下重
      permissions: Array.from(permissions),
    };

    return loginVo;
  }
}
