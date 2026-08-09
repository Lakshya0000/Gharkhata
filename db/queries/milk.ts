import { eq, and, between, like, sum, sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { milk_entries } from '../schema';
import * as schema from '../schema';

type DB = ExpoSQLiteDatabase<typeof schema>;

export const addMilkEntry = async (db: DB, entry: typeof milk_entries.$inferInsert) => {
  return await db.insert(milk_entries).values(entry).returning();
};

export const getMilkEntriesByDate = async (db: DB, date: string) => {
  return await db.select().from(milk_entries).where(eq(milk_entries.date, date));
};

export const getMilkEntriesByRange = async (db: DB, startDate: string, endDate: string) => {
  return await db.select().from(milk_entries).where(between(milk_entries.date, startDate, endDate));
};

export const getMilkEntriesByMonth = async (db: DB, year: number, month: number) => {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const prefix = `${year}-${monthStr}-%`;
  return await db.select().from(milk_entries).where(like(milk_entries.date, prefix));
};

export const updateMilkEntry = async (db: DB, id: number, data: Partial<typeof milk_entries.$inferInsert>) => {
  return await db.update(milk_entries).set({ ...data, updated_at: sql`CURRENT_TIMESTAMP` }).where(eq(milk_entries.id, id)).returning();
};

export const deleteMilkEntry = async (db: DB, id: number) => {
  return await db.delete(milk_entries).where(eq(milk_entries.id, id));
};

export const getMonthlyMilkTotal = async (db: DB, year: number, month: number) => {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const prefix = `${year}-${monthStr}-%`;
  const result = await db.select({ total: sum(milk_entries.amount) }).from(milk_entries).where(like(milk_entries.date, prefix));
  return result[0]?.total || 0;
};
