import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';//导入配置模块
import configuration from './config';// 自定义的配置项
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';// 配置连接数据库
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PostModule } from './modules/post/post.module';
import { DeptModule } from './modules/system/dept/dept.module';
import { MenuModule } from './modules/system/menu/menu.module';
import { DictModule } from './modules/system/dict/dict.module';
import { NoticeModule } from './modules/system/notice/notice.module';
import { ConfigModule } from './modules/system/config/config.module';

@Module({
  imports: [
    // 注册 ConfigService 提供者实现配置项的读取
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration]
    }),
    // 注册 TypeOrmModule 提供者实现数据库的连接
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],// 引入配置模块
      inject:[ConfigService],// 注入配置服务以便读取配置文件中的内容
      useFactory:(configService:ConfigService)=>{
        return {
          type: 'mysql',
          ...configService.get('db.mysql'),
          keepConnectionAlive: true,
          synchronize: false,
          autoLoadEntities: true,
        } as TypeOrmModuleOptions;
      }
    }),
    UserModule,
    RoleModule,
    PostModule,
    DeptModule,
    MenuModule,
    DictModule,
    NoticeModule,
    ConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
