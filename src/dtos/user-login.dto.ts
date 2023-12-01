/*
 * @Author: liaokt
 * @Description: user login dto
 * @Date: 2023-11-15 14:31:06
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 14:17:36
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  @ApiProperty({
    minLength: 6,
  })
  password: string;

  @IsNotEmpty({
    message: '是否为管理员不能为空',
  })
  @ApiProperty()
  isAdmin: boolean;
}
