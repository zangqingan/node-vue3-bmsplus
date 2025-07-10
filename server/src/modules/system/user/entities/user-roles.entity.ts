import { Entity, PrimaryColumn } from 'typeorm';

/**
 * 用户N-1角色
 * @description: 用户和角色关联表
 */
@Entity('sys_user_role', {
  comment: '用户和角色关联表',
})
export class SysUserWithRoleEntity {
  @PrimaryColumn({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @PrimaryColumn({ type: 'bigint', name: 'role_id', comment: '角色ID' })
  roleId: number;
}
