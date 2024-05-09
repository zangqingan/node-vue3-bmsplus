import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

/**
 * @description:系统访问记录
 */
@Entity('sys_login_info', {
  comment: '系统访问记录',
})
export class MonitorLoginLogEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'info_id', type: 'bigint', comment: '访问ID' })
  infoId: string;

  @Column({ type: 'varchar', name: 'user_name', length: 50, default: '', comment: '用户账号' })
  userName: string;

  @Column({ type: 'varchar', name: 'ip_addr', length: 128, default: '', comment: '登录IP地址' })
  ipAddr: string;

  @Column({ type: 'varchar', name: 'login_location', length: 255, default: '', comment: '登录地点' })
  loginLocation: string;

  @Column({ type: 'varchar', name: 'browser', length: 50, default: '', comment: '浏览器类型' })
  browser: string;

  @Column({ type: 'varchar', name: 'os', length: 50, default: '', comment: '操作系统' })
  os: string;

  @CreateDateColumn({ type: 'timestamp', name: 'login_time', comment: '访问时间' })
  loginTime: Date;

  @Column({ type: 'varchar', name: 'msg', length: 255, default: '', comment: '提示消息' })
  msg: string;
}
