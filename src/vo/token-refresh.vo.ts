/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-12-04 16:38:58
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-04 16:40:36
 */
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenVo {
  constructor(tokens: { accessToken: string; refreshToken: string }) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
