import * as svgCaptcha from 'svg-captcha';
import { HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './modules/system/user/user.service';
import { LoginLogService } from './modules/monitor/login-log/login-log.service';

import { RedisService } from 'src/common/utils/redis/redis.service';
import { LoginDto } from 'src/common/dto/index';
import { generateUUID, getClientInfo } from 'src/common/utils/tools';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
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
      const result = await this.userService.login(user);
      userLoginInfo.msg = '登录成功';
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
   * 生成验证码
   */
  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 6, // 验证码长度
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
}
