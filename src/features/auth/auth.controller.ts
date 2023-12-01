/*
 * @Author: liaokt
 * @Description: 注册、登录、鉴权模块
 * @Date: 2023-11-28 15:24:21
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 16:09:11
 */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { generateCaptcha, generateCaptchaHtml } from '@/utils/captcha';
import { RedisService } from '../redis/redis.service';
import { CaptchaService } from '../captcha/captcha.service';
import { CaptchaAuthDto } from '@/dtos/captcha-auth.dto';
import { LoginUserDto } from '@/dtos/user-login.dto';
import { RegisterUserDto } from '@/dtos/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { generateToken, md5 } from '@/utils';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { RefreshTokenDto } from '@/dtos/token-fresh.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly captchaService: CaptchaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @InjectRepository(User)
  private userRepository: Repository<User>;

  // 注册
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    // 调用 authService 的 register 方法来处理用户注册逻辑
    return await this.authService.register(registerDto);
  }

  // 登录
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: String,
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    // 1. 查询用户
    let loginVo = await this.authService.login(loginUserDto);

    const { userInfo } = loginVo;

    // 2. 生成 token
    const tokens = generateToken(this.jwtService, this.configService, userInfo);

    loginVo = { ...loginVo, ...tokens };

    return loginVo;
  }

  // 发送验证码
  @ApiBody({ type: CaptchaAuthDto })
  @Post('send-captcha')
  async captcha(@Body() captchaAuthDto: CaptchaAuthDto) {
    // 获取 email
    const { email, phone, authType } = captchaAuthDto;
    // 生成验证码
    const code = generateCaptcha();
    // 将验证码存入到 redis 中，判断验证码生效
    await this.redisService.set(`captcha_${email}`, code, 60);

    if (authType === 'phone') {
      // 发送验证码
      await this.captchaService.sendPhoneCaptcha(phone, code);
    } else if (authType === 'email') {
      // 发送邮件
      await this.captchaService.sendMailCaptcha({
        to: email,
        subject: '验证码',
        html: generateCaptchaHtml(code),
      });
    }

    return '发送成功';
  }

  // 刷新 token
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken, isAdmin } = refreshTokenDto;
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, isAdmin);

      const tokens = generateToken(this.jwtService, this.configService, user);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('token 已失效， 请重新登录');
    }
  }
}
