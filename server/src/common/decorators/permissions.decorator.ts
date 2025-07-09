/**
 * @Permissions() 操作权限装饰器，用来声明具有哪种操作权限
 * 我们可以将其用于装饰任何方法。
 */
import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY, PERMISSION_MODE_KEY } from '@/common/constants/decorator.contant';
import { PermissionModeEnum } from '@/common/enum';
export const Permissions = (
  permissions: string[] | string,
  mode: PermissionModeEnum = PermissionModeEnum.OR, // 默认为OR模式
) => {
  const permList = Array.isArray(permissions) ? permissions : [permissions];

  return (target: any, key?: string, descriptor?: TypedPropertyDescriptor<any>) => {
    // 设置权限列表元数据
    SetMetadata(PERMISSIONS_KEY, permList)(target, key, descriptor);
    // 设置权限模式元数据
    SetMetadata(PERMISSION_MODE_KEY, mode)(target, key, descriptor);
  };
};