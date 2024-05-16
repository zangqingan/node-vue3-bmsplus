import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 引入配置
import { createClient } from 'redis';
import { RedisService } from './redis.service';

/**
 * 声明为全局模块
 */
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(config: ConfigService) {
        const client = createClient({
          url: `redis://${config.get('redis.host')}:${config.get('redis.port')}`,
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
          },
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
