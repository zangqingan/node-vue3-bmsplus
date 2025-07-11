import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogService } from './log.service';
import { LogController } from './log.controller';

import { LoginInfoEntity } from './entities/login-log.entity';
import { OperationLogEntity } from './entities/operation-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginInfoEntity, OperationLogEntity])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule { }
