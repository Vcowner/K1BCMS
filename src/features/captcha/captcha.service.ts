/*
 * @Author: liaokt
 * @Description: 验证码发送服务 captcha send service
 * @Date: 2023-11-29 10:04:16
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-30 17:09:44
 */
import { sendSmsCaptchaTent } from '@/utils/captcha';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class CaptchaService {
  // 1. mail service
  private readonly transporter: Transporter;

  constructor(private configService: ConfigService) {
    // mail
    this.transporter = createTransport({
      host: this.configService.get('NODEMAILER_HOST'),
      port: this.configService.get('NODEMAILER_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('NODEMAILER_AUTH_USER'),
        pass: this.configService.get('NODEMAILER_AUTH_PASS'),
      },
    });
  }

  // send phone captcha
  async sendPhoneCaptcha(phone: string, code: string) {
    // use tencent sms
    await sendSmsCaptchaTent(phone, code);
  }

  // send mail captcha
  async sendMailCaptcha({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: 'K1B_CMS',
        address: this.configService.get('NODEMAILER_AUTH_USER'),
      },
      to,
      subject,
      html,
    });
  }
}
