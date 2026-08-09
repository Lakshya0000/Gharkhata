import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMilk } from '../../hooks/useMilk';
import { useExpenses } from '../../hooks/useExpenses';
import { useUdhaari } from '../../hooks/useUdhaari';
import { useBills } from '../../hooks/useBills';
import { Card } from '../../components/ui/Card';
import { MonthSelector } from '../../components/ui/MonthSelector';
import { Colors, Spacing, FontFamily, FontSize } from '../../lib/theme';
import { formatCurrency } from '../../lib/utils';
import { MilkBill } from '../../lib/types';

export default function SummaryScreen() {
  const { t } = useTranslation();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const { getEntriesForMonth, lastUpdated: milkUpdated } = useMilk();
  const { getMonthlyTotal, getExpensesForMonth, lastUpdated: expenseUpdated } = useExpenses();
  const { getSummary, lastUpdated: udhaariUpdated } = useUdhaari();
  const { getAllBills, markBillPaid, deleteBill, lastUpdated: billsUpdated } = useBills();

  const [milkSummary, setMilkSummary] = useState({ totalQuantity: 0, totalAmount: 0 });
  const [expenseSummary, setExpenseSummary] = useState({ totalAmount: 0 });
  const [monthExpenses, setMonthExpenses] = useState<any[]>([]);

  React.useEffect(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    getEntriesForMonth(y, m + 1).then(entries => {
      let q = 0, a = 0;
      entries.forEach(e => { q += e.quantity; a += e.amount; });
      setMilkSummary({ totalQuantity: q, totalAmount: a });
    });
  }, [currentDate, milkUpdated]);

  React.useEffect(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    getMonthlyTotal(y, m + 1).then(t => setExpenseSummary({ totalAmount: t }));
    getExpensesForMonth(y, m + 1).then(exps => setMonthExpenses(exps));
  }, [currentDate, expenseUpdated]);

  const grandTotal = (milkSummary?.totalAmount || 0) + (expenseSummary?.totalAmount || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MonthSelector 
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        onChange={(y, m) => {
          const newDate = new Date(currentDate);
          newDate.setFullYear(y);
          newDate.setMonth(m);
          setCurrentDate(newDate);
        }} 
      />

      <View style={[styles.cardsContainer, styles.row, { justifyContent: 'space-between', gap: Spacing.sm }]}>
        <Card variant="milk" style={[styles.summaryCard, styles.flex1] as any}>
          <Text style={styles.cardTitle}>{t('summary.milkTotal', 'Milk Total')}</Text>
          <Text style={[styles.cardAmount, { color: Colors.milk, fontSize: FontSize.lg }]}>
            {formatCurrency(milkSummary?.totalAmount || 0)}
          </Text>
        </Card>

        <Card variant="expense" style={[styles.summaryCard, styles.flex1] as any}>
          <Text style={styles.cardTitle}>{t('summary.otherExpenses', 'Other Expenses')}</Text>
          <Text style={[styles.cardAmount, { color: Colors.expense, fontSize: FontSize.lg }]}>
            {formatCurrency(expenseSummary?.totalAmount || 0)}
          </Text>
        </Card>
        
        <Card variant="default" style={[styles.summaryCard, styles.flex1] as any}>
          <Text style={styles.cardTitle}>{t('summary.grandTotal', 'Grand Total')}</Text>
          <Text style={[styles.cardAmount, { color: Colors.primary, fontSize: FontSize.lg }]}>
            {formatCurrency(grandTotal)}
          </Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>{t('summary.monthTransactions', "Month's Transactions")}</Text>
      
      {milkSummary.totalAmount > 0 && (
        <Card style={styles.transactionCard}>
          <View style={styles.transactionRow}>
            <View style={styles.transactionLeft}>
              <Text style={styles.transactionTitle}>{t('tabs.milk', 'Milk')}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: Colors.milk }]}>
              {formatCurrency(milkSummary.totalAmount)}
            </Text>
          </View>
        </Card>
      )}

      {monthExpenses.length === 0 && milkSummary.totalAmount === 0 ? (
        <Text style={styles.emptyText}>{t('noData', 'No Data')}</Text>
      ) : (
        monthExpenses.map((expense) => (
          <Card key={expense.id} style={styles.transactionCard}>
            <View style={styles.transactionRow}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionTitle}>{expense.title}</Text>
                <Text style={styles.transactionDate}>{expense.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: Colors.expense }]}>
                {formatCurrency(expense.amount)}
              </Text>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  cardsContainer: {
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    marginBottom: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  cardAmount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  transactionCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  transactionDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  }
});
