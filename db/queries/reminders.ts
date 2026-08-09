import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { reminders } from '../schema';
import * as schema from '../schema';

type DB = ExpoSQLiteDatabase<typeof schema>;

export const addReminder = async (db: DB, title: string, hour: number, minute: number) => {
  return await db.insert(reminders).values({ title, hour, minute, is_active: 1 }).returning();
};

export const getReminders = async (db: DB) => {
  return await db.select().from(reminders);
};

export const toggleReminder = async (db: DB, id: number, isActive: number, notificationId?: string) => {
  const updateData: Partial<typeof reminders.$inferInsert> = { is_active: isActive };
  if (notificationId !== undefined) {
    updateData.notification_id = notificationId;
  }
  return await db.update(reminders).set(updateData).where(eq(reminders.id, id)).returning();
};

export const deleteReminder = async (db: DB, id: number) => {
  return await db.delete(reminders).where(eq(reminders.id, id));
};

export const updateReminderNotificationId = async (db: DB, id: number, notificationId: string | null) => {
  return await db.update(reminders).set({ notification_id: notificationId }).where(eq(reminders.id, id)).returning();
};
