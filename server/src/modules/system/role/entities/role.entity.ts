import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

/**
 * @description: 角色信息表
 */
@Entity('sys_role', {
  comment: '角色信息表',
})
export class SysRoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'role_id', comment: '角色ID' })
  roleId: number;

  @Column({ type: 'varchar', name: 'role_name', length: 30, comment: '角色名称' })
  roleName: string;

  @Column({ type: 'int', name: 'role_sort', default: 0, comment: '显示顺序' })
  roleSort: number;

  @Column({ type: 'varchar', name: 'role_key', length: 100, comment: '角色权限字符串' })
  roleKey: string;

  @Column({ type: 'char', name: 'data_scope', length: 1, default: '1', comment: '数据范围(1: 全部数据权限 2: 自定数据权限 3: 本部门数据权限 4: 本部门及以下数据权限)' })
  dataScope: string;

  @Column({ type: 'boolean', name: 'menu_check_strictly', default: false, comment: '菜单树选择项是否关联显示' })
  menuCheckStrictly: boolean;

  @Column({ type: 'boolean', name: 'dept_check_strictly', default: false, comment: '部门树选择项是否关联显示' })
  deptCheckStrictly: boolean;
}
