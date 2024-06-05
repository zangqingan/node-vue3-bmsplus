import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { DataScopeEnum, DeleteFlagEnum } from 'src/common/enum';
import { arrayToTree } from 'src/common/utils/tools/index';

import { CreateDeptDto, UpdateDeptDto } from './dto';

import { SysDeptEntity } from './entities/dept.entity';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(SysDeptEntity)
    private readonly sysDeptRepository: Repository<SysDeptEntity>,
  ) {}

  /**
   * 新增部门
   * @param createDeptDto
   */
  async create(createDeptDto: CreateDeptDto) {
    if (createDeptDto.parentId) {
      const parent = await this.sysDeptRepository.findOne({
        where: {
          deptId: createDeptDto.parentId,
          delFlag: DeleteFlagEnum.NORMAL,
        },
        select: ['ancestors'],
      });
      if (!parent) {
        throw new HttpException('父级部门不存在', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const ancestors = parent.ancestors ? `${parent.ancestors},${createDeptDto.parentId}` : `${createDeptDto.parentId}`;
      Object.assign(createDeptDto, { ancestors: ancestors });
    }
    await this.sysDeptRepository.save(createDeptDto);
    return { msg: '新增成功' };
  }

  /**
   * 查询所有部门
   * @returns
   */
  async findAll() {
    return await this.sysDeptRepository.find({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
  }

  /**
   * 根据ID查询部门
   * @param id
   * @returns
   */
  async findOne(id: number) {
    const data = await this.sysDeptRepository.findOne({
      where: {
        deptId: id,
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return data;
  }

  /**
   * 查询部门列表
   * @param query
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findListExclude(id: string) {
    //TODO 需排出ancestors 中不出现id的数据
    const data = await this.sysDeptRepository.find({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return data;
  }

  /**
   * 更新部门信息
   * @param updateDeptDto
   * @returns
   */
  async update(updateDeptDto: UpdateDeptDto) {
    if (updateDeptDto.parentId) {
      const parent = await this.sysDeptRepository.findOne({
        where: {
          deptId: updateDeptDto.parentId,
          delFlag: DeleteFlagEnum.NORMAL,
        },
        select: ['ancestors'],
      });
      if (!parent) {
        throw new HttpException('父级部门不存在', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const ancestors = parent.ancestors ? `${parent.ancestors},${updateDeptDto.parentId}` : `${updateDeptDto.parentId}`;
      Object.assign(updateDeptDto, { ancestors: ancestors });
    }
    await this.sysDeptRepository.update({ deptId: updateDeptDto.deptId }, updateDeptDto);
    return { message: '更新成功' };
  }

  /**
   * 删除部门
   * @param id
   * @returns
   */
  async remove(id: number) {
    const data = await this.sysDeptRepository.update(
      { deptId: id },
      {
        delFlag: DeleteFlagEnum.DELETE,
      },
    );
    return data;
  }

  /**
   * 部门树
   * @returns
   */
  async deptTree() {
    const res = await this.sysDeptRepository.find({
      where: {
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return arrayToTree(res);
  }

  /**
   * 根据数据权限范围和部门ID查询部门ID列表。
   * @param deptId 部门ID，表示需要查询的部门。
   * @param dataScope 数据权限范围，决定查询的部门范围。
   * @returns 返回一个部门ID数组，根据数据权限范围决定返回的部门ID集合。
   */
  async findDeptIdsByDataScope(deptId: number, dataScope: DataScopeEnum) {
    try {
      // 创建部门实体的查询构建器
      const entity = this.sysDeptRepository.createQueryBuilder('dept');
      // 筛选出删除标志为未删除的部门
      entity.where('dept.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

      // 根据不同的数据权限范围添加不同的查询条件
      if (dataScope === DataScopeEnum.DATA_SCOPE_DEPT) {
        // 如果是本部门数据权限，则只查询指定部门
        this.addQueryForDeptDataScope(entity, deptId);
      } else if (dataScope === DataScopeEnum.DATA_SCOPE_DEPT_AND_CHILD) {
        // 如果是本部门及子部门数据权限，则查询指定部门及其所有子部门
        this.addQueryForDeptAndChildDataScope(entity, deptId);
      } else if (dataScope === DataScopeEnum.DATA_SCOPE_SELF) {
        // 如果是仅本人数据权限，则不查询任何部门，直接返回空数组
        return [];
      }
      // 执行查询并获取结果
      const list = await entity.getMany();
      // 将查询结果映射为部门ID数组后返回
      return list.map((item) => item.deptId);
    } catch (error) {
      console.error('Failed to query department IDs:', error);
      throw new Error('Querying department IDs failed');
    }
  }

  /**
   * 添加查询条件以适应本部门数据权限范围。
   * @param queryBuilder 查询构建器实例
   * @param deptId 部门ID
   */
  private addQueryForDeptDataScope(queryBuilder: SelectQueryBuilder<any>, deptId: number) {
    queryBuilder.andWhere('dept.deptId = :deptId', { deptId: deptId });
  }

  /**
   * 添加查询条件以适应本部门及子部门数据权限范围。
   * @param queryBuilder 查询构建器实例
   * @param deptId 部门ID
   */
  private addQueryForDeptAndChildDataScope(queryBuilder: SelectQueryBuilder<any>, deptId: number) {
    // 使用参数化查询以防止SQL注入
    queryBuilder
      .andWhere('dept.ancestors LIKE :ancestors', {
        ancestors: `%${deptId}%`,
      })
      .orWhere('dept.deptId = :deptId', { deptId: deptId });
  }
}
