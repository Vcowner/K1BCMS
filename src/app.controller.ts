/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-27 16:21:04
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-30 15:16:28
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
