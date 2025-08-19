import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { useColorScheme } from '../../hooks/useColorScheme';

interface TextProps {
  children: React.ReactNode;
  variant?: keyof typeof TextStyles;
  color?: keyof typeof Colors.light | 'auto';
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  onPress?: () => void;
  selectable?: boolean;
}

export function Text({
  children,
  variant = 'body',
  color = 'auto',
  style,
  numberOfLines,
  ellipsizeMode,
  onPress,
  selectable = false,
}: TextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getTextColor = () => {
    if (color === 'auto') {
      return colors.text;
    }
    return colors[color];
  };

  const textStyle = [
    TextStyles[variant],
    {
      color: getTextColor(),
    },
    style,
  ];

  return (
    <RNText
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      selectable={selectable}
    >
      {children}
    </RNText>
  );
}

// Convenience components for common text variants
export function Heading1({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h1" {...props}>{children}</Text>;
}

export function Heading2({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h2" {...props}>{children}</Text>;
}

export function Heading3({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h3" {...props}>{children}</Text>;
}

export function Heading4({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="h4" {...props}>{children}</Text>;
}

export function BodyText({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="body" {...props}>{children}</Text>;
}

export function BodyLarge({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="bodyLarge" {...props}>{children}</Text>;
}

export function BodySmall({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="bodySmall" {...props}>{children}</Text>;
}

export function Caption({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="caption" {...props}>{children}</Text>;
}

export function Label({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="label" {...props}>{children}</Text>;
}

export function Display({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="display" {...props}>{children}</Text>;
}

export function Monospace({ children, ...props }: Omit<TextProps, 'variant'>) {
  return <Text variant="monospace" {...props}>{children}</Text>;
} 