import { ITagRepository, Tag } from '@orms-showcase/domain';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../schema';
import { Inject } from '@nestjs/common';
import { DrizzleProvider } from '../drizzle.provider';

export class TagRepository implements ITagRepository {
  constructor(
    @Inject(DrizzleProvider) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.db.select().from(schema.tag).execute();
  }

  async findById(id: string): Promise<Tag | null> {
    return this.db
      .select()
      .from(schema.tag)
      .where(eq(schema.tag.id, id))
      .execute()
      .then((result) => (result.length > 0 ? result[0] : null));
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.db
      .select()
      .from(schema.tag)
      .where(eq(schema.tag.name, name))
      .execute()
      .then((result) => (result.length > 0 ? result[0] : null));
  }

  async create(name: string): Promise<Tag> {
    const [createdTag] = await this.db
      .insert(schema.tag)
      .values({ name })
      .returning()
      .execute();
    return createdTag;
  }

  async update(id: string, name: string): Promise<Tag | null> {
    const [updatedTag] = await this.db
      .update(schema.tag)
      .set({ name })
      .where(eq(schema.tag.id, id))
      .returning()
      .execute();
    return updatedTag;
  }

  async delete(id: string): Promise<boolean> {
    return this.db
      .delete(schema.tag)
      .where(eq(schema.tag.id, id))
      .execute()
      .then((result) => !!result.rowCount);
  }
}
