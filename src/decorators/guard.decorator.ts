/*
 * @Author: liaokt
 * @Description: 路由守卫相关装饰器
 * @Date: 2023-12-01 17:40:14
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 17:41:51
 */

import { SetMetadata } from '@nestjs/common';

// 接口访问是否需要登录
export const RequireLogin = () => SetMetadata('require-login', true);

// 接口访问是否拥有权限
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);
