import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from 'src/common/utils/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly redisService: RedisService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
    const uniqueId = uuidv4();
    await this.redisService.set(uniqueId, captcha.text, 60);

    // 对数据部分加密并返回
    const svgData = Buffer.from(captcha.data).toString('base64');
    return {
      uniqueId,
      svgData,
    };
  }
}
