import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LoginLogService } from './login-log.service';

import { CreateLoginLogDto, ListLoginLogDto } from './dto';

@ApiTags('登录日志')
@Controller('monitor/loginLog')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @Post()
  create(@Body() createLoginlogDto: CreateLoginLogDto) {
    return this.loginLogService.create(createLoginlogDto);
  }

  @ApiOperation({ summary: '登录日志-列表' })
  @ApiBody({ type: ListLoginLogDto, required: true })
  @Get('/list')
  findAll(@Query() query: ListLoginLogDto) {
    return this.loginLogService.findAll(query);
  }

  @ApiOperation({ summary: '登录日志-删除日志' })
  @Delete(':id')
  remove(@Param('id') ids: string) {
    return this.loginLogService.remove(ids);
  }

  @ApiOperation({ summary: '登录日志-清除全部日志' })
  @Delete('/clean')
  removeAll() {
    return this.loginLogService.removeAll();
  }
}
