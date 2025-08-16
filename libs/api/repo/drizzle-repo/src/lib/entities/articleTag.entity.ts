import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const articleTag = pgTable('article_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  articleId: uuid('article_id').notNull(),
  tagId: uuid('tag_id').notNull(),
});
