import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { DeleteFlagEnum } from 'src/common/enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import { SysRoleEntity } from './entities/role.entity';
import { SysRoleWithDeptEntity } from './entities/role-dept.entity';
import { SysRoleWithMenuEntity } from './entities/role-menu.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(SysRoleEntity)
    private readonly sysRoleRepository: Repository<SysRoleEntity>,
    @InjectRepository(SysRoleWithDeptEntity)
    private readonly sysRoleWithDeptRepository: Repository<SysRoleWithDeptEntity>,
    @InjectRepository(SysRoleWithMenuEntity)
    private readonly sysRoleWithMenuRepository: Repository<SysRoleWithMenuEntity>,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  /**
   * 根据角色id数组查询角色信息
   * @param roleIds 角色id数组
   * @returns 角色id数组对应的角色对象信息数组
   */
  async findRoleByIds(roleIds: number[]) {
    return await this.sysRoleRepository.find({ where: { roleId: In(roleIds), delFlag: DeleteFlagEnum.NORMAL } });
  }

  /**
   * @returns 查询所有角色
   */
  async findAll() {
    return await this.sysRoleRepository.find({ where: { delFlag: DeleteFlagEnum.NORMAL } });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
