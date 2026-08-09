import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, FontFamily } from '../../lib/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name={icon} 
        size={64} 
        color={Colors.textSecondary} 
        style={{ opacity: 0.5, marginBottom: Spacing.lg }} 
      />
      <Text style={styles.title}>{t(title)}</Text>
      {subtitle && <Text style={styles.subtitle}>{t(subtitle)}</Text>}
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button 
            title={t(actionLabel)} 
            onPress={onAction} 
            variant="outline" 
            size="md" 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    marginTop: Spacing.xl,
  },
});
