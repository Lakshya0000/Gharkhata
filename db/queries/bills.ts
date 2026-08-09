import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { milk_bills } from '../schema';
import * as schema from '../schema';

type DB = ExpoSQLiteDatabase<typeof schema>;

export const generateBill = async (db: DB, startDate: string, endDate: string, supplierName: string, totalQty: number, totalAmount: number) => {
  return await db.insert(milk_bills).values({
    start_date: startDate,
    end_date: endDate,
    supplier_name: supplierName,
    total_quantity: totalQty,
    total_amount: totalAmount,
    is_paid: 0
  }).returning();
};

export const getBills = async (db: DB) => {
  return await db.select().from(milk_bills);
};

export const markBillPaid = async (db: DB, id: number) => {
  const date = new Date().toISOString().split('T')[0];
  return await db.update(milk_bills).set({ is_paid: 1, paid_date: date }).where(eq(milk_bills.id, id)).returning();
};

export const deleteBill = async (db: DB, id: number) => {
  return await db.delete(milk_bills).where(eq(milk_bills.id, id));
};
