/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-27 16:21:04
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-06 16:47:50
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './features/redis/redis.module';
import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { dbConfig } from './config/db.config';
import { CaptchaService } from './features/captcha/captcha.service';
import { CaptchaModule } from './features/captcha/captcha.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guards/login.guard';
import { PermissionGuard } from './guards/permission.guard';
import { WinstonModule } from './features/winston/winston.module';
import { winstonConfig } from './config/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return jwtConfig(configService);
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return dbConfig(configService);
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRoot(winstonConfig()),
    RedisModule,
    UserModule,
    AuthModule,
    CaptchaModule,
    WinstonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CaptchaService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
