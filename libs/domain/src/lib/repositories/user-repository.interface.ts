import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
  update(id: string, user: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
