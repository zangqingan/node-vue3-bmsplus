import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SysMenuEntity } from './entities/menu.entity';
import { SysRoleWithMenuEntity } from '../role/entities/role-menu.entity';

import { DeleteFlagEnum } from 'src/common/enum';
import { listToTree } from 'src/common/utils/tools';

import { CreateMenuDto, UpdateMenuDto } from './dto';
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenuEntity)
    private readonly sysMenuRepository: Repository<SysMenuEntity>,
    @InjectRepository(SysRoleWithMenuEntity)
    private readonly sysRoleWithMenuRepository: Repository<SysRoleWithMenuEntity>,
  ) {}

  /**
   * 创建菜单
   * @param createMenuDto
   * @returns
   */
  async create(createMenuDto: CreateMenuDto) {
    return await this.sysMenuRepository.save(createMenuDto);
  }

  /**
   * 查询菜单列表
   * @returns
   */
  async findAll() {
    return await this.sysMenuRepository.find({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
  }

  /**
   * 获取菜单树
   * @returns
   */
  async treeSelect() {
    const res = await this.sysMenuRepository.find({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    const tree = listToTree(
      res,
      (m) => m.menuId,
      (m) => m.menuName,
    );
    return tree;
  }

  /**
   * 获取角色菜单树
   * @param id
   * @returns
   */
  async roleMenuTreeselect(id: number) {
    const res = await this.sysMenuRepository.find({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    const tree = listToTree(
      res,
      (m) => m.menuId,
      (m) => m.menuName,
    );
    const menuIds = await this.sysRoleWithMenuRepository.find({
      where: { roleId: id },
      select: ['menuId'],
    });
    const checkedKeys = menuIds.map((item) => {
      return item.menuId;
    });
    return {
      menus: tree,
      checkedKeys: checkedKeys,
    };
  }

  /**
   * 根据id查询菜单详情
   * @param id
   * @returns
   */
  async findOne(id: number) {
    const res = await this.sysMenuRepository.findOne({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
        menuId: id,
      },
    });
    return res;
  }

  /**
   * 更新菜单
   * @param updateMenuDto
   * @returns
   */
  async update(updateMenuDto: UpdateMenuDto) {
    return await this.sysMenuRepository.update({ menuId: updateMenuDto.menuId }, updateMenuDto);
  }

  /**
   * 删除菜单
   * @param id
   * @returns
   */
  async remove(id: number) {
    const data = await this.sysMenuRepository.update(
      { menuId: id },
      {
        delFlag: DeleteFlagEnum.DELETE,
      },
    );
    return data;
  }
}
