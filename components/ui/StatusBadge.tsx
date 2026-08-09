import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '../../lib/theme';

export type BadgeStatus = 'pending' | 'paid' | 'given' | 'taken';
export type BadgeSize = 'sm' | 'md';

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: BadgeSize;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation();

  const getConfig = () => {
    switch (status) {
      case 'pending':
        return {
          bg: Colors.dangerLight,
          color: Colors.danger,
          label: t('status.pending', 'Pending'),
        };
      case 'paid':
        return {
          bg: Colors.successLight,
          color: Colors.success,
          label: t('status.paid', 'Paid'),
        };
      case 'given':
        return {
          bg: Colors.udhaariGivenLight,
          color: Colors.udhaariGiven,
          label: t('status.given', 'Given'),
        };
      case 'taken':
        return {
          bg: Colors.udhaariTakenLight,
          color: Colors.udhaariTaken,
          label: t('status.taken', 'Taken'),
        };
    }
  };

  const config = getConfig();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config.color },
          size === 'sm' ? styles.textSm : styles.textMd,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontFamily: FontFamily.medium,
  },
  textSm: {
    fontSize: FontSize.xs,
  },
  textMd: {
    fontSize: FontSize.sm,
  },
});
