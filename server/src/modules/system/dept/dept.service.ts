import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { DataScopeEnum, DeleteFlagEnum } from 'src/common/enum';
import { arrayToTree } from 'src/common/utils/tools/index';

import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';

import { SysDeptEntity } from './entities/dept.entity';

@Injectable()
export class DeptService {
  constructor(@InjectRepository(SysDeptEntity) private readonly sysDeptRepository: Repository<SysDeptEntity>) {}
  create(createDeptDto: CreateDeptDto) {
    return 'This action adds a new dept';
  }

  findAll() {
    return `This action returns all dept`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dept`;
  }

  update(id: number, updateDeptDto: UpdateDeptDto) {
    return `This action updates a #${id} dept`;
  }

  remove(id: number) {
    return `This action removes a #${id} dept`;
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
