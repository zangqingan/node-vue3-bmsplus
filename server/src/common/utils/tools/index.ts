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

/**
 * 数组转树结构
 * @param arr
 * @param getId
 * @param getLabel
 * @returns
 */
export function listToTree(arr, getId, getLabel) {
  const kData = {}; // 以id做key的对象 暂时储存数据
  const lData = []; // 最终的数据 arr

  arr.forEach((m) => {
    m = {
      id: getId(m),
      label: getLabel(m),
      parentId: +m.parentId,
    };
    kData[m.id] = {
      id: m.id,
      label: m.label,
      parentId: m.parentId,
    };
    if (m.parentId === 0) {
      lData.push(kData[m.id]);
    } else {
      kData[m.parentId] = kData[m.parentId] || {};
      kData[m.parentId].children = kData[m.parentId].children || [];
      kData[m.parentId].children.push(kData[m.id]);
    }
  });
  return lData;
}

/**
 * 部门数组转树结构
 * @param arr
 * @returns tree
 */
export function arrayToTree(items) {
  // 坚持入参是否为数组
  if (!Array.isArray(items)) {
    return 'Error: Input must be an array';
  }
  const result = []; // 用于存放结果的数组集
  const itemMap = {}; // 用于存放节点的对象

  // 先转化为map存储
  for (const item of items) {
    itemMap[item.deptId] = { ...item, children: [] };
  }
  // 遍历数组
  for (const item of items) {
    const id = item.deptId;
    const parentId = item.parentId;
    const mapItem = itemMap[id];

    if (parentId === '0' || parentId === undefined) {
      // 根据父id判断是否为根节点
      result.push(mapItem);
    } else {
      if (!itemMap[parentId]) {
        itemMap[parentId] = {
          children: [],
        };
      }
      itemMap[parentId].children.push(mapItem);
    }
  }
  return result;
}
