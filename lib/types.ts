export interface MilkEntry {
  id: number;
  date: string;
  shift: 'Morning' | 'Evening';
  quantity: number;
  ratePerLitre: number;
  supplierName: string;
  amount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MilkBill {
  id: number;
  startDate: string;
  endDate: string;
  supplierName: string;
  totalQuantity: number;
  totalAmount: number;
  isPaid: boolean;
  paidDate: string | null;
  createdAt: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  note: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface UdhaariEntry {
  id: number;
  personName: string;
  amount: number;
  type: 'given' | 'taken';
  reason: string | null;
  date: string;
  status: 'pending' | 'paid';
  paidDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: number;
  title: string;
  hour: number;
  minute: number;
  isActive: boolean;
  notificationId: string | null;
  createdAt: string;
}

// Form types for creating new entries (without id, timestamps)
export interface MilkEntryForm { date: string; shift: 'Morning' | 'Evening'; quantity: number; ratePerLitre: number; amount: number; supplierName: string; notes?: string; }
export interface ExpenseForm { title: string; amount: number; note?: string; date: string; }
export interface UdhaariForm { personName: string; amount: number; type: 'given' | 'taken'; reason?: string; date: string; }
export interface ReminderForm { title: string; hour: number; minute: number; }

export interface UdhaariSummary { totalGiven: number; totalTaken: number; netAmount: number; }
export interface MonthlySummary { milkTotal: number; milkQuantity: number; expenseTotal: number; grandTotal: number; udhaariGiven: number; udhaariTaken: number; }
