import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '@/common/constants/decorator.contant';
import { RolesObjType } from '@/common/decorators/roles.decorator';
import { RoleLogicEnum } from '@/common/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取当前方法上的权限信息
    const currentRoles = this.reflector.getAllAndOverride<RolesObjType>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果当前方法未设置权限，则直接放行
    if (!currentRoles || currentRoles.roleArr?.length === 0) {
      return true;
    }

    // 获取当前用户信息
    const request = context.switchToHttp().getRequest();
    const user = JSON.parse(request.user)
    const userRoles: string[] = user?.user?.roles || [];
    console.log("userRoles", userRoles);
    // 实际应该从redis中取？

    // 管理员角色拥有所有权限放行
    if (userRoles.includes('admin')) {
      return true;
    }

    // 当前用户角色和需要角色判断
    let hasRoles = false;
    if (currentRoles.logical === RoleLogicEnum.AND) {
      // AND 模式 (1)：需要所有权限
      hasRoles = userRoles.every((role) => currentRoles.roleArr.includes(role));
    } else {
      // OR 模式 (0)：只需任一权限
      hasRoles = userRoles.some((role) => currentRoles.roleArr.includes(role));
    }

    if (!hasRoles) {
      throw new ForbiddenException('您没有角色权限，请联系管理员');
    }
    return true;
  }
}
