import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY, PERMISSION_MODE_KEY } from '@/common/constants/decorator.contant';
import { PermissionModeEnum } from '@/common/enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取路由所需的权限-比是一个字符串数组
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()], // 先检查方法上的权限、再检查控制器上的权限
    );

    // 获取权限模式，默认为OR模式
    const permissionMode = this.reflector.get<PermissionModeEnum>(
      PERMISSION_MODE_KEY,
      context.getHandler()
    ) ?? PermissionModeEnum.OR; // 使用空值合并运算符设置默认值

    // 如果路由未设置权限，则直接放行
    if (!requiredPermissions || requiredPermissions?.length === 0) {
      return true;
    }

    // 有设置权限，判断当前用户是否拥有权限(从请求中获取用户权限)
    // 获取指定环境请求对象
    const request = context.switchToHttp().getRequest();
    const user = JSON.parse(request.user)
    const userPermissions: string[] = user?.user?.permissions || [];
    console.log("userPermissions", userPermissions);//  

    // 拥有全部权限放行
    if (userPermissions.includes('*:*:*')) return true;
    // 检查用户是否拥有所需权限
    let hasPermission = false;
    if (permissionMode === PermissionModeEnum.AND) {
      // AND 模式 (1)：需要所有权限
      hasPermission = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );
    } else {
      // OR 模式 (0)：只需任一权限
      hasPermission = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );
    }

    if (!hasPermission) {
      throw new ForbiddenException('您没有执行此操作的权限，请联系管理员');
    }
    return true;
  }
}
