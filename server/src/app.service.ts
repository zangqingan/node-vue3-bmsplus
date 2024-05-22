import * as svgCaptcha from 'svg-captcha';
import { Injectable } from '@nestjs/common';

import { RedisService } from 'src/common/utils/redis/redis.service';
import { LoginDto } from 'src/common/dto/index';
import { generateUUID } from 'src/common/utils/tools';

import { UserService } from './modules/system/user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}
  /**
   * 登录
   * @param user
   * @returns
   */
  async login(user: LoginDto): Promise<any> {
    return await this.userService.login(user);
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
