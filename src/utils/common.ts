/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 16:21:54
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-28 16:25:19
 */
import crypto from 'crypto';

export const md5 = (data: string) => {
  return crypto.createHash('md5').update(data).digest('hex');
};
