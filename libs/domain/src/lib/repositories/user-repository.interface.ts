import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract create(user: CreateUserDto): Promise<User>;
  abstract update(id: string, user: UpdateUserDto): Promise<User | null>;
  abstract delete(id: string): Promise<boolean>;
}
