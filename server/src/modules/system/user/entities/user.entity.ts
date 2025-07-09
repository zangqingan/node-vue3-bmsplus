import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/entities/base';

/**
 * @description: 用户信息表
 */
@Entity('sys_user', {
  comment: '用户信息表',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'bigint', name: 'dept_id', default: null, comment: '部门ID' })
  deptId: number;

  @Column({ type: 'varchar', name: 'user_name', length: 30, nullable: false, comment: '用户账号' })
  userName: string;

  @Column({ type: 'varchar', name: 'nick_name', length: 30, nullable: false, comment: '用户昵称' })
  nickName: string;

  @Column({ type: 'varchar', name: 'user_type', length: 2, default: '00', comment: '用户类型(00系统用户)' })
  userType: string;

  @Column({ type: 'varchar', name: 'email', length: 50, default: '', comment: '用户邮箱' })
  email: string;

  @Column({ type: 'varchar', name: 'phone_number', default: '', length: 11, comment: '手机号码' })
  phoneNumber: string;

  @Column({ type: 'char', name: 'gender', default: '0', length: 1, comment: '用户性别(0男 1女 2未知)' })
  gender: string;

  @Column({ type: 'varchar', name: 'avatar', default: '', length: 100, comment: '头像地址' })
  avatar: string;

  @Exclude({ toPlainOnly: true }) // 查询时不返回密码字段
  @Column({ type: 'varchar', length: 100, nullable: false, comment: '用户登录密码' })
  password: string;

  @Column({ type: 'varchar', name: 'login_ip', length: 128, default: '', comment: '最后登录IP' })
  loginIp: string;

  @CreateDateColumn({ type: 'timestamp', name: 'login_date', comment: '最后登录时间' })
  loginDate: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'pwd_update_date', comment: '密码最后更新时间' })
  pwdUpdateDate: Date;
}
