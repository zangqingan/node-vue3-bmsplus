import { v4 as uuidV4 } from 'uuid';

/**
 * 去掉短横线
 * @name:generateUUID
 * @description: 生成uuid
 * @returns:68acca5daafd4c70aad18c2a3f003afc
 */
export function generateUUID(): string {
  return uuidV4().replaceAll('-', '');
}
