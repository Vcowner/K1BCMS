import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/dtos/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    // 调用 authService 的 register 方法来处理用户注册逻辑
    const user = await this.authService.register(registerDto);
    // 返回注册后的用户对象
    return user;
  }
}
