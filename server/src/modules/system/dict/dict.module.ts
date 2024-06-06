import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 注册实体类操作数据库
import { DictService } from './dict.service';
import { DictController } from './dict.controller';

import { SysDictDataEntity } from './entities/dict-data.entity';
import { SysDictTypeEntity } from './entities/dict-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysDictDataEntity, SysDictTypeEntity])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
