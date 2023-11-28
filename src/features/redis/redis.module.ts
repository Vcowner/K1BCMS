/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 15:01:17
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-28 15:10:41
 */
import { RedisService } from './redis.service';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('REDIS_SERVER_HOST'),
            port: configService.get('REDIS_SERVER_PORT'),
          },
          database: configService.get('REDIS_SERVER_DB'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
