import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base';

/**
 * @description:岗位信息表
 */
@Entity('sys_post', {
  comment: '岗位信息表',
})
export class SysPostEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'post_id', comment: '岗位ID' })
  postId: number;

  @Column({ type: 'varchar', name: 'post_code', length: 64, nullable: false, comment: '岗位编码' })
  postCode: string;

  @Column({ type: 'varchar', name: 'post_name', length: 50, nullable: false, comment: '岗位名称' })
  postName: string;

  @Column({ type: 'int', name: 'post_sort', default: 0, nullable: false, comment: '显示顺序' })
  postSort: number;
}
