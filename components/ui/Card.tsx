import React, { useRef } from 'react';
import { Pressable, StyleSheet, Animated, ViewStyle, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Shadow } from '../../lib/theme';

export type CardVariant = 'default' | 'milk' | 'expense' | 'udhaariGiven' | 'udhaariTaken';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: CardVariant;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'milk': return Colors.milk;
      case 'expense': return Colors.expense;
      case 'udhaariGiven': return Colors.udhaariGiven;
      case 'udhaariTaken': return Colors.udhaariTaken;
      case 'default': return Colors.primary;
      default: return 'transparent';
    }
  };

  const borderStyle = {
    borderLeftWidth: 3,
    borderLeftColor: getBorderColor(),
  };

  const Container = onPress ? Pressable : (View as any);

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Container
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, borderStyle]}
      >
        {children}
      </Container>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.md,
  },
});
