/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-12-01 11:22:50
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 14:17:43
 */

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * Generates a JWT access token and refresh token based on the provided user information.
 *
 * @param {JwtService} jwtService - The JWT service used to sign the tokens.
 * @param {ConfigService} configService - The configuration service used to retrieve token expiration values.
 * @param {Object} loginUserInfo - The user information used to generate the tokens.
 * @returns {Object} An object containing the generated access token and refresh token.
 */
export const generateToken = (
  jwtService: JwtService,
  configService: ConfigService,
  loginUserInfo: {
    id: string;
    email: string;
    username: string;
    roles: string[];
    permissions: any[];
  },
) => {
  const { id } = loginUserInfo;

  // token
  const accessToken = jwtService.sign(loginUserInfo, {
    expiresIn: configService.get('JWT_EXPIRES_IN') || '30m',
  });

  // fresh token
  const refreshToken = jwtService.sign(
    {
      userId: id,
    },
    {
      expiresIn: configService.get('JWT_REFRESH_TOKEN_EXPRESS_TIME') || '7d',
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};
