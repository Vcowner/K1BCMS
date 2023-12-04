/*
 * @Author: liaokt
 * @Description: 日志拦截器
 *  记录下访问的 ip、user-agent、请求的 controller、method、接口耗时、响应内容、当前登录用户信息
 * @Date: 2023-12-04 14:55:42
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-04 15:04:35
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  // Create a logger instance
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  // Intercept the execution context and call the next handler
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get the request and response objects from the execution context
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Get the user agent from the request headers
    const userAgent = request.headers['user-agent'];

    // Get the IP, method, and path from the request
    const { ip, method, path } = request;

    // Log the request details
    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );

    // Log the user details
    this.logger.debug(
      `user: ${request.user?.userId}, ${request.user?.username}`,
    );

    // Get the current time
    const now = Date.now();

    // Call the next handler and log the response
    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${
            Date.now() - now
          }ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
