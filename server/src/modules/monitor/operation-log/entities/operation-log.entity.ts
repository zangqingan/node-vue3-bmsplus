import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * @description:操作日志记录
 */
@Entity('sys_operation_log', {
  comment: '操作日志记录',
})
export class MonitorOperlogEntity {
  @PrimaryGeneratedColumn({ name: 'oper_id', type: 'bigint', comment: '日志主键' })
  operId: string;

  @Column({ type: 'varchar', name: 'title', length: 50, default: '', comment: '模块标题' })
  title: string;

  //业务类型（0其它 1新增 2修改 3删除）
  @Column({ type: 'int', name: 'business_type', default: 0, comment: '业务类型' })
  businessType: number;

  @Column({ type: 'varchar', name: 'method', length: 100, default: '', comment: '方法名称' })
  method: string;

  @Column({ type: 'varchar', name: 'request_method', length: 10, default: '', comment: '请求方式' })
  requestMethod: string;

  //0其它 1后台用户 2手机端用户
  @Column({ type: 'int', name: 'operator_type', default: 0, comment: '操作类别' })
  operatorType: string;

  @Column({ type: 'varchar', name: 'oper_name', length: 50, default: '', comment: '操作人员' })
  operName: string;

  @Column({ type: 'varchar', name: 'dept_name', length: 50, default: '', comment: '部门名称' })
  deptName: string;

  @Column({ type: 'varchar', name: 'oper_url', length: 255, default: '', comment: '请求URL' })
  operUrl: string;

  @Column({ type: 'varchar', name: 'oper_ip', length: 255, default: '', comment: '主机地址' })
  operIp: string;

  @Column({ type: 'varchar', name: 'oper_location', length: 255, default: '', comment: '操作地点' })
  operLocation: string;

  @Column({ type: 'varchar', name: 'oper_param', length: 2000, default: '', comment: '请求参数' })
  operParam: string;

  @Column({ type: 'varchar', name: 'json_result', length: 2000, default: '', comment: '返回参数' })
  jsonResult: string;

  @CreateDateColumn({ type: 'timestamp', name: 'oper_time', comment: '操作时间' })
  operTime: Date;

  //登录状态:0正常 1失败
  @Column({ type: 'char', name: 'status', length: 1, default: '0', comment: '登录状态' })
  status: string;

  //提示消息
  @Column({ type: 'varchar', name: 'error_msg', length: 2000, default: '', comment: '错误消息' })
  errorMsg: string;

  @Column({ type: 'int', name: 'cost_time', default: 0, comment: '消耗时间' })
  costTime: number;
}
