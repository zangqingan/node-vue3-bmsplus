import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MenuService } from './menu.service';

import { CreateMenuDto, UpdateMenuDto } from './dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: '菜单管理-新增菜单' })
  @ApiBody({ type: CreateMenuDto, required: true })
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @ApiOperation({ summary: '菜单管理-列表' })
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @ApiOperation({ summary: '菜单管理-树表' })
  @Get('/treeselect')
  treeSelect() {
    return this.menuService.treeSelect();
  }

  @ApiOperation({ summary: '菜单管理-角色-树表' })
  @Get('/roleMenuTreeselect/:id')
  roleMenuTreeselect(@Param('id') id: string) {
    return this.menuService.roleMenuTreeselect(+id);
  }

  @ApiOperation({ summary: '菜单管理-详情' })
  @ApiParam({ name: 'id', description: '菜单id', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @ApiOperation({ summary: '菜单管理-修改' })
  @ApiBody({ type: UpdateMenuDto, required: true })
  @Put()
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @ApiOperation({ summary: '菜单管理-删除' })
  @ApiParam({ name: 'id', description: '菜单id', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
