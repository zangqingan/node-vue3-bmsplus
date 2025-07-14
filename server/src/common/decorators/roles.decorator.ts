/**
 * @Public() 装饰器，用来声明哪些路由是公开的
 * 我们可以将其用于装饰任何方法。
 */
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@/common/constants/decorator.contant';
import { RoleLogicEnum } from '@/common/enum';

export type RolesObjType = {
  roleArr: string[];
  logical: RoleLogicEnum;
};

export const Roles = (
  roles: string | string[],  // 支持字符串或数组形式, 
  logic: RoleLogicEnum = RoleLogicEnum.OR // 默认使用 OR 逻辑
) => {
  // 统一转换为字符串数组
  const roleArray = Array.isArray(roles) ? roles : [roles];
  // 存储元数据：角色数组和验证逻辑
  return SetMetadata(ROLES_KEY, {
    roles: roleArray,
    logic
  });
}