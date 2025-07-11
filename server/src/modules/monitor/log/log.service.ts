import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { LoginInfoEntity } from './entities/login-log.entity';
import { OperationLogEntity } from './entities/operation-log.entity';

import { CreateLoginLogDto, ListLoginLogDto, OperationLogDto, UpdateLoginLogDto } from './dto/log.dto';
import { DeleteFlagEnum } from '@/common/enum';
@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LoginInfoEntity)
    private readonly loginInfoEntityRepository: Repository<LoginInfoEntity>,
    @InjectRepository(OperationLogEntity)
    private readonly operationLogEntityRepository: Repository<OperationLogEntity>,
  ) { }

  /** 操作日志相关 */
  async addOperationLog(operationLog: OperationLogEntity) {
    return await this.operationLogEntityRepository.save(operationLog);
  }
  async deleteOperationLog(ids: string[]) {
    return await this.operationLogEntityRepository.delete(ids);
  }
  async getOperationLogList(query: OperationLogDto) {
    const operationLogQueryResult = this.operationLogEntityRepository.createQueryBuilder('operationLog').where('entity.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });
    if (query.title) {
      operationLogQueryResult.andWhere(`operationLog.title LIKE "%${query.title}%"`);
    }
    if (query.operName) {
      operationLogQueryResult.andWhere(`operationLog.operName LIKE "%${query.operName}%"`);
    }
    if (query.businessType) {
      operationLogQueryResult.andWhere('operationLog.businessType = :businessType', { businessType: query.businessType });
    }
    if (query.status) {
      operationLogQueryResult.andWhere('operationLog.status = :status', { status: query.status });
    }
    if (query.params?.beginTime && query.params?.endTime) {
      operationLogQueryResult.andWhere('operationLog.loginTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }
    operationLogQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await operationLogQueryResult.getManyAndCount();
    return { list, total };
  }

  /** 登录日志相关  */
  /**
  * 创建用户登录日志
  * @param createLoginLogDto
  * @returns
  */
  async create(createLoginLogDto: CreateLoginLogDto) {
    return await this.loginInfoEntityRepository.save(createLoginLogDto);
  }

  /**
   * 日志列表-分页
   * @param query
   * @returns
   */
  async findLoginLogAll(query: ListLoginLogDto) {
    const loginLogQueryResult = this.loginInfoEntityRepository.createQueryBuilder('loginLog').where('entity.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

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
    return await this.loginInfoEntityRepository.update(
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
    await this.loginInfoEntityRepository.update(
      { infoId: Not(IsNull()) },
      {
        delFlag: DeleteFlagEnum.DELETE,
      },
    );
    return { message: '删除成功' };
  }
}
