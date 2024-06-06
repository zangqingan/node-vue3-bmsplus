import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SysConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('参数配置')
@Controller('system/config')
export class SysConfigController {
  constructor(private readonly configService: SysConfigService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    // 二分
    return this.configService.create(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.update(+id, updateConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configService.remove(+id);
  }
}
