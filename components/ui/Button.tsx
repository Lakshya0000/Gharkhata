import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontFamily, BorderRadius } from '../../lib/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getContainerStyles = (): ViewStyle => {
    let styles: ViewStyle = { ...baseContainerStyles[size] };
    if (fullWidth) styles.width = '100%';

    switch (variant) {
      case 'primary':
        styles.backgroundColor = Colors.primary;
        break;
      case 'secondary':
        styles.backgroundColor = Colors.surfaceVariant;
        break;
      case 'danger':
        styles.backgroundColor = Colors.danger;
        break;
      case 'outline':
        styles.backgroundColor = 'transparent';
        styles.borderWidth = 1.5;
        styles.borderColor = Colors.primary;
        break;
      case 'success':
        styles.backgroundColor = Colors.success;
        break;
    }

    if (disabled) {
      styles.opacity = 0.6;
    }

    return styles;
  };

  const getTextStyles = (): TextStyle => {
    let styles: TextStyle = { ...baseTextStyles[size] };
    
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        styles.color = '#FFFFFF';
        break;
      case 'secondary':
        styles.color = Colors.textPrimary;
        break;
      case 'outline':
        styles.color = Colors.primary;
        break;
    }

    return styles;
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && { width: '100%' }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.container, getContainerStyles()]}
      >
        {loading ? (
          <ActivityIndicator color={getTextStyles().color} />
        ) : (
          <View style={styles.content}>
            {icon && <MaterialCommunityIcons name={icon} size={size === 'sm' ? 18 : 24} color={getTextStyles().color as string} style={styles.icon} />}
            <Text style={[styles.text, getTextStyles()]}>{title}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const baseContainerStyles: Record<ButtonSize, ViewStyle> = {
  sm: { height: 40, paddingHorizontal: Spacing.md },
  md: { height: 48, paddingHorizontal: Spacing.lg },
  lg: { height: 56, paddingHorizontal: Spacing.xl },
};

const baseTextStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: FontSize.md },
  md: { fontSize: FontSize.lg },
  lg: { fontSize: FontSize.xl },
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FontFamily.semiBold,
  },
  icon: {
    marginRight: Spacing.sm,
  },
});
