import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';

import { UserService } from './user.service';
import { ListUserDto } from './dto/index';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户管理')
@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '获取用户列表' })
  @Get('/list')
  findAll(@Query() query: ListUserDto, @Request() req) {
    const user = req.user.user;
    return this.userService.findAll(query, user);
  }

  @ApiOperation({ summary: '获取指定用户' })
  @ApiParam({ name: 'userId', description: 'User ID', required: true, type: Number })
  @Get(':userId')
  findOne(@Param('userId') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') ids: string) {
    return this.userService.remove(ids);
  }
}
