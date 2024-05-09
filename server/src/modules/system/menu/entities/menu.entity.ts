import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base';

/**
 * @description:菜单权限表
 */
@Entity('sys_menu', {
  comment: '菜单权限表',
})
export class SysMenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'menu_id', comment: '菜单ID' })
  menuId: number;

  @Column({ type: 'varchar', name: 'menu_name', length: 50, comment: '菜单名称' })
  menuName: string;

  @Column({ type: 'int', name: 'parent_id', comment: '父菜单ID' })
  parentId: number;

  @Column({ type: 'int', name: 'order_num', default: 0, comment: '显示顺序' })
  orderNum: number;

  @Column({ type: 'varchar', name: 'path', length: 200, default: '', comment: '路由地址' })
  path: string;

  @Column({ type: 'varchar', name: 'component', length: 255, nullable: true, comment: '组件路径' })
  component: string;

  @Column({ type: 'varchar', name: 'query', length: 255, default: '', comment: '路由参数' })
  query: string;

  //是否为外链（0是 1否）
  @Column({ type: 'char', name: 'is_frame', default: '1', comment: '是否为外链' })
  isFrame: string;

  //是否缓存（0是 1否）
  @Column({ type: 'char', name: 'is_cache', default: '0', comment: '是否缓存' })
  isCache: string;

  //是否显示（0是 1否）
  @Column({ type: 'char', name: 'visible', default: '0', comment: '是否显示' })
  visible: string;

  //菜单类型（M目录 C菜单 F按钮）
  @Column({ type: 'char', name: 'menu_type', length: 1, default: 'M', comment: '菜单类型' })
  menuType: string;

  @Column({ type: 'varchar', name: 'perms', length: 100, default: '', comment: '权限标识' })
  perms: string;

  @Column({ type: 'varchar', name: 'icon', length: 100, default: '', comment: '菜单图标' })
  icon: string;
}
