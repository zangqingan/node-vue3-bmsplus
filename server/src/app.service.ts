import * as svgCaptcha from 'svg-captcha';
import { HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './modules/system/user/user.service';
import { AxiosService } from 'src/common/utils/axios/axios.service';
import { LoginLogService } from './modules/monitor/login-log/login-log.service';

import { RedisService } from 'src/common/utils/redis/redis.service';
import { LoginDto, RegisterDto } from 'src/common/dto/index';
import { generateUUID, getClientInfo } from 'src/common/utils/tools';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly axiosService: AxiosService,
    private readonly loginLogService: LoginLogService,
  ) {}

  /**
   * 登录
   * @param user
   * @returns token
   */
  async login(user: LoginDto, req: Request): Promise<any> {
    // 查询用户客户端信息
    const clientInfo = getClientInfo(req);
    // 构建用户登录日志信息
    const userLoginInfo = {
      ...clientInfo,
      userName: user.userName,
      status: '0',
      msg: '',
    };
    try {
      // 获取ip对应的地址信息
      const addressInfo = await this.axiosService.getIpAddress(clientInfo.ipAddr);
      userLoginInfo.loginLocation = addressInfo;
      // 登录
      const result = await this.userService.login(user);
      userLoginInfo.msg = result.message;
      return result;
    } catch (error) {
      // 发生错误时修改登录日志信息
      userLoginInfo.status = '1';
      userLoginInfo.msg = error.message;
      // 把异常重新抛出去
      throw new HttpException(error.message, error.status);
    } finally {
      // 存储登录日志
      await this.loginLogService.create(userLoginInfo);
    }
  }

  /**
   * 注册
   * @param user
   * @returns
   */
  async register(user: RegisterDto) {
    return await this.userService.register(user);
  }

  /**
   * 退出登录
   */
  async logout() {
    return { message: '退出成功' };
  }

  /**
   * 生成验证码
   */
  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: '0o1i', // 排除 0o1i
      noise: 2, // 噪声线条数量
      color: true, // 验证码的字符有颜色，而不是黑白
      background: '#cc9966', // 背景颜色
    });

    // 生成唯一id,并对验证码进行存储同时设置60s有效期
    const uniqueId = generateUUID();
    await this.redisService.set(uniqueId, captcha.text, 60);

    // 对数据部分加密并返回
    const svgData = Buffer.from(captcha.data).toString('base64');
    return {
      uniqueId,
      svgData,
    };
  }

  /**
   * 获取用户信息
   * @param userId
   * @returns
   */
  async getInfo(req) {
    // 会从redis中获取缓存的用户信息
    const user = JSON.parse(req.user);
    return {
      message: '操作成功',
      user: { ...user.user },
    };
  }

  async getRoutes() {
    return {
      message: '操作成功',
      data: [
        {
          name: 'System',
          path: '/system',
          hidden: false,
          redirect: 'noRedirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '系统管理',
            icon: 'system',
            noCache: false,
            link: null,
          },
          children: [
            {
              name: 'User',
              path: 'user',
              hidden: false,
              component: 'system/user/index',
              meta: {
                title: '用户管理',
                icon: 'user',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Role',
              path: 'role',
              hidden: false,
              component: 'system/role/index',
              meta: {
                title: '角色管理',
                icon: 'peoples',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Menu',
              path: 'menu',
              hidden: false,
              component: 'system/menu/index',
              meta: {
                title: '菜单管理',
                icon: 'tree-table',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Dept',
              path: 'dept',
              hidden: false,
              component: 'system/dept/index',
              meta: {
                title: '部门管理',
                icon: 'tree',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Post',
              path: 'post',
              hidden: false,
              component: 'system/post/index',
              meta: {
                title: '岗位管理',
                icon: 'post',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Dict',
              path: 'dict',
              hidden: false,
              component: 'system/dict/index',
              meta: {
                title: '字典管理',
                icon: 'dict',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Config',
              path: 'config',
              hidden: false,
              component: 'system/config/index',
              meta: {
                title: '参数设置',
                icon: 'edit',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Notice',
              path: 'notice',
              hidden: false,
              component: 'system/notice/index',
              meta: {
                title: '通知公告',
                icon: 'message',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Log',
              path: 'log',
              hidden: false,
              redirect: 'noRedirect',
              component: 'ParentView',
              alwaysShow: true,
              meta: {
                title: '日志管理',
                icon: 'log',
                noCache: false,
                link: null,
              },
              children: [
                {
                  name: 'Operlog',
                  path: 'operlog',
                  hidden: false,
                  component: 'monitor/operlog/index',
                  meta: {
                    title: '操作日志',
                    icon: 'form',
                    noCache: false,
                    link: null,
                  },
                },
                {
                  name: 'Logininfor',
                  path: 'logininfor',
                  hidden: false,
                  component: 'monitor/logininfor/index',
                  meta: {
                    title: '登录日志',
                    icon: 'logininfor',
                    noCache: false,
                    link: null,
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'Monitor',
          path: '/monitor',
          hidden: false,
          redirect: 'noRedirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '系统监控',
            icon: 'monitor',
            noCache: false,
            link: null,
          },
          children: [
            {
              name: 'Online',
              path: 'online',
              hidden: false,
              component: 'monitor/online/index',
              meta: {
                title: '在线用户',
                icon: 'online',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Job',
              path: 'job',
              hidden: false,
              component: 'monitor/job/index',
              meta: {
                title: '定时任务',
                icon: 'job',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Druid',
              path: 'druid',
              hidden: false,
              component: 'monitor/druid/index',
              meta: {
                title: '数据监控',
                icon: 'druid',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Server',
              path: 'server',
              hidden: false,
              component: 'monitor/server/index',
              meta: {
                title: '服务监控',
                icon: 'server',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Cache',
              path: 'cache',
              hidden: false,
              component: 'monitor/cache/index',
              meta: {
                title: '缓存监控',
                icon: 'redis',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'CacheList',
              path: 'cacheList',
              hidden: false,
              component: 'monitor/cache/list',
              meta: {
                title: '缓存列表',
                icon: 'redis-list',
                noCache: false,
                link: null,
              },
            },
          ],
        },
        {
          name: 'Tool',
          path: '/tool',
          hidden: false,
          redirect: 'noRedirect',
          component: 'Layout',
          alwaysShow: true,
          meta: {
            title: '系统工具',
            icon: 'tool',
            noCache: false,
            link: null,
          },
          children: [
            {
              name: 'Build',
              path: 'build',
              hidden: false,
              component: 'tool/build/index',
              meta: {
                title: '表单构建',
                icon: 'build',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Gen',
              path: 'gen',
              hidden: false,
              component: 'tool/gen/index',
              meta: {
                title: '代码生成',
                icon: 'code',
                noCache: false,
                link: null,
              },
            },
            {
              name: 'Swagger',
              path: 'swagger',
              hidden: false,
              component: 'tool/swagger/index',
              meta: {
                title: '系统接口',
                icon: 'swagger',
                noCache: false,
                link: null,
              },
            },
          ],
        },
      ],
    };
  }
}
