import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily } from '../lib/theme';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { Button } from './ui/Button';
import { formatCurrency, formatDate } from '../lib/utils';
import { UdhaariEntry } from '../lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UdhaariCardProps {
  entry: UdhaariEntry;
  onPress?: () => void;
  onDelete?: () => void;
  onMarkPaid?: () => void;
}

export const UdhaariCard: React.FC<UdhaariCardProps> = React.memo(({ entry, onPress, onDelete, onMarkPaid }) => {
  const { t } = useTranslation();
  const variant = entry.type === 'given' ? 'udhaariGiven' : 'udhaariTaken';
  const color = entry.type === 'given' ? Colors.udhaariGiven : Colors.udhaariTaken;

  return (
    <Card variant={variant} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.personName}>{entry.personName}</Text>
        <Text style={[styles.amount, { color }]}>
          {formatCurrency(entry.amount)}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <StatusBadge 
          status={entry.status === 'paid' ? 'paid' : entry.type} 
          size="sm" 
        />
        <View style={styles.dateContainer}>
          <MaterialCommunityIcons name="calendar" size={14} color={Colors.textSecondary} />
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
      </View>

      {entry.reason && (
        <Text style={styles.reason}>{entry.reason}</Text>
      )}

      {entry.status === 'pending' && onMarkPaid && (
        <View style={styles.actionContainer}>
          <Button 
            title={t('common.markAsPaid', 'Mark as Paid')} 
            onPress={onMarkPaid}
            variant="success"
            size="sm"
          />
        </View>
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
  personName: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
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
  reason: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  actionContainer: {
    marginTop: Spacing.md,
    alignItems: 'flex-start',
  }
});
