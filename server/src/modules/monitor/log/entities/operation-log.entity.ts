import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * @description:操作日志记录
 */
@Entity('sys_operation_log', {
  comment: '操作日志记录',
})
export class OperationLogEntity {
  @PrimaryGeneratedColumn({ name: 'operation_id', type: 'bigint', comment: '日志主键' })
  operationId: string;

  @Column({ type: 'varchar', name: 'title', length: 50, default: '', comment: '模块标题' })
  title: string;

  @Column({ type: 'int', name: 'business_type', default: 0, comment: '业务类型(0其它 1新增 2修改 3删除)' })
  businessType: number;

  @Column({ type: 'varchar', name: 'method', length: 200, default: '', comment: '方法名称' })
  method: string;

  @Column({ type: 'varchar', name: 'request_method', length: 10, default: '', comment: '请求方式' })
  requestMethod: string;

  @Column({ type: 'int', name: 'operation_type', default: 0, comment: '操作类别(0其它 1后台用户 2手机端用户)' })
  operationType: string;

  @Column({ type: 'varchar', name: 'operation_name', length: 50, default: '', comment: '操作人员' })
  operationName: string;

  @Column({ type: 'varchar', name: 'dept_name', length: 50, default: '', comment: '部门名称' })
  deptName: string;

  @Column({ type: 'varchar', name: 'operation_url', length: 255, default: '', comment: '请求URL' })
  operationUrl: string;

  @Column({ type: 'varchar', name: 'operation_ip', length: 255, default: '', comment: '主机地址' })
  operationIp: string;

  @Column({ type: 'varchar', name: 'operation_location', length: 255, default: '', comment: '操作地点' })
  operationLocation: string;

  @Column({ type: 'varchar', name: 'operation_param', length: 2000, default: '', comment: '请求参数' })
  operationParam: string;

  @Column({ type: 'varchar', name: 'json_result', length: 2000, default: '', comment: '返回参数' })
  jsonResult: string;

  @CreateDateColumn({ type: 'timestamp', name: 'operation_time', comment: '操作时间' })
  operationTime: Date;

  @Column({ type: 'char', name: 'status', length: 1, default: '0', comment: '操作状态(0正常 1异常)' })
  status: string;

  @Column({ type: 'varchar', name: 'error_msg', length: 2000, default: '', comment: '错误消息' })
  errorMsg: string;

  @Column({ type: 'bigint', name: 'cost_time', default: 0, comment: '消耗时间' })
  costTime: number;
}
