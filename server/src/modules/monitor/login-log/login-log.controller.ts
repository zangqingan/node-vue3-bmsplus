import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginLogService } from './login-log.service';
import { CreateLoginlogDto } from './dto/create-loginlog.dto';
import { UpdateLoginlogDto } from './dto/update-loginlog.dto';

@Controller('login-log')
export class LoginLogController {
  constructor(private readonly loginlogService: LoginLogService) {}

  @Post()
  create(@Body() createLoginlogDto: CreateLoginlogDto) {
    return this.loginlogService.create(createLoginlogDto);
  }

  @Get()
  findAll() {
    return this.loginlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginlogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoginlogDto: UpdateLoginlogDto) {
    return this.loginlogService.update(+id, updateLoginlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginlogService.remove(+id);
  }
}
