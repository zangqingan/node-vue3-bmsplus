import { Controller, Post, Body, HttpCode, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginDto } from 'src/common/dto/index';

@ApiTags('公共接口')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '测试接口' })
  @Get('/test')
  @HttpCode(200)
  async test(): Promise<string> {
    return 'test';
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto, required: true })
  @Post('/login')
  @HttpCode(200)
  async login(@Body() user: LoginDto): Promise<LoginDto> {
    return this.appService.login(user);
  }

  @ApiOperation({ summary: '获取验证码' })
  @Get('/captchaImage')
  captchaImage() {
    return this.appService.generateCaptcha();
  }
}
