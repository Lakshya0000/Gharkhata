import { create } from 'zustand';
import { db } from '../db/database';
import * as udhaariQueries from '../db/queries/udhaari';
import { UdhaariForm, UdhaariEntry, UdhaariSummary } from '../lib/types';

interface UdhaariState {
  lastUpdated: number;
  triggerUpdate: () => void;
}

const useUdhaariStore = create<UdhaariState>((set) => ({
  lastUpdated: Date.now(),
  triggerUpdate: () => set({ lastUpdated: Date.now() }),
}));

export const useUdhaari = () => {
  const { lastUpdated, triggerUpdate } = useUdhaariStore();

  const mapToEntry = (r: any): UdhaariEntry => ({
    id: r.id,
    personName: r.person_name,
    amount: r.amount,
    type: r.type,
    reason: r.reason,
    date: r.date,
    status: r.status,
    paidDate: r.paid_date,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  });

  const addUdhaari = async (form: UdhaariForm) => {
    await udhaariQueries.addUdhaari(db, {
      person_name: form.personName,
      amount: form.amount,
      type: form.type,
      reason: form.reason || null,
      date: form.date,
      status: 'pending',
    });
    triggerUpdate();
  };

  const updateUdhaari = async (id: number, data: Partial<UdhaariForm>) => {
    const mapped: any = {};
    if (data.personName !== undefined) mapped.person_name = data.personName;
    if (data.amount !== undefined) mapped.amount = data.amount;
    if (data.type !== undefined) mapped.type = data.type;
    if (data.reason !== undefined) mapped.reason = data.reason;
    if (data.date !== undefined) mapped.date = data.date;

    await udhaariQueries.updateUdhaari(db, id, mapped);
    triggerUpdate();
  };

  const deleteUdhaari = async (id: number) => {
    await udhaariQueries.deleteUdhaari(db, id);
    triggerUpdate();
  };

  const markPaid = async (id: number) => {
    await udhaariQueries.markUdhaariPaid(db, id);
    triggerUpdate();
  };

  const getPending = async (): Promise<UdhaariEntry[]> => {
    const raw = await udhaariQueries.getUdhaariByStatus(db, 'pending');
    return raw.map(mapToEntry);
  };

  const getSettled = async (): Promise<UdhaariEntry[]> => {
    const raw = await udhaariQueries.getUdhaariByStatus(db, 'settled');
    return raw.map(mapToEntry);
  };

  const getAll = async (): Promise<UdhaariEntry[]> => {
    const raw = await udhaariQueries.getAllUdhaari(db);
    return raw.map(mapToEntry);
  };

  const getSummary = async (): Promise<UdhaariSummary> => {
    const sum = await udhaariQueries.getUdhaariSummary(db);
    return {
      totalGiven: Number(sum.totalGiven),
      totalTaken: Number(sum.totalTaken),
      netAmount: Number(sum.netAmount)
    };
  };

  return {
    lastUpdated,
    addUdhaari,
    updateUdhaari,
    deleteUdhaari,
    markPaid,
    getPending,
    getSettled,
    getAll,
    getSummary,
  };
};
