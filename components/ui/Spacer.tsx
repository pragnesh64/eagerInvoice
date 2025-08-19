import React from 'react';
import { View, ViewStyle } from 'react-native';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  axis?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function Spacer({
  size = 'md',
  axis = 'vertical',
  style,
}: SpacerProps) {
  const getSpacerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    const getSizeValue = () => {
      switch (size) {
        case 'xs':
          return 4;
        case 'sm':
          return 8;
        case 'lg':
          return 24;
        case 'xl':
          return 32;
        case '2xl':
          return 48;
        default: // md
          return 16;
      }
    };

    const sizeValue = getSizeValue();

    if (axis === 'horizontal') {
      baseStyle.width = sizeValue;
    } else {
      baseStyle.height = sizeValue;
    }

    return baseStyle;
  };

  return <View style={[getSpacerStyle(), style]} />;
}

// Convenience components for common spacing
export function XS({ axis, style }: Omit<SpacerProps, 'size'>) {
  return <Spacer size="xs" axis={axis} style={style} />;
}

export function SM({ axis, style }: Omit<SpacerProps, 'size'>) {
  return <Spacer size="sm" axis={axis} style={style} />;
}

export function MD({ axis, style }: Omit<SpacerProps, 'size'>) {
  return <Spacer size="md" axis={axis} style={style} />;
}

export function LG({ axis, style }: Omit<SpacerProps, 'size'>) {
  return <Spacer size="lg" axis={axis} style={style} />;
}

export function XL({ axis, style }: Omit<SpacerProps, 'size'>) {
  return <Spacer size="xl" axis={axis} style={style} />;
}

export function XXL({ axis, style }: Omit<SpacerProps, 'size'>) {
  return <Spacer size="2xl" axis={axis} style={style} />;
} 