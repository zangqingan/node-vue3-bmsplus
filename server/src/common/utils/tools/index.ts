import * as dayjs from 'dayjs';
import * as Useragent from 'useragent';
import { v4 as uuidV4 } from 'uuid';
import { capitalize } from 'lodash'

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
  // 特殊ip转换
  let currentIp = req.clientIp
  if (req.clientIp?.includes('127.0.0.1') || req.clientIp == '::1') {
    currentIp = '127.0.0.1'
  }
  return {
    userAgent: req.headers['User-Agent'],
    ipAddr: currentIp,
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

  /**@desc 菜单树形化 */

export function MenuTree(arr = [], id = 'id', pid = 'pid', rootValue = 0) {
    const result = [];
    const map = {};
    for (const item of arr) {
      map[item[id]] = {
        component: item.component,
        hidden: item.visible == 0,
        name: capitalize(item.path?.replaceAll('/', '')),
        path: item.path,
        meta: {
          icon: item.icon,
          link: null,
          noCache: item.isCache == 0,
          title: item.menuName,
        },
        children: map[item[id]]?.children || [],
      };
      if (item[pid] == rootValue && item.menuType === 'M') {
        map[item[id]].alwaysShow = true;
        map[item[id]].component = map[item[id]].component || 'Layout';
        map[item[id]].redirect = 'noRedirect';
        map[item[id]].path = '/' + (map[item[id]].path || map[item[id]].path);
        result.push(map[item[id]]);
      } else if (item[pid] == rootValue && item.menuType === 'C') {
        //是外链
        if (item.isFrame == '1') {
          result.unshift({
            component: 'Layout',
            hidden: item.visible == 0,
            name: item.path,
            path: item.path,
            meta: {
              icon: item.icon,
              link: true,
              noCache: item.isCache == 0,
              title: item.menuName,
            },
          });
        } else {
          //顶级菜单
          result.unshift({
            path: '/',
            component: 'Layout',
            hidden: item.visible == 0,
            meta: {
              icon: item.icon,
              link: null,
              noCache: item.isCache == 0,
              title: item.menuName,
            },
            children: [
              {
                component: item.component,
                hidden: item.visible == 0,
                name: capitalize(item.path?.replaceAll('/', '')),
                path: item.path,
                meta: {
                  icon: item.icon,
                  link: null,
                  noCache: item.isCache == 0,
                  title: item.menuName,
                },
              },
            ],
          });
        }
      } else {
        if (!map[item[pid]]) {
          map[item[pid]] = {
            children: [],
          };
        }
        map[item[pid]].children.push(map[item[id]]);
      }
    }

    for (const k in map) {
      if (!map[k].children.length) {
        delete map[k].children;
      } else {
        map[k]['alwaysShow'] = true;
        map[k]['redirect'] = 'noRedirect';
        if (!map[k]['component']) {
          map[k]['component'] = 'ParentView';
        }
      }
    }
    return result;
  }