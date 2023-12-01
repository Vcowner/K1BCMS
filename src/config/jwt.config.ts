import { ConfigService } from '@nestjs/config';

export const jwtConfig: (
  configService: ConfigService,
) => Promise<{ secret: any; signOptions: { expiresIn: any } }> = async (
  configService: ConfigService<Record<string, unknown>, false>,
) => {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXPIRES_IN'), // 默认 30 分钟
    },
  };
};
