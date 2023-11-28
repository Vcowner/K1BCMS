/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-27 16:21:04
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-28 15:32:20
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return dbConfig(configService);
      },
      inject: [ConfigService],
    }),
    RedisModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
