import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const article = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').notNull(),
  publishedAt: timestamp('published_at').notNull().defaultNow(),
});
