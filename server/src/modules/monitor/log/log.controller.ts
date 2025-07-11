import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { LogService } from './log.service';
import { OperationLogDto, ListLoginLogDto } from './dto/log.dto';


import { Permissions } from '@/common/decorators/permissions.decorator';


@ApiTags('日志管理')
@Controller('monitor')
export class LogController {
  constructor(private readonly logService: LogService) { }

  /** 操作日志相关 */


  @ApiOperation({ summary: '查询操作日志列表' })
  @ApiQuery({ name: 'query', type: OperationLogDto })
  @Get('operlog/list')
  @Permissions('monitor:operlog:query')
  async getOperationLogList(@Query() query: OperationLogDto) {
    return await this.logService.getOperationLogList(query);
  }

  /** 登录日志相关 */
  @ApiOperation({ summary: '查询登录日志列表' })
  @ApiQuery({ name: 'query', type: ListLoginLogDto })
  @Get('logininfor/list')
  @Permissions('monitor:logininfor:query')
  async getLoginLogList(@Query() query: ListLoginLogDto) {
    return await this.logService.findLoginLogAll(query);
  }
}
