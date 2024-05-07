import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; // 引入配置服务

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 获取配置服务实例
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('app.port', 5000);
  await app.listen(PORT);
  console.log(`server is running at http://localhost:${PORT}`);
}
bootstrap();
