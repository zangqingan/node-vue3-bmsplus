import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

/**
 * @description: 部门表
 */
@Entity('sys_dept', {
  comment: '部门表',
})
export class SysDeptEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'dept_id', comment: '部门ID' })
  deptId: number;

  @Column({ type: 'int', name: 'parent_id', default: 0, comment: '父部门ID' })
  parentId: number;

  @Column({ type: 'varchar', name: 'ancestors', length: 50, default: '0', comment: '祖级列表' })
  ancestors: string;

  @Column({ type: 'varchar', name: 'dept_name', length: 30, comment: '部门名称' })
  deptName: string;

  @Column({ type: 'int', name: 'order_num', default: 0, comment: '显示顺序' })
  orderNum: number;

  @Column({ type: 'varchar', name: 'leader', length: 20, comment: '负责人' })
  leader: string;

  @Column({ type: 'varchar', name: 'phone', default: '', length: 11, comment: '联系电话' })
  phone: string;

  @Column({ type: 'varchar', name: 'email', length: 50, default: '', comment: '邮箱' })
  email: string;
}
