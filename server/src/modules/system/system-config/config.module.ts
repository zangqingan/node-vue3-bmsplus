import { Module } from '@nestjs/common';
import { SysConfigService } from './config.service';
import { SysConfigController } from './config.controller';

@Module({
  controllers: [SysConfigController],
  providers: [SysConfigService],
})
export class SysConfigModule {}
