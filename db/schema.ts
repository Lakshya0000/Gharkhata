import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const milk_entries = sqliteTable('milk_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  shift: text('shift').notNull().default('Morning'),
  quantity: real('quantity').notNull(),
  rate_per_litre: real('rate_per_litre').notNull(),
  supplier_name: text('supplier_name').notNull().default(''),
  amount: real('amount').notNull(),
  notes: text('notes'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const milk_bills = sqliteTable('milk_bills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  start_date: text('start_date').notNull(),
  end_date: text('end_date').notNull(),
  supplier_name: text('supplier_name').notNull().default(''),
  total_quantity: real('total_quantity').notNull(),
  total_amount: real('total_amount').notNull(),
  is_paid: integer('is_paid').notNull().default(0),
  paid_date: text('paid_date'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  note: text('note'),
  date: text('date').notNull(),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const udhaari_entries = sqliteTable('udhaari_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  person_name: text('person_name').notNull(),
  amount: real('amount').notNull(),
  type: text('type').notNull(), // 'given' or 'taken'
  reason: text('reason'),
  date: text('date').notNull(),
  status: text('status').notNull().default('pending'),
  paid_date: text('paid_date'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
});

export const reminders = sqliteTable('reminders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  hour: integer('hour').notNull(),
  minute: integer('minute').notNull(),
  is_active: integer('is_active').notNull().default(1),
  notification_id: text('notification_id'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
