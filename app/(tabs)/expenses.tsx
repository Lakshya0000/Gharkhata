import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { useExpenses } from '../../hooks/useExpenses';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Shadow } from '../../lib/theme';
import { Expense } from '../../lib/types';
import { formatDate, formatCurrency } from '../../lib/utils';
import { FAB } from '../../components/ui/FAB';
import { EmptyState } from '../../components/ui/EmptyState';

export default function ExpensesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getExpensesForMonth, lastUpdated } = useExpenses();
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [entriesForMonth, setEntriesForMonth] = useState<Expense[]>([]);
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const y = parseInt(selectedDate.split('-')[0]);
      const m = parseInt(selectedDate.split('-')[1]);
      const data = await getExpensesForMonth(y, m);
      setEntriesForMonth(data);
      setEntriesForSelectedDate(data.filter((entry) => entry.date === selectedDate));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, lastUpdated]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const markedDates = entriesForMonth.reduce((acc: any, entry: any) => {
    acc[entry.date] = { marked: true, dotColor: Colors.expense };
    return acc;
  }, {});

  markedDates[selectedDate] = { 
    ...markedDates[selectedDate], 
    selected: true, 
    selectedColor: Colors.expense 
  };

  const renderExpense = (item: Expense) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.card} 
      onPress={() => router.push(`/expense/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardIcon}>
        <Ionicons name="receipt-outline" size={24} color={Colors.expense} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.cardAmountContainer}>
        <Text style={styles.cardAmount}>{formatCurrency(item.amount)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          onMonthChange={(month: any) => setSelectedDate(month.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: Colors.surface,
            calendarBackground: Colors.surface,
            textSectionTitleColor: Colors.textPrimary,
            selectedDayBackgroundColor: Colors.expense,
            selectedDayTextColor: Colors.surface,
            todayTextColor: Colors.expense,
            dayTextColor: Colors.textPrimary,
            textDisabledColor: '#d9e1e8',
            dotColor: Colors.expense,
            selectedDotColor: Colors.surface,
            arrowColor: Colors.expense,
            monthTextColor: Colors.textPrimary,
            indicatorColor: Colors.expense,
            textDayFontFamily: FontFamily.regular,
            textMonthFontFamily: FontFamily.semiBold,
            textDayHeaderFontFamily: FontFamily.regular,
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />

        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>
            {format(new Date(selectedDate), 'dd MMM yyyy')}
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={Colors.expense} style={styles.loader} />
          ) : entriesForSelectedDate.length > 0 ? (
            entriesForSelectedDate.map(renderExpense)
          ) : (
            <EmptyState 
              title={t('no_expenses', 'No Expenses')} 
              subtitle={t('no_expenses_desc', 'Tap the + button to add your first expense for this date.')} 
              icon="wallet" 
            />
          )}
        </View>
      </ScrollView>

      <FAB 
        icon="plus" 
        onPress={() => router.push({ pathname: '/expense/add', params: { date: selectedDate } })} 
        color={Colors.expense} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  entriesSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.massive * 2,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  loader: {
    marginTop: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.expenseLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
  cardAmountContainer: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    color: Colors.expenseDark,
  },
});
