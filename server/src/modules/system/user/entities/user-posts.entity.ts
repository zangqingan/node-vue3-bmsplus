import { Entity, PrimaryColumn } from 'typeorm';

/**
 * 用户-岗位是一对多关系
 * 用户与岗位关联表
 */
@Entity('sys_user_post', {
  comment: '用户与岗位关联表',
})
export class SysUserWithPostEntity {
  @PrimaryColumn({ type: 'int', name: 'user_id', comment: '用户ID' })
  userId: number;

  @PrimaryColumn({ type: 'int', name: 'post_id', comment: '岗位ID' })
  postId: number;
}
