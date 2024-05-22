import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; //导入配置模块
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; // 配置连接数据库
import { APP_GUARD } from '@nestjs/core'; // 全局注册守卫等

import configuration from './config'; // 自定义的配置项
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './modules/system/user/user.module';
import { RoleModule } from './modules/system/role/role.module';
import { PostModule } from './modules/system/post/post.module';
import { DeptModule } from './modules/system/dept/dept.module';
import { MenuModule } from './modules/system/menu/menu.module';
import { DictModule } from './modules/system/dict/dict.module';
import { NoticeModule } from './modules/system/notice/notice.module';
import { SysConfigModule } from './modules/system/config/config.module';
import { LoginLogModule } from './modules/monitor/login-log/login-log.module';
import { OperationLogModule } from './modules/monitor/operation-log/operation-log.module';
import { RedisModule } from './common/utils/redis/redis.module';
import { AuthModule } from './common/utils/auth/auth.module';

import { JwtAuthGuard } from './common/guards/auth/auth.guard';

@Module({
  imports: [
    // 注册 ConfigService 提供者实现配置项的读取
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    // 注册 TypeOrmModule 提供者实现数据库的连接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 引入配置模块
      inject: [ConfigService], // 注入配置服务以便读取配置文件中的内容
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          keepConnectionAlive: true,
          synchronize: false,
          entities: [`${__dirname}/**/*.entity{.ts,.js}`], // 加载所有的实体文件
          autoLoadEntities: true,
          ...configService.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    UserModule,
    RoleModule,
    PostModule,
    DeptModule,
    MenuModule,
    DictModule,
    NoticeModule,
    SysConfigModule,
    LoginLogModule,
    OperationLogModule,
    RedisModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
