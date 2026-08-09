import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '../../lib/theme';
import { Input } from './Input';

export const QUANTITY_PRESETS = [0.5, 1, 1.5, 2, 2.5, 3];

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  presets?: number[];
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  presets = QUANTITY_PRESETS,
}) => {
  const { t } = useTranslation();
  const [isCustom, setIsCustom] = useState(!presets.includes(value) && value > 0);

  const handleCustomChange = (text: string) => {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else if (text === '') {
      onChange(0);
    }
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {presets.map((preset) => {
          const isSelected = !isCustom && value === preset;
          return (
            <Pressable
              key={preset}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => {
                setIsCustom(false);
                onChange(preset);
              }}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {preset}L
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          style={[styles.pill, isCustom && styles.pillSelected]}
          onPress={() => setIsCustom(true)}
        >
          <Text style={[styles.pillText, isCustom && styles.pillTextSelected]}>
            {t('common.custom', 'Custom')}
          </Text>
        </Pressable>
      </ScrollView>
      
      {isCustom && (
        <View style={styles.customContainer}>
          <Input
            keyboardType="numeric"
            placeholder={t('common.enterQuantity', 'Enter quantity')}
            value={value > 0 ? value.toString() : ''}
            onChangeText={handleCustomChange}
            suffix="L"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  pill: {
    height: 48,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.milkLight,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: Colors.milk,
    transform: [{ scale: 1.05 }],
  },
  pillText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bold,
  },
  customContainer: {
    marginTop: Spacing.md,
  },
});
