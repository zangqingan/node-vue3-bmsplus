import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobLogEntity } from './entities/job-log.entity';
import { JobEntity } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobLogEntity])],

  controllers: [JobController],
  providers: [JobService],
})
export class JobModule { }
