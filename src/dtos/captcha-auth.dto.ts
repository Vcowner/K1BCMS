/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-30 09:57:32
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-30 10:29:59
 */
import { ENUM_AUTH_TYPE } from '@/constant/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CaptchaAuthDto {
  @IsOptional()
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('CN', {
    message: '请输入正确的手机号!',
  })
  phone?: string;

  @IsNotEmpty({
    message: '认证类型不能为空',
  })
  authType: ENUM_AUTH_TYPE;
}
