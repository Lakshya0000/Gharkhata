import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius, Shadow } from '../lib/theme';
import { formatCurrency } from '../lib/utils';

interface SummaryCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  amount: number;
  color: string;
  subtitle?: string;
  isCurrency?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = React.memo(({
  icon,
  label,
  amount,
  color,
  subtitle,
  isCurrency = true,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{t(label)}</Text>
        <Text style={[styles.amount, { color }]}>
          {isCurrency ? formatCurrency(amount) : amount}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
