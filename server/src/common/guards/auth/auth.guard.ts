import { ExecutionContext, Injectable, Inject, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core'; // 获取自定义的元数据
import { ConfigService } from '@nestjs/config'; //获取配置
import { Request } from 'express';
import { pathToRegexp } from 'path-to-regexp';
import { Observable } from 'rxjs';

import { AuthService } from 'src/common/utils/auth/auth.service';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/modules/system/user/user.service';

/**
 * 创建自定义守卫类，防止在代码库中引入魔术字符串
 * @description 认证守卫
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private globalWhiteList = []; // 定义全局白名单列表
  constructor(
    @Inject('UserService') private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
    // 初始化默认白名单
    this.globalWhiteList = [].concat(this.configService.get('permission.router.whitelist') || []);
  }

  /**
   * 守卫方法
   * @param context 和 CanActivate 接口一致
   * @returns
   */
  async canActivate(context: ExecutionContext): Promise<any> {
    // 判断是否是公开的接口是直接放行
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    // 获取指定环境请求对象
    const request = context.switchToHttp().getRequest();
    // 从请求头中获取token
    const token = this.extractTokenFromHeader(request);
    // 没有token直接抛出异常
    if (!token) {
      throw new ForbiddenException('请重新登录');
    }
    // 有token、解密
    const user = await this.authService.parseToken(token);
    console.log('token解密', user);
    return await super.canActivate(context);
  }

  /**
   *
   * @param request 请求对象
   * @returns
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * 检查接口是否在白名单内
   * @param ctx
   * @returns
   */
  private checkWhiteList(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const i = this.globalWhiteList.findIndex((route) => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        return !!pathToRegexp(route.path).exec(req.url);
      }
      return false;
    });
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    return i > -1;
  }
}
