import { useCallback } from 'react';
import { create } from 'zustand';
import { db } from '../db/database';
import * as expenseQueries from '../db/queries/expenses';
import { ExpenseForm, Expense } from '../lib/types';

interface ExpenseState {
  lastUpdated: number;
  triggerUpdate: () => void;
}

const useExpenseStore = create<ExpenseState>((set) => ({
  lastUpdated: Date.now(),
  triggerUpdate: () => set({ lastUpdated: Date.now() }),
}));

export const useExpenses = () => {
  const { lastUpdated, triggerUpdate } = useExpenseStore();

  const addExpense = async (form: ExpenseForm) => {
    await expenseQueries.addExpense(db, {
      title: form.title,
      amount: form.amount,
      note: form.note || null,
      date: form.date,
    });
    triggerUpdate();
  };

  const updateExpense = async (id: number, data: Partial<ExpenseForm>) => {
    const mapped: any = {};
    if (data.title !== undefined) mapped.title = data.title;
    if (data.amount !== undefined) mapped.amount = data.amount;
    if (data.note !== undefined) mapped.note = data.note;
    if (data.date !== undefined) mapped.date = data.date;

    await expenseQueries.updateExpense(db, id, mapped);
    triggerUpdate();
  };

  const deleteExpense = async (id: number) => {
    await expenseQueries.deleteExpense(db, id);
    triggerUpdate();
  };

  const getExpensesForMonth = useCallback(async (year: number, month: number): Promise<Expense[]> => {
    const raw = await expenseQueries.getExpensesByMonth(db, year, month);
    return raw.map((r: any) => ({
      id: r.id,
      title: r.title,
      amount: r.amount,
      note: r.note,
      date: r.date,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }, []);

  const getMonthlyTotal = useCallback(async (year: number, month: number): Promise<number> => {
    return Number(await expenseQueries.getMonthlyExpenseTotal(db, year, month)) || 0;
  }, []);

  return {
    lastUpdated,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesForMonth,
    getMonthlyTotal,
  };
};
