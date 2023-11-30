/*
 * @Author: liaokt
 * @Description: captcha config
 * @Date: 2023-11-28 15:27:58
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-29 17:32:59
 */
import { ConfigService } from '@nestjs/config';

// sms config
export const getSmsClientConfig = (configService: ConfigService) => {
  return {
    credential: {
      secretId: configService.get('TENCENT_CLOUD_SECRET_ID'),
      secretKey: configService.get('TENCENT_CLOUD_SECRET_KEY'),
    },
    region: 'ap-guangzhou',
    profile: {},
  };
};

// sms params config
export const getSmsParams = (
  configService: ConfigService,
  captcha: string,
  phone: string,
) => {
  const params = {
    SmsSdkAppId: configService.get('TENCENT_CLOUD_SDK_APP_ID'),
    SignName: configService.get('TENCENT_CLOUD_SIGN_NAME'),
    TemplateId: configService.get('TENCENT_CLOUD_TEMPLATE_ID'),
    /* 模板参数: 模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致，若无模板参数，则设置为空 */
    TemplateParamSet: [`${captcha}`],
    /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
     * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
    PhoneNumberSet: [`+86${phone}`],
  };
  return params;
};
