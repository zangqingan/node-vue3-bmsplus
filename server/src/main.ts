import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; // 引入配置服务
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 引入swagger配置

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 获取配置服务实例
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('app.port', 5000);

  // 配置swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest通用后台管理系统')
    .setDescription('Nest通用后台管理系统')
    .setVersion('1.0')
    .addBearerAuth() // 接口增加token认证
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document); // 设置访问接口地址--> http://localhost:PORT/api-docs#/ 查看swagger文档

  await app.listen(PORT);
  console.log(`server is running at http://localhost:${PORT}`);
}
bootstrap();
