import { Controller, Get, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RequireLogin } from '@/decorators/guard.decorator';
import { UserInfo } from '@/decorators/param.decorator';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDetailVo } from '@/vo/user-info.vo';
import { ENUM_RESPONSE_STATUS } from '@/constant/enums';

@ApiTags('user-center')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 查询用户详情
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: ENUM_RESPONSE_STATUS.OK,
    type: UserDetailVo,
  })
  @Get('user-info')
  @RequireLogin()
  async getUserInfo(@UserInfo('userId') userId: string) {
    const user = await this.userService.findUserDetailById(userId);

    let userVo = new UserDetailVo();
    userVo = Object.assign(userVo, user);
    return userVo;
  }
}
