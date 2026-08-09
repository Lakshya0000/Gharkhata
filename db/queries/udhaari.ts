import { eq, sql, sum, and } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { udhaari_entries } from '../schema';
import * as schema from '../schema';

type DB = ExpoSQLiteDatabase<typeof schema>;

export const addUdhaari = async (db: DB, entry: typeof udhaari_entries.$inferInsert) => {
  return await db.insert(udhaari_entries).values(entry).returning();
};

export const getUdhaariByStatus = async (db: DB, status: string) => {
  return await db.select().from(udhaari_entries).where(eq(udhaari_entries.status, status));
};

export const getAllUdhaari = async (db: DB) => {
  return await db.select().from(udhaari_entries);
};

export const markUdhaariPaid = async (db: DB, id: number) => {
  const date = new Date().toISOString().split('T')[0];
  return await db.update(udhaari_entries).set({ status: 'settled', paid_date: date, updated_at: sql`CURRENT_TIMESTAMP` }).where(eq(udhaari_entries.id, id)).returning();
};

export const updateUdhaari = async (db: DB, id: number, data: Partial<typeof udhaari_entries.$inferInsert>) => {
  return await db.update(udhaari_entries).set({ ...data, updated_at: sql`CURRENT_TIMESTAMP` }).where(eq(udhaari_entries.id, id)).returning();
};

export const deleteUdhaari = async (db: DB, id: number) => {
  return await db.delete(udhaari_entries).where(eq(udhaari_entries.id, id));
};

export const getUdhaariSummary = async (db: DB) => {
  const pendingGiven = await db.select({ total: sum(udhaari_entries.amount) }).from(udhaari_entries).where(and(eq(udhaari_entries.status, 'pending'), eq(udhaari_entries.type, 'given')));
  const pendingTaken = await db.select({ total: sum(udhaari_entries.amount) }).from(udhaari_entries).where(and(eq(udhaari_entries.status, 'pending'), eq(udhaari_entries.type, 'taken')));
  
  const totalGiven = Number(pendingGiven[0]?.total || 0);
  const totalTaken = Number(pendingTaken[0]?.total || 0);
  return {
    totalGiven,
    totalTaken,
    netAmount: totalTaken - totalGiven
  };
};
