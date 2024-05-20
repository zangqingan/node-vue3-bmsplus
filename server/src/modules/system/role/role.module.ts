import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 注册实体类操作数据库
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SysRoleEntity } from './entities/role.entity';
import { SysRoleWithMenuEntity } from './entities/role-menu.entity';
import { SysRoleWithDeptEntity } from './entities/role-dept.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysRoleEntity, SysRoleWithMenuEntity, SysRoleWithDeptEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
