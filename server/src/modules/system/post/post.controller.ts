import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, ListPostDto } from './dto';

@ApiTags('岗位管理')
@Controller('system/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '岗位管理-创建' })
  @ApiBody({ type: CreatePostDto, required: true })
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @ApiOperation({ summary: '岗位管理-列表' })
  @ApiBody({ type: ListPostDto, required: true })
  @Get('/list')
  findAll(@Query() query: ListPostDto) {
    return this.postService.findAll(query);
  }

  @ApiOperation({ summary: '岗位管理-详情' })
  @ApiParam({ name: 'id', description: '岗位id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @ApiOperation({ summary: '岗位管理-更新' })
  @ApiBody({ type: UpdatePostDto, required: true })
  @Put()
  update(@Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(updatePostDto);
  }

  @ApiOperation({ summary: '岗位管理-删除' })
  @ApiParam({ name: 'id', description: '岗位id' })
  @Delete(':id')
  remove(@Param('id') ids: string) {
    return this.postService.remove(ids);
  }
}
