import { create } from 'zustand';
import { db } from '../db/database';
import * as milkQueries from '../db/queries/milk';
import { MilkEntryForm, MilkEntry } from '../lib/types';
import { eq } from 'drizzle-orm';
import { milk_entries } from '../db/schema';

interface MilkState {
  lastUpdated: number;
  triggerUpdate: () => void;
}

const useMilkStore = create<MilkState>((set) => ({
  lastUpdated: Date.now(),
  triggerUpdate: () => set({ lastUpdated: Date.now() }),
}));

export const useMilk = () => {
  const { lastUpdated, triggerUpdate } = useMilkStore();

  const addMilk = async (entry: MilkEntryForm) => {
    // Map from JS object to DB schema
    const mapped = {
      date: entry.date,
      shift: entry.shift,
      quantity: entry.quantity,
      rate_per_litre: entry.ratePerLitre,
      supplier_name: entry.supplierName,
      amount: entry.quantity * entry.ratePerLitre,
      notes: entry.notes || null,
    };
    const res = await milkQueries.addMilkEntry(db, mapped);
    triggerUpdate();
    return res;
  };

  const updateMilk = async (id: number, entry: Partial<MilkEntryForm>) => {
    const mapped: any = {};
    if (entry.date !== undefined) mapped.date = entry.date;
    if (entry.shift !== undefined) mapped.shift = entry.shift;
    if (entry.quantity !== undefined) mapped.quantity = entry.quantity;
    if (entry.ratePerLitre !== undefined) mapped.rate_per_litre = entry.ratePerLitre;
    if (entry.supplierName !== undefined) mapped.supplier_name = entry.supplierName;
    if (entry.notes !== undefined) mapped.notes = entry.notes;
    
    // Recalculate amount if needed, though this is tricky if we don't have the old values.
    // Assuming the UI provides full partial for quantity/rate if they change.
    
    await milkQueries.updateMilkEntry(db, id, mapped);
    triggerUpdate();
  };

  const deleteMilk = async (id: number) => {
    await milkQueries.deleteMilkEntry(db, id);
    triggerUpdate();
  };

  const getEntriesForMonth = async (year: number, month: number): Promise<MilkEntry[]> => {
    const raw = await milkQueries.getMilkEntriesByMonth(db, year, month);
    return raw.map((r: any) => ({
      id: r.id,
      date: r.date,
      shift: r.shift,
      quantity: r.quantity,
      ratePerLitre: r.rate_per_litre,
      supplierName: r.supplier_name,
      amount: r.amount,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  };

  const getEntriesForDate = async (dateStr: string): Promise<MilkEntry[]> => {
    const raw = await milkQueries.getMilkEntriesByDate(db, dateStr);
    return raw.map((r: any) => ({
      id: r.id,
      date: r.date,
      shift: r.shift,
      quantity: r.quantity,
      ratePerLitre: r.rate_per_litre,
      supplierName: r.supplier_name,
      amount: r.amount,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  };

  const getEntriesForRange = async (startDate: string, endDate: string): Promise<MilkEntry[]> => {
    const raw = await milkQueries.getMilkEntriesByRange(db, startDate, endDate);
    return raw.map((r: any) => ({
      id: r.id,
      date: r.date,
      shift: r.shift,
      quantity: r.quantity,
      ratePerLitre: r.rate_per_litre,
      supplierName: r.supplier_name,
      amount: r.amount,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  };

  const getMarkedDates = async (year: number, month: number) => {
    const entries = await getEntriesForMonth(year, month);
    const marked: Record<string, any> = {};
    
    entries.forEach((e) => {
      if (!marked[e.date]) {
        marked[e.date] = { dots: [{ color: '#F59E0B' }] }; // Milk color
      }
    });
    
    return marked;
  };

  const getEntryById = async (id: number): Promise<MilkEntry | null> => {
    const raw = await db.select().from(milk_entries).where(eq(milk_entries.id, id));
    if (!raw[0]) return null;
    const r = raw[0];
    return {
      id: r.id,
      date: r.date,
      shift: r.shift,
      quantity: r.quantity,
      ratePerLitre: r.rate_per_litre,
      supplierName: r.supplier_name,
      amount: r.amount,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  };

  return {
    lastUpdated,
    addMilk,
    updateMilk,
    deleteMilk,
    getEntriesForMonth,
    getEntriesForDate,
    getEntriesForRange,
    getEntryById,
    getMarkedDates,
  };
};
