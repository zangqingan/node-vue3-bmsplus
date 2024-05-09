import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

//基础抽象实体信息类
@Entity()
export abstract class BaseEntity {
  //0正常 1停用
  @Column({ type: 'char', name: 'status', default: '0', length: 1, comment: '状态' })
  status: string;

  //0代表存在 1代表删除
  @Column({ type: 'char', name: 'del_flag', default: '0', length: 1, comment: '删除标志' })
  delFlag: string;

  @Column({ type: 'varchar', name: 'create_by', length: 64, default: '', comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @Column({ type: 'varchar', name: 'update_by', length: 64, default: '', comment: '更新者' })
  updateBy: string;

  @Column({ type: 'varchar', name: 'remark', length: 500, default: '', comment: '备注' })
  remark: string;
}
