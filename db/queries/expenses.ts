import { eq, like, sum, sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { expenses } from '../schema';
import * as schema from '../schema';

type DB = ExpoSQLiteDatabase<typeof schema>;

export const addExpense = async (db: DB, expense: typeof expenses.$inferInsert) => {
  return await db.insert(expenses).values(expense).returning();
};

export const getExpensesByMonth = async (db: DB, year: number, month: number) => {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const prefix = `${year}-${monthStr}-%`;
  return await db.select().from(expenses).where(like(expenses.date, prefix));
};

export const updateExpense = async (db: DB, id: number, data: Partial<typeof expenses.$inferInsert>) => {
  return await db.update(expenses).set({ ...data, updated_at: sql`CURRENT_TIMESTAMP` }).where(eq(expenses.id, id)).returning();
};

export const deleteExpense = async (db: DB, id: number) => {
  return await db.delete(expenses).where(eq(expenses.id, id));
};

export const getMonthlyExpenseTotal = async (db: DB, year: number, month: number) => {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const prefix = `${year}-${monthStr}-%`;
  const result = await db.select({ total: sum(expenses.amount) }).from(expenses).where(like(expenses.date, prefix));
  return result[0]?.total || 0;
};
