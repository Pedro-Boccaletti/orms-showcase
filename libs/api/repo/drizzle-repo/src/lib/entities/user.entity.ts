import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  active: boolean('active').notNull().default(true),
});
