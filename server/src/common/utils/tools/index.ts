import * as dayjs from 'dayjs';
import * as Useragent from 'useragent';
import { v4 as uuidV4 } from 'uuid';

import { ClientInfoDto } from 'src/common/dto';

/**
 * 去掉短横线
 * @name:generateUUID
 * @description: 生成uuid
 * @returns:68acca5daafd4c70aad18c2a3f003afc
 */
export function generateUUID(): string {
  return uuidV4().replaceAll('-', '');
}

/**
 * 获取当前时间
 * YYYY-MM-DD HH:mm:ss
 * @returns
 */
export function getNowDate() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 获取客户端信息
 * @name:getClientInfo
 * @description: 获取客户端信息
 * @param req http请求对象
 * @returns:{}
 */
export function getClientInfo(req): ClientInfoDto {
  // 返回一个agent实例
  const userAgent = Useragent.parse(req.headers['User-Agent'] || '');
  return {
    userAgent: req.headers['User-Agent'],
    ipAddr: req.clientIp,
    os: userAgent.os.toJSON().family,
    browser: userAgent.toAgent(),
    loginLocation: '',
  };
}
