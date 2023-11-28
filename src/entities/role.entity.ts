/*
 * @Author: liaokt
 * @Description: Role entity
 * @Date: 2023-11-28 15:16:29
 * @LastEditors: liaokt
 * @LastEditTime: 2023-11-28 15:22:49
 */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    length: 20,
    comment: '角色名',
  })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];
}
