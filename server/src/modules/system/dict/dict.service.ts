import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { RedisService } from 'src/common/utils/redis/redis.service';

import { CreateDictDto, UpdateDictDto, ListDictType, ListDictData, CreateDictDataDto, UpdateDictDataDto } from './dto';
import { DeleteFlagEnum, CacheEnum } from 'src/common/enum';

import { SysDictDataEntity } from './entities/dict-data.entity';
import { SysDictTypeEntity } from './entities/dict-type.entity';
@Injectable()
export class DictService {
  constructor(
    @InjectRepository(SysDictDataEntity)
    private readonly sysDictDataRepository: Repository<SysDictDataEntity>,
    @InjectRepository(SysDictTypeEntity)
    private readonly sysDictTypeRepository: Repository<SysDictTypeEntity>,

    private readonly redisService: RedisService,
  ) {}

  /**
   * 创建字典类型
   * @param CreateDictTypeDto
   */
  async createType(CreateDictTypeDto: CreateDictDto) {
    await this.sysDictTypeRepository.save(CreateDictTypeDto);
    return { message: '创建成功' };
  }

  /**
   * 删除字典类型
   * @param ids
   */
  async deleteType(ids: string) {
    const dictIds = ids.split(',').map((id) => +id);
    await this.sysDictTypeRepository.update({ dictId: In(dictIds) }, { delFlag: DeleteFlagEnum.DELETE });
    return { message: '删除成功' };
  }

  async updateType(updateDictTypeDto: UpdateDictDto) {
    await this.sysDictTypeRepository.update({ dictId: updateDictTypeDto.dictId }, updateDictTypeDto);
    return { message: '修改成功' };
  }

  async findAllType(query: ListDictType) {
    const dictTypeQueryResult = this.sysDictTypeRepository.createQueryBuilder('dictType').where('dictType.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

    if (query.dictName) {
      dictTypeQueryResult.andWhere(`dictType.dictName LIKE "%${query.dictName}%"`);
    }

    if (query.dictType) {
      dictTypeQueryResult.andWhere(`dictType.dictType LIKE "%${query.dictType}%"`);
    }

    if (query.status) {
      dictTypeQueryResult.andWhere('dictType.status = :status', { status: query.status });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      dictTypeQueryResult.andWhere('dictType.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    dictTypeQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await dictTypeQueryResult.getManyAndCount();

    return { list, total };
  }

  async findOneType(id: number) {
    const data = await this.sysDictTypeRepository.findOne({
      where: {
        dictId: id,
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return data;
  }

  async findOptionselect() {
    const data = await this.sysDictTypeRepository.find({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return data;
  }

  // 字典数据
  async createDictData(createDictDataDto: CreateDictDataDto) {
    return await this.sysDictDataRepository.save(createDictDataDto);
  }

  async deleteDictData(id: number) {
    return await this.sysDictDataRepository.update({ dictCode: id }, { delFlag: DeleteFlagEnum.DELETE });
  }

  async updateDictData(updateDictDataDto: UpdateDictDataDto) {
    return await this.sysDictDataRepository.update({ dictCode: updateDictDataDto.dictCode }, updateDictDataDto);
  }

  async findAllData(query: ListDictData) {
    const dictDataQueryResult = this.sysDictDataRepository.createQueryBuilder('dictData').where('entity.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

    if (query.dictLabel) {
      dictDataQueryResult.andWhere(`dictData.dictLabel LIKE "%${query.dictLabel}%"`);
    }

    if (query.dictType) {
      dictDataQueryResult.andWhere(`dictData.dictType LIKE "%${query.dictType}%"`);
    }

    if (query.status) {
      dictDataQueryResult.andWhere('dictData.status = :status', { status: query.status });
    }

    dictDataQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await dictDataQueryResult.getManyAndCount();

    return { list, total };
  }

  /**
   * 根据字典类型查询一个数据类型的信息。
   *
   * @param dictType 字典类型字符串。
   * @returns 返回查询到的数据类型信息，如果未查询到则返回空。
   */
  async findOneDataType(dictType: string) {
    // TODO: 先查询字典类型是否被删除，以下代码被注释
    // const dictTypeData = await this.sysDictTypeEntityRep.findOne({
    //   where: {
    //     dictType: dictType,
    //     delFlag: '0',
    //   },
    // });

    // 尝试从Redis缓存中获取字典数据
    let data: any = await this.redisService.get(`${CacheEnum.SYS_DICT_KEY}${dictType}`);

    if (data) {
      // 如果缓存中存在，则直接返回缓存数据
      return data;
    }

    // 从数据库中查询字典数据
    data = await this.sysDictDataRepository.find({
      where: {
        dictType: dictType,
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });

    // 将查询到的数据存入Redis缓存，并返回数据
    await this.redisService.set(`${CacheEnum.SYS_DICT_KEY}${dictType}`, data);
    return data;
  }

  async findOneDictData(dictCode: number) {
    const data = await this.sysDictDataRepository.findOne({
      where: {
        dictCode,
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return data;
  }
}
