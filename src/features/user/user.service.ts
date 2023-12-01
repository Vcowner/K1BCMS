/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-28 15:13:11
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-01 15:11:52
 */
import { Permission } from '@/entities/permission.entity';
import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  // 通过 userId 查找用户
  async findUserById(userId: string, isAdmin: boolean = false) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    const { id, username, roles, email } = user;

    const permissions = new Set<Permission>();
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.add(permission);
      });
    });

    return {
      id,
      username,
      isAdmin,
      email,
      roles: roles.map((role) => role.name),
      permissions: Array.from(permissions),
    };
  }
}
