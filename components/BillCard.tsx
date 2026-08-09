import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily } from '../lib/theme';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { Button } from './ui/Button';
import { formatCurrency, formatDate } from '../lib/utils';
import { MilkBill } from '../lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BillCardProps {
  bill: MilkBill;
  onMarkPaid?: () => void;
  onDelete?: () => void;
}

export const BillCard: React.FC<BillCardProps> = React.memo(({ bill, onMarkPaid, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card variant="milk" style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.supplier}>{bill.supplierName}</Text>
          <View style={styles.dateRangeContainer}>
            <MaterialCommunityIcons name="calendar-range" size={14} color={Colors.textSecondary} />
            <Text style={styles.dateRange}>
              {formatDate(bill.startDate)} - {formatDate(bill.endDate)}
            </Text>
          </View>
        </View>
        <Text style={styles.amount}>{formatCurrency(bill.totalAmount)}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.quantityText}>
          {t('milk.totalQuantity', 'Total Quantity')}: <Text style={styles.quantityBold}>{bill.totalQuantity}L</Text>
        </Text>
      </View>

      <View style={styles.footer}>
        <StatusBadge status={bill.isPaid ? 'paid' : 'pending'} size="sm" />
        
        {!bill.isPaid && onMarkPaid && (
          <Button
            title={t('common.markAsPaid', 'Mark Paid')}
            onPress={onMarkPaid}
            variant="success"
            size="sm"
          />
        )}
      </View>
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
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  supplier: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRange: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.milk,
  },
  detailsContainer: {
    backgroundColor: Colors.milkLight,
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  quantityText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  quantityBold: {
    fontFamily: FontFamily.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
