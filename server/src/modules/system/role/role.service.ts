import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { DeptService } from '../dept/dept.service';

import { DeleteFlagEnum, DataScopeEnum } from 'src/common/enum';
import { CreateRoleDto, ListRoleDto, UpdateRoleDto, ChangeStatusDto } from './dto/index';

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

    private readonly deptService: DeptService,
  ) {}

  /**
   * 创建角色
   * @param createRoleDto
   */
  async create(createRoleDto: CreateRoleDto) {
    // 保存生成新角色
    const result = await this.sysRoleRepository.save(createRoleDto);
    // 更新角色-菜单关联关系
    const roleWithMenuArr = createRoleDto.menuIds.map((menuId) => {
      return {
        roleId: result.roleId,
        menuId,
      };
    });
    await this.sysRoleWithMenuRepository.createQueryBuilder('roleWithMenu').insert().values(roleWithMenuArr).execute();

    return result;
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
   * 分页查询角色信息
   * @param query 分页查询条件
   * @returns 分页后的角色信息
   */
  async findAll(query: ListRoleDto) {
    const roleQueryResult = await this.sysRoleRepository.createQueryBuilder('role').where('role.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

    if (query.roleName) {
      roleQueryResult.andWhere(`entity.roleName LIKE "%${query.roleName}%"`);
    }

    if (query.roleKey) {
      roleQueryResult.andWhere(`entity.roleKey LIKE "%${query.roleKey}%"`);
    }

    if (query.status) {
      roleQueryResult.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      roleQueryResult.andWhere('entity.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }

    roleQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await roleQueryResult.getManyAndCount();

    return { list, total };
  }

  /**
   * 根据角色id查询角色部门树
   * @param id
   * @returns
   */
  async deptTree(id: number) {
    const tree = await this.deptService.deptTree();

    const deptIds = await this.sysRoleWithDeptRepository.find({
      where: { roleId: id },
      select: ['deptId'],
    });
    const checkedKeys = deptIds.map((item) => {
      return item.deptId;
    });
    return {
      depts: tree,
      checkedKeys,
    };
  }

  /**
   * 根据角色id查询角色详情
   * @param id
   * @returns
   */
  async findOne(id: number) {
    const res = await this.sysRoleRepository.findOne({
      where: {
        roleId: id,
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return res;
  }

  /**
   * 更新角色
   * @param updateRoleDto
   * @returns
   */
  async update(updateRoleDto: UpdateRoleDto) {
    // 一样的更新逻辑-先看角色-菜单关联表是否已有关联关系
    const hasId = await this.sysRoleWithMenuRepository.findOne({
      where: {
        roleId: updateRoleDto.roleId,
      },
      select: ['roleId'],
    });

    //角色已关联菜单先删除角色-菜单关联关系
    if (hasId) {
      await this.sysRoleWithMenuRepository.delete({
        roleId: updateRoleDto.roleId,
      });
    }

    //TODO 后续改造为事务
    const roleWithMenuArr = updateRoleDto.menuIds.map((menuId) => {
      return {
        roleId: updateRoleDto.roleId,
        menuId,
      };
    });
    await this.sysRoleWithMenuRepository.createQueryBuilder('roleWithMenu').insert().values(roleWithMenuArr).execute();

    // 删除自己添加的字段
    delete updateRoleDto.menuIds;

    const res = await this.sysRoleRepository.update({ roleId: updateRoleDto.roleId }, updateRoleDto);
    return res;
  }

  /**
   * 改变角色数据权限
   * @param updateRoleDto
   * @returns
   */
  async dataScope(updateRoleDto: UpdateRoleDto) {
    const hasId = await this.sysRoleWithDeptRepository.findOne({
      where: {
        roleId: updateRoleDto.roleId,
      },
      select: ['roleId'],
    });

    //角色已有权限 或者 非自定义权限 先删除权限关联
    if (hasId || updateRoleDto.dataScope !== DataScopeEnum.DATA_SCOPE_CUSTOM) {
      await this.sysRoleWithDeptRepository.delete({
        roleId: updateRoleDto.roleId,
      });
    }

    const roleWithDeptArr = updateRoleDto.deptIds.map((deptId) => {
      return {
        roleId: updateRoleDto.roleId,
        deptId,
      };
    });
    await this.sysRoleWithDeptRepository.createQueryBuilder('roleWithDept').insert().values(roleWithDeptArr).execute();

    delete updateRoleDto.deptIds;

    const res = await this.sysRoleRepository.update({ roleId: updateRoleDto.roleId }, updateRoleDto);
    return res;
  }

  /**
   * 改变角色状态-实际就是变更状态
   * @param changeStatusDto
   * @returns
   */
  async changeStatus(changeStatusDto: ChangeStatusDto) {
    const res = await this.sysRoleRepository.update(
      { roleId: changeStatusDto.roleId },
      {
        status: changeStatusDto.status,
      },
    );
    return res;
  }

  /**
   * 删除角色
   * @param ids
   * @returns
   */
  async remove(ids: string) {
    const menuIds = ids.split(',').map((id) => +id);
    const result = await this.sysRoleRepository.update({ roleId: In(menuIds) }, { delFlag: DeleteFlagEnum.DELETE });
    if (result.affected < 1) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { code: 200, message: '删除成功' };
  }

  /**
   * 根据角色ID异步查找与之关联的部门ID列表。
   *
   * @param roleId - 角色的ID，用于查询与该角色关联的部门。
   * @returns 返回一个Promise，该Promise解析为一个部门ID的数组。
   */
  async findRoleWithDeptIds(roleId: number) {
    // 使用TypeORM的实体仓库查询方法，异步查找与指定角色ID相关联的部门ID。
    const res = await this.sysRoleWithDeptRepository.find({
      select: ['deptId'],
      where: {
        roleId: roleId,
      },
    });
    // 将查询结果映射为仅包含部门ID的数组并返回。
    return res.map((item) => item.deptId);
  }
}
