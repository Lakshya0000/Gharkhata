import { create } from 'zustand';
import { db } from '../db/database';
import * as billQueries from '../db/queries/bills';
import * as milkQueries from '../db/queries/milk';
import { MilkBill } from '../lib/types';

interface BillState {
  lastUpdated: number;
  triggerUpdate: () => void;
}

const useBillStore = create<BillState>((set) => ({
  lastUpdated: Date.now(),
  triggerUpdate: () => set({ lastUpdated: Date.now() }),
}));

export const useBills = () => {
  const { lastUpdated, triggerUpdate } = useBillStore();

  const generateBill = async (startDate: string, endDate: string) => {
    // 1. fetch all milk entries for range
    const entries = await milkQueries.getMilkEntriesByRange(db, startDate, endDate);
    
    // 2. compute totalQty and totalAmount
    let totalQty = 0;
    let totalAmount = 0;
    
    // We assume supplier Name is same for the period, pick from first or fallback to ''
    const supplierName = entries.length > 0 ? entries[0].supplier_name : '';

    for (const entry of entries) {
      totalQty += entry.quantity;
      totalAmount += entry.amount;
    }

    // 3. insert into DB
    const result = await billQueries.generateBill(db, startDate, endDate, supplierName, totalQty, totalAmount);
    triggerUpdate();
    return result;
  };

  const getAllBills = async (): Promise<MilkBill[]> => {
    const raw = await billQueries.getBills(db);
    return raw.map((r: any) => ({
      id: r.id,
      startDate: r.start_date,
      endDate: r.end_date,
      supplierName: r.supplier_name,
      totalQuantity: r.total_quantity,
      totalAmount: r.total_amount,
      isPaid: Boolean(r.is_paid),
      paidDate: r.paid_date,
      createdAt: r.created_at,
    }));
  };

  const markBillPaid = async (id: number) => {
    await billQueries.markBillPaid(db, id);
    triggerUpdate();
  };

  const deleteBill = async (id: number) => {
    await billQueries.deleteBill(db, id);
    triggerUpdate();
  };

  return {
    lastUpdated,
    generateBill,
    getAllBills,
    markBillPaid,
    deleteBill,
  };
};
