import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base';

/**
 * @description:菜单权限表
 */
@Entity('sys_menu', {
  comment: '菜单权限表',
})
export class SysMenuEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'menu_id', comment: '菜单ID' })
  menuId: number;

  @Column({ type: 'varchar', name: 'menu_name', nullable: false, length: 50, comment: '菜单名称' })
  menuName: string;

  @Column({ type: 'bigint', name: 'parent_id', comment: '父菜单ID' })
  parentId: number;

  @Column({ type: 'int', name: 'order_num', default: 0, comment: '显示顺序' })
  orderNum: number;

  @Column({ type: 'varchar', name: 'path', length: 200, default: '', comment: '路由地址' })
  path: string;

  @Column({ type: 'varchar', name: 'component', length: 255, nullable: true, default: null, comment: '组件路径' })
  component: string;

  @Column({ type: 'varchar', name: 'query', length: 255, default: null, comment: '路由参数' })
  query: string;

  @Column({ type: 'varchar', name: 'route_name', length: 50, default: '', comment: '路由参数' })
  routeName: string;

  @Column({ type: 'char', name: 'is_frame', default: '1', comment: '是否为外链(0是 1否)' })
  isFrame: string;

  @Column({ type: 'char', name: 'is_cache', default: '0', comment: '是否缓存(0缓存 1不缓存)' })
  isCache: string;

  @Column({ type: 'char', name: 'visible', default: '0', comment: '菜单状态(0显示 1隐藏)' })
  visible: string;

  @Column({ type: 'char', name: 'menu_type', length: 1, default: 'M', comment: '菜单类型(M目录 C菜单 F按钮)' })
  menuType: string;

  @Column({ type: 'varchar', name: 'perms', length: 100, nullable: true, default: null, comment: '权限标识' })
  perms: string;

  @Column({ type: 'varchar', name: 'icon', length: 100, default: '#', comment: '菜单图标' })
  icon: string;
}
