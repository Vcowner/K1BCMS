/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-12-01 16:12:58
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 16:54:01
 */
import { Permission } from '@/entities/permission.entity';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  /**
   * Checks if the user can activate a certain route or action.
   *
   * @param {ExecutionContext} context - The execution context.
   * @return {boolean | Promise<boolean> | Observable<boolean>} - Returns true if the user can activate the route or action, otherwise returns false or a promise/observable that resolves to false.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // 获取一个布尔值，表示是否需要登录才能激活路由或执行操作。
    // 从装饰器中获取 'require-login' 的值。如果该值存在，则将其赋值给 requiredLogin；如果不存在，则 requiredLogin 默认为 undefined。
    const requiredLogin = this.reflector.getAllAndOverride<boolean>(
      'require-login',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        ...data,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
