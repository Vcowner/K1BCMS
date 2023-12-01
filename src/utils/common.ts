/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 16:21:54
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 15:35:24
 */
import * as crypto from 'crypto';

export const md5 = (data: string) => {
  return crypto.createHash('md5').update(data).digest('hex');
};
