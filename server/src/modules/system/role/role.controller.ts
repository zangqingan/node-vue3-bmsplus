import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, ListRoleDto, UpdateRoleDto, ChangeStatusDto } from './dto/index';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '角色管理-创建角色' })
  @ApiBody({ type: CreateRoleDto, required: true })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: '角色管理-角色列表' })
  @ApiBody({ type: ListRoleDto, required: true })
  @Get('/list')
  findAll(@Query() query: ListRoleDto) {
    return this.roleService.findAll(query);
  }

  @ApiOperation({ summary: '角色管理-部门树' })
  @ApiParam({ name: 'id', description: '部门id' })
  @Get('/deptTree/:id')
  deptTree(@Param('id') id: string) {
    return this.roleService.deptTree(+id);
  }

  @ApiOperation({ summary: '角色管理-角色详情' })
  @ApiParam({ name: 'id', description: '角色id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @ApiOperation({ summary: '角色管理-修改' })
  @ApiBody({ type: UpdateRoleDto, required: true })
  @Put()
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @ApiOperation({ summary: '角色管理-数据权限修改' })
  @ApiBody({ type: UpdateRoleDto, required: true })
  @Put('/dataScope')
  dataScope(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.dataScope(updateRoleDto);
  }

  @ApiOperation({ summary: '角色管理-停用角色' })
  @ApiBody({ type: ChangeStatusDto, required: true })
  @Put('/changeStatus')
  changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return this.roleService.changeStatus(changeStatusDto);
  }

  @ApiOperation({ summary: '角色管理-删除角色' })
  @ApiParam({ name: 'id', description: '角色id' })
  @Delete(':id')
  remove(@Param('id') ids: string) {
    return this.roleService.remove(ids);
  }
}
