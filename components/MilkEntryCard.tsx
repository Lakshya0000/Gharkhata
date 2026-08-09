import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontFamily } from '../lib/theme';
import { Card } from './ui/Card';
import { formatCurrency, formatDate } from '../lib/utils';
import { MilkEntry } from '../lib/types';
import { useTranslation } from 'react-i18next';

interface MilkEntryCardProps {
  entry: MilkEntry;
  onPress?: () => void;
  onDelete?: () => void;
}

export const MilkEntryCard: React.FC<MilkEntryCardProps> = React.memo(({ entry, onPress, onDelete }) => {
  const { t } = useTranslation();
  
  return (
    <Card variant="milk" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.quantity}>{entry.quantity}L</Text>
        <Text style={styles.amount}>{formatCurrency(entry.amount)}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.dateContainer}>
          <MaterialCommunityIcons 
            name={entry.shift === 'Morning' ? 'weather-sunny' : 'moon-waning-crescent'} 
            size={18} 
            color={entry.shift === 'Morning' ? '#F59E0B' : '#6366F1'} 
          />
          <Text style={styles.date}>{t(entry.shift.toLowerCase(), entry.shift)}</Text>
        </View>
        <Text style={styles.rate}>{formatCurrency(entry.ratePerLitre)}/L</Text>
      </View>

      {entry.notes && (
        <Text style={styles.notes}>{entry.notes}</Text>
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
  quantity: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.milk,
  },
  detailsRow: {
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
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  rate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
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
