import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  IUserRepository,
} from '@orms-showcase/domain';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  async create(user: CreateUserDto): Promise<User> {
    const userEntity = this.userRepository.create(user);
    return this.userRepository.save(userEntity);
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      return null;
    }
    const updatedUser = Object.assign(existingUser, user);
    return this.userRepository.save(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? true : false;
  }
}
