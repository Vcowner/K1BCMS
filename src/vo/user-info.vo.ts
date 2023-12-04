/*
 * @Author: liaokt
 * @Description: 用户详情 vo
 * @Date: 2023-12-04 15:18:47
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-04 15:18:55
 */
import { ApiProperty } from '@nestjs/swagger';

export class UserDetailVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  headPic: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  createTime: Date;
}
