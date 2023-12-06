/*
 * @Author: liaokt
 * @Description: 日志相关配置
 * @Date: 2023-12-06 16:43:52
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-06 16:54:03
 */

import { transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as chalk from 'chalk';

// winston 配置
export const winstonConfig = () => {
  return {
    level: 'silly',
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(({ context, level, message, time }) => {
            const appStr = chalk.green(`[NEST]`);
            const contextStr = chalk.yellow(`[${context}]`);
            return `${appStr} ${time} ${level} ${contextStr} ${message}`;
          }),
        ),
      }),
      new DailyRotateFile({
        level: 'error',
        dirname: 'logs/error',
        filename: '%DATE%-error.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.json(),
        ),
      }),
      new DailyRotateFile({
        level: 'silly',
        dirname: 'logs/all',
        filename: '%DATE%-all.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.json(),
        ),
      }),
    ],
  };
};
