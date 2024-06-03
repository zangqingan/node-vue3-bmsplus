import { Controller, Post, Body, HttpCode, Get, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

import { LoginDto, RegisterDto } from 'src/common/dto/index';

@ApiTags('公共接口')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '测试接口' })
  @Get('/test')
  @HttpCode(200)
  async test(@Request() req): Promise<any> {
    console.log(req.clientIp);
    return 'result';
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto, required: true })
  @Post('/login')
  @HttpCode(200)
  async login(@Body() user: LoginDto, @Request() req): Promise<object> {
    return this.appService.login(user, req);
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDto, required: true })
  @Post('/register')
  @HttpCode(200)
  async register(@Body() user: RegisterDto): Promise<object> {
    return this.appService.register(user);
  }

  @ApiOperation({ summary: '获取验证码' })
  @Get('/captchaImage')
  captchaImage() {
    return this.appService.generateCaptcha();
  }
}
