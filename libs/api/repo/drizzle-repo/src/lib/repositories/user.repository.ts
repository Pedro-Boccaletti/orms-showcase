import {
  CreateUserDto,
  IUserRepository,
  UpdateUserDto,
  User,
} from '@orms-showcase/domain';
import * as schema from '../schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DrizzleProvider } from '../drizzle.provider';
import { Inject } from '@nestjs/common';

export class UserRepository implements IUserRepository {
  constructor(
    @Inject(DrizzleProvider) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.db.select().from(schema.user).execute();

    return users;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, id))
      .execute();

    return result.length > 0 ? result[0] : null;
  }

  async create(user: CreateUserDto): Promise<User> {
    const [createdUser] = await this.db
      .insert(schema.user)
      .values(user)
      .returning()
      .execute();

    return createdUser;
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    const [updatedUser] = await this.db
      .update(schema.user)
      .set(user)
      .where(eq(schema.user.id, id))
      .returning({
        id: schema.user.id,
        email: schema.user.email,
        name: schema.user.name,
        active: schema.user.active,
      })
      .execute();

    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.user)
      .where(eq(schema.user.id, id))
      .execute();

    return !!result.rowCount;
  }
}
