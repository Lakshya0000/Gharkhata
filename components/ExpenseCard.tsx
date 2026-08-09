import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, FontFamily } from '../lib/theme';
import { Card } from './ui/Card';
import { formatCurrency, formatDate } from '../lib/utils';
import { Expense } from '../lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ExpenseCardProps {
  entry: Expense;
  onPress?: () => void;
  onDelete?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = React.memo(({ entry, onPress, onDelete }) => {
  return (
    <Card variant="expense" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
        <Text style={styles.amount}>{formatCurrency(entry.amount)}</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <MaterialCommunityIcons name="calendar" size={16} color={Colors.textSecondary} />
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{'Expense'}</Text>
        </View>
      </View>

      {entry.note && (
        <Text style={styles.notes}>{entry.note}</Text>
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.expense,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  notes: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  }
});
