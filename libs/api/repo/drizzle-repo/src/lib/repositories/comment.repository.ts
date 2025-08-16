import {
  Comment,
  CreateCommentDto,
  ICommentRepository,
  UpdateCommentDto,
} from '@orms-showcase/domain';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { eq } from 'drizzle-orm';
import { Inject } from '@nestjs/common';
import { DrizzleProvider } from '../drizzle.provider';

export class CommentRepository implements ICommentRepository {
  constructor(
    @Inject(DrizzleProvider) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async findByArticleId(articleId: string): Promise<Comment[]> {
    return this.db
      .select()
      .from(schema.comment)
      .where(eq(schema.comment.articleId, articleId))
      .execute();
  }

  async create(
    comment: CreateCommentDto & { articleId: string }
  ): Promise<Comment> {
    const [createdComment] = await this.db
      .insert(schema.comment)
      .values(comment)
      .returning()
      .execute();

    return createdComment;
  }

  async update(id: string, comment: UpdateCommentDto): Promise<Comment | null> {
    const [updatedComment] = await this.db
      .update(schema.comment)
      .set(comment)
      .where(eq(schema.comment.id, id))
      .returning()
      .execute();

    return updatedComment;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.comment)
      .where(eq(schema.comment.id, id))
      .execute();
    return !!result.rowCount;
  }
}
