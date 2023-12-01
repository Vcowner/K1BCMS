/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 15:16:36
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 15:52:58
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    length: 20,
    comment: '权限代码',
  })
  code: string;

  @Column({
    length: 20,
    comment: '父权限代码',
  })
  parent_code: string;

  @Column({
    comment: '子权限列表',
  })
  children_list: string;

  @Column({
    length: 100,
    comment: '权限描述',
  })
  description: string;
}
