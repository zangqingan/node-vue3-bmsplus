import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { LoginLogService } from './login-log.service';

import { CreateLoginLogDto } from './dto/create-loginlog.dto';
import { UpdateLoginLogDto } from './dto/update-loginlog.dto';

@ApiTags('登录日志')
@Controller('monitor/loginLog')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @Post()
  create(@Body() createLoginlogDto: CreateLoginLogDto) {
    return this.loginLogService.create(createLoginlogDto);
  }

  @Get()
  findAll() {
    return this.loginLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoginlogDto: UpdateLoginLogDto) {
    return this.loginLogService.update(+id, updateLoginlogDto);
  }

  @Delete(':id')
  remove(@Param('id') ids: string) {
    const infoIds = ids.split(',').map((id) => +id);
    return this.loginLogService.remove(infoIds);
  }
}
