/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 15:06:15
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-28 16:04:18
 */
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
