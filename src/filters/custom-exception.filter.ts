/*
 * @Author: liaokt
 * @Description: 异常拦截器
 * @Date: 2023-12-04 15:40:54
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-04 16:18:55
 */
import { ENUM_RESPONSE_STATUS } from '@/constant/enums';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Get the response object from the host
    const response = host.switchToHttp().getResponse<Response>();

    // Set the response status code

    response.statusCode = exception.getStatus();

    // sometime there are not only one error message but more than it.
    // so it needs string[] to be type
    const res = exception.getResponse() as { message: string[] };

    // Return the response with the error code and message
    response
      .json({
        code: exception.getStatus(),
        message: ENUM_RESPONSE_STATUS.FAIL,
        data: res?.message ?? (res?.message.join(',') || exception.message),
      })
      .end();
  }
}
