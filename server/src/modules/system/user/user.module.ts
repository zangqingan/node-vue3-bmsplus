import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 注册实体类操作数据库
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // 引入用户实体
import { SysUserWithRoleEntity } from './entities/user-roles.entity'; // 引入用户角色关联表用于联查用户对应角色信息
import { SysUserWithPostEntity } from './entities/user-posts.entity'; // 引入用户角色关联表用于联查用户对应角色信息
import { SysDeptEntity } from '../dept/entities/dept.entity'; // 引入部门表用于联查

@Module({
  imports: [TypeOrmModule.forFeature([User, SysUserWithRoleEntity, SysUserWithPostEntity, SysDeptEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 导出用户服务
})
export class UserModule {}
