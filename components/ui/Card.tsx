import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Shadows } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  margin?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'md',
  margin = 'sm',
  disabled = false,
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getPaddingStyle = () => {
    switch (padding) {
      case 'sm': return styles.paddingSm;
      case 'lg': return styles.paddingLg;
      default: return styles.paddingMd;
    }
  };

  const getMarginStyle = () => {
    switch (margin) {
      case 'sm': return styles.marginSm;
      case 'lg': return styles.marginLg;
      default: return styles.marginMd;
    }
  };

  const cardStyle = [
    styles.card,
    getPaddingStyle(),
    getMarginStyle(),
    {
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
    },
    variant === 'elevated' && { ...Shadows.lg },
    variant === 'outlined' && { borderWidth: 1 },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          cardStyle,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: 'white',
  },
  paddingSm: {
    padding: 12,
  },
  paddingMd: {
    padding: 16,
  },
  paddingLg: {
    padding: 20,
  },
  marginSm: {
    margin: 8,
  },
  marginMd: {
    margin: 12,
  },
  marginLg: {
    margin: 16,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
}); 