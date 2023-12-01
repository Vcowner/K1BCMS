/*
 * @Author: liaokt
 * @Description: database config
 * @Date: 2023-11-28 15:27:58
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 15:49:57
 */
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

// database config
export const dbConfig: (
  configService: ConfigService,
) => Promise<TypeOrmModuleOptions> = async (configService: ConfigService) => {
  return {
    type: 'mysql',
    host: configService.get('MYSQL_SERVER_HOST'),
    port: configService.get('MYSQL_SERVER_PORT'),
    username: configService.get('MYSQL_SERVER_USERNAME'),
    password: configService.get('MYSQL_SERVER_PASSWORD'),
    database: configService.get('MYSQL_SERVER_DATABASE'),
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    synchronize: true,
    logging: true,
    poolSize: 10,
    connectorPackage: 'mysql2',
    extra: {
      authPlugin: 'sha256_password',
    },
  };
};
