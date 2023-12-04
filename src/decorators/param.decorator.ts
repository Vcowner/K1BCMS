/*
 * @Author: liaokt
 * @Description: 参数装饰器
 * @Date: 2023-12-04 14:21:39
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-04 14:24:46
 */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// Export a constant called UserInfo, which is a parameter decorator
export const UserInfo = createParamDecorator(
  // The parameter decorator takes a function as an argument
  (key: string, ctx: ExecutionContext) => {
    // Get the request from the context
    const request = ctx.switchToHttp().getRequest();

    // If there is no user in the request, return null
    if (!request.user) {
      return null;
    }

    // Otherwise, return the user info from the request, or the whole user info if no key is provided
    return key ? request.user[key] : request.user;
  },
);
