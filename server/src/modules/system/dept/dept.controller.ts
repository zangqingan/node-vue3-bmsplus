import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { DeptService } from './dept.service';
import { CreateDeptDto, UpdateDeptDto } from './dto';

@ApiTags('部门管理')
@Controller('system/dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @ApiOperation({ summary: '部门管理-创建' })
  @ApiBody({ type: CreateDeptDto, required: true })
  @Post()
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto);
  }

  @ApiOperation({ summary: '部门管理-列表' })
  @Get('/list')
  findAll() {
    return this.deptService.findAll();
  }

  @ApiOperation({ summary: '部门管理-详情' })
  @ApiParam({ name: 'id', description: '部门id', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(+id);
  }

  @ApiOperation({ summary: '部门管理-黑名单' })
  @Get('/list/exclude/:id')
  findListExclude(@Param('id') id: string) {
    return this.deptService.findListExclude(id);
  }

  @ApiOperation({ summary: '部门管理-更新' })
  @ApiBody({ type: UpdateDeptDto, required: true })
  @Put()
  update(@Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(updateDeptDto);
  }

  @ApiOperation({ summary: '部门管理-删除' })
  @ApiParam({ name: 'id', description: '部门id', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deptService.remove(+id);
  }
}
