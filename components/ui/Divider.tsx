import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dashed' | 'dotted';
  style?: ViewStyle;
  margin?: 'sm' | 'md' | 'lg';
}

export function Divider({
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  style,
  margin = 'md',
}: DividerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getDividerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.border,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.height = orientation === 'horizontal' ? 1 : 16;
        baseStyle.width = orientation === 'vertical' ? 1 : '100%';
        break;
      case 'lg':
        baseStyle.height = orientation === 'horizontal' ? 3 : 32;
        baseStyle.width = orientation === 'vertical' ? 3 : '100%';
        break;
      default: // md
        baseStyle.height = orientation === 'horizontal' ? 2 : 24;
        baseStyle.width = orientation === 'vertical' ? 2 : '100%';
    }

    // Margin styles
    switch (margin) {
      case 'sm':
        baseStyle.marginVertical = orientation === 'horizontal' ? 8 : 0;
        baseStyle.marginHorizontal = orientation === 'vertical' ? 8 : 0;
        break;
      case 'lg':
        baseStyle.marginVertical = orientation === 'horizontal' ? 24 : 0;
        baseStyle.marginHorizontal = orientation === 'vertical' ? 24 : 0;
        break;
      default: // md
        baseStyle.marginVertical = orientation === 'horizontal' ? 16 : 0;
        baseStyle.marginHorizontal = orientation === 'vertical' ? 16 : 0;
    }

    // Variant styles
    switch (variant) {
      case 'dashed':
        baseStyle.borderStyle = 'dashed';
        baseStyle.borderWidth = size === 'sm' ? 1 : size === 'lg' ? 3 : 2;
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = colors.border;
        break;
      case 'dotted':
        baseStyle.borderStyle = 'dotted';
        baseStyle.borderWidth = size === 'sm' ? 1 : size === 'lg' ? 3 : 2;
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = colors.border;
        break;
      default:
        // Default solid line
        break;
    }

    return baseStyle;
  };

  return <View style={[getDividerStyle(), style]} />;
} 