import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';

import { CreateLoginLogDto, ListLoginLogDto } from './dto';
import { DeleteFlagEnum } from 'src/common/enum';

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

  /**
   * 日志列表-分页
   * @param query
   * @returns
   */
  async findAll(query: ListLoginLogDto) {
    const loginLogQueryResult = this.monitorLoginLogRepository.createQueryBuilder('loginLog').where('entity.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

    if (query.ipaddr) {
      loginLogQueryResult.andWhere(`loginLog.ipaddr LIKE "%${query.ipaddr}%"`);
    }

    if (query.userName) {
      loginLogQueryResult.andWhere(`loginLog.userName LIKE "%${query.userName}%"`);
    }

    if (query.status) {
      loginLogQueryResult.andWhere('loginLog.status = :status', { status: query.status });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      loginLogQueryResult.andWhere('loginLog.loginTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    if (query.orderByColumn && query.isAsc) {
      const key = query.isAsc === 'ascending' ? 'ASC' : 'DESC';
      loginLogQueryResult.orderBy(`entity.${query.orderByColumn}`, key);
    }

    loginLogQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await loginLogQueryResult.getManyAndCount();

    return { list, total };
  }

  /**
   * 删除登录日志
   * @param ids
   */
  async remove(ids: string) {
    const infoIds = ids.split(',').map((id) => +id);
    // 软删除
    return await this.monitorLoginLogRepository.update(
      { infoId: In(infoIds) },
      {
        delFlag: DeleteFlagEnum.DELETE,
      },
    );
  }

  /**
   * 删除全部日志
   * @returns
   */
  async removeAll() {
    await this.monitorLoginLogRepository.update(
      { infoId: Not(IsNull()) },
      {
        delFlag: DeleteFlagEnum.DELETE,
      },
    );
    return { message: '删除成功' };
  }
}
