export class Dict {}
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

/**
 * @description:字典类型表
 */
@Entity('sys_dict_type', {
  comment: '字典类型表',
})
export class SysDictTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'dict_id', comment: '字典主键' })
  dictId: number;

  @Column({ type: 'varchar', name: 'dict_name', length: 100, comment: '字典名称' })
  dictName: string;

  @Column({ type: 'varchar', name: 'dict_type', unique: true, length: 100, comment: '字典类型' })
  dictType: string;
}
