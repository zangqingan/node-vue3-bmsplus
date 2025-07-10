import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base';

/**
 * @description: 定时任务调度表
 */
@Entity('sys_job', {
  comment: '定时任务调度表',
})
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'job_id', comment: '任务ID' })
  jobId: number;

  @Column({ type: 'varchar', name: 'job_name', length: 64, default: '', comment: '任务名称' })
  jobName: number;

  @Column({ type: 'varchar', name: 'job_group', length: 64, default: 'DEFAULT', comment: '任务组名' })
  jobGroup: string;

  @Column({ type: 'varchar', name: 'invoke_target', length: 500, nullable: false, comment: '调用目标字符串' })
  invokeTarget: string;

  @Column({ type: 'varchar', name: 'cron_expression', length: 255, default: '', comment: 'cron执行表达式' })
  cronExpression: string;

  @Column({ type: 'varchar', name: 'misfire_policy', length: 20, default: '3', comment: '计划执行错误策略(1立即执行 2执行一次 3放弃执行)' })
  misfirePolicy: string;

  @Column({ type: 'char', name: 'concurrent', default: '1', comment: '是否并发执行(0允许 1禁止)' })
  concurrent: string;
}