/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-29 10:04:25
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-30 09:46:12
 */
import { Global, Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';

@Global()
@Module({
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
