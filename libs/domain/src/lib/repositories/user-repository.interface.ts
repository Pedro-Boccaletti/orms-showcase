import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateDto } from '../dtos/update.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
  update(user: UpdateDto<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
}
