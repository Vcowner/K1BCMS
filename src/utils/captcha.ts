/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-29 17:23:50
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-30 17:23:12
 */

import { getSmsClientConfig, getSmsParams } from '@/config/captcha.config';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tencentcloud = require('tencentcloud-sdk-nodejs');

const smsClient = tencentcloud.sms.v20210111.Client;

/**
 * Sends an SMS captcha to a specified phone number.
 *
 * @param {string} phone - The phone number to send the SMS captcha to.
 * @param {string} captcha - The captcha string to be sent.
 * @return {Promise} A promise that resolves with the response from the SMS provider if the request is successful, or rejects with an error if the request fails.
 */
export const sendSmsCaptchaTent = async (phone: string, captcha: string) => {
  const configService = new ConfigService();

  const clientConfig = getSmsClientConfig(configService);
  const smsParams = getSmsParams(configService, captcha, phone);

  const client = new smsClient(clientConfig);
  return new Promise((resolve, reject) => {
    client.SendSms(smsParams, function (err, response) {
      // 请求异常返回，打印异常信息
      if (err) {
        reject(err);
      } // 请求正常返回，打印response对象
      resolve(response);
    });
  });
};

/**
 * Generates a random captcha code.
 *
 * @returns {string} The generated captcha code.
 */
export const generateCaptcha = (): string => {
  // Generate a random number between 0 and 1, convert it to a string,
  // and remove the "0." prefix.
  const randomNumber = Math.random().toString().slice(2);

  // Take the first 6 characters from the random number to form the captcha code.
  const captchaCode = randomNumber.slice(0, 6);

  return captchaCode;
};

/**
 * Generates an HTML string for a captcha page.
 *
 * @param {string} code - The captcha code to be displayed in the HTML.
 * @return {string} The HTML string for the captcha page.
 */
export const generateCaptchaHtml = (code: string) => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <title>验证码页面</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
    
        .card {
          /* background-color: #309975; */
          border-radius: 1px;
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
          width: 600px;
          padding: 20px;
          margin: 50px auto;
        }
    
        .header {
          text-align: left;
          font-size: 20px;
          color: #309975;
          font-weight: bold;
          padding-bottom: 20px;
        }
    
        .image {
          text-align: center;
          margin-bottom: 20px;
        }
    
        .image img {
          width: 100%;
          height: 200px;
          object-fit:cover
        }
    
        .message {
          text-align: left;
          font-size: 20px;
          margin-bottom: 18px;
        }
        
        .warning {
          text-align: left;
          font-size: 14px;
          margin-bottom: 18px;
        }
    
        .signature {
          text-align: right;
          margin-top: 20px;
          color: #309975;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">K1B-CMS</div>
        <div class="image">
          <img src="../static/imgs/img_mail_header.jpg" alt="植物图片">
        </div>
        <div class="message">
          <p>尊敬的用户，您的验证码是：</p>
          <p><strong>${code}</strong></p>
        </div>
        <div class="warning">
          <p>请勿将验证码透露给任何人。</p>
          <p>如果您没有请求验证码，请忽略此邮件。</p>
        </div>
        <div class="signature">
          <p>K1BCMS</p>
        </div>
      </div>
    </body>
    </html>`;
};
