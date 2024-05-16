import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; // 引入配置服务
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 引入swagger配置
import { rateLimit } from 'express-rate-limit'; // 引入限流中间件
import helmet from 'helmet'; // 引入helmet防常见漏洞
import { mw } from 'request-ip'; // 引入获取请求真实ip

import { ValidationPipePipe } from './common/pipes/validation-pipe/validation-pipe.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取配置服务实例
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('app.port', 5000);

  // 设置限流中间件
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    }),
  );

  // 设置helmet防常见漏洞
  app.use(helmet());

  // 获取请求的真实ip地址默认挂载在 req.clientIp 属性上
  app.use(mw());

  // 配置swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest通用后台管理系统')
    .setDescription('Nest通用后台管理系统')
    .setVersion('1.0')
    .addBearerAuth() // 接口增加token认证
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document); // 设置访问接口地址--> http://localhost:PORT/api-docs#/ 查看swagger文档

  app.useGlobalPipes(new ValidationPipePipe()); // 全局注册参数验证管道
  app.useGlobalInterceptors(new TransformInterceptor()); // 全局注册返回数据格式化响应拦截器
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局注册异常处理过滤器

  await app.listen(PORT);
  console.log(`server is running at http://localhost:${PORT}`);
}
bootstrap();
