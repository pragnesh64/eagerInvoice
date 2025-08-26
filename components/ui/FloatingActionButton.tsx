import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { IconSymbol } from './IconSymbol';

interface FloatingActionButtonProps {
  icon: 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right' | 'plus';
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
  disabled?: boolean;
}

export function FloatingActionButton({
  icon,
  onPress,
  size = 'md',
  variant = 'primary',
  style,
  disabled = false,
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 24,
      right: 24,
      ...Shadows.lg,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.width = 48;
        baseStyle.height = 48;
        break;
      case 'lg':
        baseStyle.width = 72;
        baseStyle.height = 72;
        break;
      default: // md
        baseStyle.width = 56;
        baseStyle.height = 56;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        break;
      case 'success':
        baseStyle.backgroundColor = colors.success;
        break;
      case 'warning':
        baseStyle.backgroundColor = colors.warning;
        break;
      case 'error':
        baseStyle.backgroundColor = colors.error;
        break;
    }

    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 20;
      case 'lg':
        return 32;
      default: // md
        return 24;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <IconSymbol
        name={icon}
        size={getIconSize()}
        color="white"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.5,
  },
}); 