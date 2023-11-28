/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 16:49:05
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-28 16:50:02
 */
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

export const throwBadException = (message: string) => {
  throw new HttpException(message, HttpStatus.BAD_REQUEST);
};
