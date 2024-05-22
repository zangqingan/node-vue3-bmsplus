import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 注册实体类操作数据库

import { PostService } from './post.service';
import { PostController } from './post.controller';

import { SysPostEntity } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysPostEntity])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
