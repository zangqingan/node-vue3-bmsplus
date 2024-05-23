import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { CreateLoginLogDto } from './dto/create-loginlog.dto';
import { UpdateLoginLogDto } from './dto/update-loginlog.dto';

import { MonitorLoginLogEntity } from './entities/login-log.entity';

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(MonitorLoginLogEntity)
    private readonly monitorLoginLogRepository: Repository<MonitorLoginLogEntity>,
  ) {}

  /**
   * 创建用户登录日志
   * @param createLoginLogDto
   * @returns
   */
  async create(createLoginLogDto: CreateLoginLogDto) {
    return await this.monitorLoginLogRepository.save(createLoginLogDto);
  }

  findAll() {
    return `This action returns all loginlog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loginlog`;
  }

  update(id: number, updateLoginLogDto: UpdateLoginLogDto) {
    return `This action updates a #${id} loginlog`;
  }

  async remove(ids: number[]) {
    // 软删除
    return await this.monitorLoginLogRepository.update(
      { infoId: In(ids) },
      {
        delFlag: '1',
      },
    );
  }
}
