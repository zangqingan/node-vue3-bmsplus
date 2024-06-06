import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SysNoticeEntity } from './entities/notice.entity';
import { DeleteFlagEnum } from 'src/common/enum';

import { CreateNoticeDto, UpdateNoticeDto, ListNoticeDto } from './dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(SysNoticeEntity)
    private readonly sysNoticeRepository: Repository<SysNoticeEntity>,
  ) {}
  async create(createNoticeDto: CreateNoticeDto) {
    return await this.sysNoticeRepository.save(createNoticeDto);
  }

  async findAll(query: ListNoticeDto) {
    const noticeQueryResult = this.sysNoticeRepository.createQueryBuilder('notice').where('notice.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

    if (query.noticeTitle) {
      noticeQueryResult.andWhere(`notice.noticeTitle LIKE "%${query.noticeTitle}%"`);
    }

    if (query.createBy) {
      noticeQueryResult.andWhere(`notice.createBy LIKE "%${query.createBy}%"`);
    }

    if (query.noticeType) {
      noticeQueryResult.andWhere('notice.noticeType = :noticeType', { noticeType: query.noticeType });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      noticeQueryResult.andWhere('notice.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    noticeQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await noticeQueryResult.getManyAndCount();

    return { list, total };
  }

  async findOne(id: number) {
    const data = await this.sysNoticeRepository.findOne({
      where: {
        noticeId: id,
      },
    });
    return data;
  }

  async update(updateNoticeDto: UpdateNoticeDto) {
    await this.sysNoticeRepository.update(
      {
        noticeId: updateNoticeDto.noticeId,
      },
      updateNoticeDto,
    );
    return { message: '更新成功' };
  }

  async remove(ids: string) {
    const noticeIds = ids.split(',').map((id) => +id);
    const data = await this.sysNoticeRepository.update(
      { noticeId: In(noticeIds) },
      {
        delFlag: DeleteFlagEnum.DELETE,
      },
    );
    return data;
  }
}
