/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 15:13:11
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-28 16:02:46
 */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
