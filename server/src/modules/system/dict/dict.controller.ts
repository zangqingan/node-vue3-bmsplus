import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DictService } from './dict.service';
import { CreateDictDto, UpdateDictDto, ListDictType, ListDictData, CreateDictDataDto, UpdateDictDataDto } from './dto';

@ApiTags('字典管理')
@Controller('system/dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @ApiOperation({ summary: '字典类型-创建' })
  @ApiBody({ type: CreateDictDto, required: true })
  @Post('/type')
  createType(@Body() createDictTypeDto: CreateDictDto) {
    return this.dictService.createType(createDictTypeDto);
  }

  @ApiOperation({ summary: '字典类型-修改' })
  @Put('/type')
  updateType(@Body() updateDictTypeDto: UpdateDictDto) {
    return this.dictService.updateType(updateDictTypeDto);
  }

  @ApiOperation({ summary: '字典类型-列表' })
  @ApiQuery({ name: 'dictType', description: '字典查询条件', type: ListDictType })
  @Get('/type/list')
  findAllType(@Query() query: ListDictType) {
    return this.dictService.findAllType(query);
  }

  @ApiOperation({ summary: '全部字典类型-下拉数据' })
  @Get('/type/optionselect')
  findOptionselect() {
    return this.dictService.findOptionselect();
  }

  @ApiOperation({ summary: '字典类型-详情' })
  @Get('/type/:id')
  findOneType(@Param('id') id: number) {
    return this.dictService.findOneType(+id);
  }

  @ApiOperation({ summary: '字典类型-删除' })
  @ApiParam({ name: 'id', required: true })
  @Delete('/type/:id')
  deleteType(@Param('id') ids: string) {
    return this.dictService.deleteType(ids);
  }

  // 字典数据
  @ApiOperation({ summary: '字典数据-创建' })
  @Post('/data')
  createDictData(@Body() createDictDataDto: CreateDictDataDto) {
    return this.dictService.createDictData(createDictDataDto);
  }

  @ApiOperation({ summary: '字典数据-删除' })
  @Delete('/data/:id')
  deleteDictData(@Param('id') id: string) {
    return this.dictService.deleteDictData(+id);
  }

  @ApiOperation({ summary: '字典数据-修改' })
  @Put('/data')
  updateDictData(@Body() updateDictDataDto: UpdateDictDataDto) {
    return this.dictService.updateDictData(updateDictDataDto);
  }

  @ApiOperation({ summary: '字典数据-列表' })
  @Get('/data/list')
  findAllData(@Query() query: ListDictData) {
    return this.dictService.findAllData(query);
  }

  @ApiOperation({ summary: '字典数据-详情' })
  @Get('/data/:id')
  findOneDictData(@Param('id') dictCode: string) {
    return this.dictService.findOneDictData(+dictCode);
  }

  @ApiOperation({ summary: '字典数据-类型-详情[走缓存]' })
  @Get('/data/type/:id')
  findOneDataType(@Param('id') dictType: string) {
    return this.dictService.findOneDataType(dictType);
  }
}
