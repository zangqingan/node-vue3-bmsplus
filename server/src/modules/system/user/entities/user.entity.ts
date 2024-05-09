import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base';

/**
 * 用户信息实体类对应表 - sys_user
 */
@Entity('sys_user', {
  comment: '用户信息表',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ type: 'int', name: 'dept_id', default: null, comment: '部门ID' })
  deptId: number;

  @Column({ type: 'varchar', name: 'user_name', length: 30, nullable: false, comment: '用户账号' })
  userName: string;

  @Column({ type: 'varchar', name: 'nick_name', length: 30, nullable: false, comment: '用户昵称' })
  nickName: string;

  //00系统用户
  @Column({ type: 'varchar', name: 'user_type', length: 2, default: '00', comment: '用户类型' })
  userType: string;

  @Column({ type: 'varchar', name: 'email', length: 50, default: '', comment: '邮箱' })
  email: string;

  @Column({ type: 'varchar', name: 'phone_number', default: '', length: 11, comment: '手机号码' })
  phoneNumber: string;

  //0男 1女 2未知
  @Column({ type: 'char', name: 'gender', default: '0', length: 1, comment: '性别' })
  gender: string;

  @Column({ type: 'varchar', name: 'avatar', default: '', comment: '头像地址' })
  avatar: string;

  @Exclude({ toPlainOnly: true }) // 查询时不返回密码字段
  @Column({ type: 'varchar', length: 200, nullable: false, comment: '用户登录密码' })
  password: string;

  @Column({ type: 'varchar', name: 'login_ip', length: 128, default: '', comment: '最后登录IP' })
  loginIp: string;

  @Column({ type: 'timestamp', name: 'login_date', comment: '最后登录时间' })
  loginDate: Date;
}
