import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const comment = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  authorId: uuid('author_id').notNull(),
  articleId: uuid('article_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
