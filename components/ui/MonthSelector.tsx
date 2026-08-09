import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, isSameMonth, addMonths, subMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '../../lib/theme';

const MONTH_KEYS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ year, month, onChange }) => {
  const { t } = useTranslation();
  const currentDate = new Date(year, month);
  const now = new Date();
  
  const isCurrentMonth = isSameMonth(currentDate, now);

  const handlePrev = () => {
    const prev = subMonths(currentDate, 1);
    onChange(prev.getFullYear(), prev.getMonth());
  };

  const handleNext = () => {
    if (isCurrentMonth) return;
    const next = addMonths(currentDate, 1);
    onChange(next.getFullYear(), next.getMonth());
  };

  const monthIndex = currentDate.getMonth();
  const monthName = t(`months.${MONTH_KEYS[monthIndex]}`, format(currentDate, 'MMMM'));

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePrev} style={styles.button}>
        <MaterialCommunityIcons name="chevron-left" size={32} color={Colors.textPrimary} />
      </Pressable>
      
      <Text style={styles.monthText}>
        {monthName} {currentDate.getFullYear()}
      </Text>
      
      <Pressable 
        onPress={handleNext} 
        style={[styles.button, isCurrentMonth && styles.buttonDisabled]}
        disabled={isCurrentMonth}
      >
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={32} 
          color={isCurrentMonth ? Colors.textSecondary : Colors.textPrimary} 
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  monthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
});
