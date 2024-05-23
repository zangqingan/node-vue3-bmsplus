import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginLogService } from './login-log.service';
import { LoginLogController } from './login-log.controller';

import { MonitorLoginLogEntity } from './entities/login-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLoginLogEntity])],
  controllers: [LoginLogController],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
