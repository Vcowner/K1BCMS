/*
 * @Author: liaokt
 * @Description: 注册、登录、鉴权模块
 * @Date: 2023-11-28 15:24:21
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-30 17:02:56
 */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/dtos/user-register.dto';
import { generateCaptcha, generateCaptchaHtml } from '@/utils/captcha';
import { RedisService } from '../redis/redis.service';
import { CaptchaService } from '../captcha/captcha.service';
import { CaptchaAuthDto } from '@/dtos/captcha-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    // 调用 authService 的 register 方法来处理用户注册逻辑
    const user = await this.authService.register(registerDto);
    // 返回注册后的用户对象
    return user;
  }

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
}
