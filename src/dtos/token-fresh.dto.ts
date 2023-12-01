/*
 * @Author: liaokt
 * @Description: token fresh dto
 * @Date: 2023-11-15 14:31:06
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 16:08:41
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({
    message: '刷新令牌不能为空',
  })
  @ApiProperty()
  refreshToken: string;

  @IsNotEmpty({
    message: '是否为管理员不能为空',
  })
  @ApiProperty()
  isAdmin: boolean;
}
