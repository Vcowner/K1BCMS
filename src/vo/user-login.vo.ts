/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-17 10:24:24
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 10:32:02
 */

import { Permission } from '@/entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

// 登陆返回数据格式
class UserInfo {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'zhangsan' })
  username: string;

  @ApiProperty({ example: '张三' })
  nickName: string;

  @ApiProperty({ example: 'xx@xx.com' })
  email: string;

  @ApiProperty({ example: 'xxx.png' })
  headPic: string;

  @ApiProperty({ example: '13233333333' })
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  createTime: number;

  @ApiProperty({ example: ['管理员'] })
  roles: string[];

  @ApiProperty({ example: 'query_aaa' })
  permissions: Permission[];
}

export class LoginUserVo {
  @ApiProperty()
  userInfo: UserInfo;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
