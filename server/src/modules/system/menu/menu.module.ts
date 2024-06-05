import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

import { SysMenuEntity } from './entities/menu.entity';
import { SysRoleWithMenuEntity } from '../role/entities/role-menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysMenuEntity, SysRoleWithMenuEntity])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
