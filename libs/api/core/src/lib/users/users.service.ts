import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository, User } from '@orms-showcase/domain';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('UserRepository') private repo: IUserRepository) {}

  async findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.repo.create(user);
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.repo.update(id, user);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
