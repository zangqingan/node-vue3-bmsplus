import { Entity, PrimaryColumn } from 'typeorm';

/**
 * @description: 用户与岗位关联表  用户1-N岗位
 */
@Entity('sys_user_post', {
  comment: '用户与岗位关联表',
})
export class SysUserWithPostEntity {
  @PrimaryColumn({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @PrimaryColumn({ type: 'bigint', name: 'post_id', comment: '岗位ID' })
  postId: number;
}
