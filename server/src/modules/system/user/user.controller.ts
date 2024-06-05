import { Controller, Get, Post, Body, Put, Param, Delete, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';

import { UserService } from './user.service';

import { ListUserDto, CreateUserDto, UpdateUserDto, ChangeStatusDto, ResetPwdDto } from './dto/index';

@ApiTags('用户管理')
@Controller('system/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '新建用户' })
  @ApiBody({ type: CreateUserDto, required: true })
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

  @ApiOperation({ summary: '获取指定用户详情' })
  @ApiParam({ name: 'id', description: 'User ID', required: true, type: Number })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiBody({ type: UpdateUserDto, required: true })
  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @ApiOperation({ summary: '用户- 停用角色' })
  @ApiBody({ type: ChangeStatusDto, required: true })
  @Put('/changeStatus')
  changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return this.userService.changeStatus(changeStatusDto);
  }

  @ApiOperation({ summary: '重置密码' })
  @ApiBody({ type: ResetPwdDto, required: true })
  @Put('/resetPwd')
  resetPassword(@Body() resetPwdDto: ResetPwdDto) {
    return this.userService.resetPwd(resetPwdDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'userId', description: '用户id、批量删除时,分隔', required: true, type: String })
  @Delete(':id')
  remove(@Param('id') ids: string) {
    return this.userService.remove(ids);
  }
}
