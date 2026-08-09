import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { settings } from '../schema';
import * as schema from '../schema';

type DB = ExpoSQLiteDatabase<typeof schema>;

export const getSetting = async (db: DB, key: string) => {
  const result = await db.select().from(settings).where(eq(settings.key, key));
  return result[0]?.value || null;
};

export const setSetting = async (db: DB, key: string, value: string) => {
  const existing = await getSetting(db, key);
  if (existing !== null) {
    return await db.update(settings).set({ value }).where(eq(settings.key, key)).returning();
  } else {
    return await db.insert(settings).values({ key, value }).returning();
  }
};

export const getDefaultMilkRate = async (db: DB): Promise<number | null> => {
  const val = await getSetting(db, 'defaultMilkRate');
  return val ? parseFloat(val) : null;
};

export const getDefaultSupplier = async (db: DB): Promise<string> => {
  const val = await getSetting(db, 'defaultSupplier');
  return val || '';
};

export const getDefaultQuantity = async (db: DB): Promise<number | null> => {
  const val = await getSetting(db, 'defaultQuantity');
  return val ? parseFloat(val) : null;
};

export const getLanguage = async (db: DB): Promise<string> => {
  const val = await getSetting(db, 'language');
  return val || 'hi';
};
