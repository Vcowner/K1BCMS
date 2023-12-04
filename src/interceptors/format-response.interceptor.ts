/*
 * @Author: liaokt
 * @Description: 响应格式拦截器
 * @Date: 2023-12-04 14:37:45
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-04 14:47:44
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { ENUM_RESPONSE_STATUS } from '@/constant/enums';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  // Intercept the response from the context
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get the response from the context
    const response = context.switchToHttp().getResponse<Response>();

    // Return the response with the status code and success message
    return next.handle().pipe(
      map((data) => {
        return {
          code: response.statusCode,
          message: ENUM_RESPONSE_STATUS.OK,
          data,
        };
      }),
    );
  }
}
