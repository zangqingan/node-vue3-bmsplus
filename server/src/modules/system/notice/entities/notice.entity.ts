import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

/**
 * @description: 通知公告表
 */
@Entity('sys_notice', {
  comment: '通知公告表',
})
export class SysNoticeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'notice_id', comment: '公告ID' })
  noticeId: number;

  @Column({ type: 'varchar', name: 'notice_title', length: 50, default: '', comment: '公告标题' })
  noticeTitle: string;

  //公告类型（1通知 2公告）
  @Column({ type: 'char', name: 'notice_type', length: 1, comment: '公告类型' })
  noticeType: string;

  @Column({ type: 'longtext', name: 'notice_content', default: null, comment: '公告内容' })
  noticeContent: string;
}
