/*
 * @Author: liaokt
 * @Description: 日志 winston 模块
 * @Date: 2023-12-06 11:33:24
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-06 15:40:06
 */
import { CustomerLogger } from '@/logger/custom-logger.logger';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerOptions } from 'winston';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({})
export class WinstonModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new CustomerLogger(options),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
