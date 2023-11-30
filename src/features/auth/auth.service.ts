/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 15:24:21
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-30 09:47:00
 */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from '@/dtos/user-register.dto';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { User } from '@/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { md5, throwBadException } from '@/utils';

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
}
