import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = 14;
        baseStyle.paddingVertical = 8;
        baseStyle.minHeight = 36;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = 24;
        baseStyle.paddingVertical = 16;
        baseStyle.minHeight = 52;
        break;
      default: // md
        baseStyle.paddingHorizontal = 18;
        baseStyle.paddingVertical = 12;
        baseStyle.minHeight = 44;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = '#1e40af';
        baseStyle.shadowColor = '#1e40af';
        baseStyle.shadowOpacity = 0.2;
        break;
      case 'secondary':
        baseStyle.backgroundColor = '#7c3aed';
        baseStyle.shadowColor = '#7c3aed';
        baseStyle.shadowOpacity = 0.2;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1.5;
        baseStyle.borderColor = '#1e40af';
        baseStyle.shadowOpacity = 0;
        baseStyle.elevation = 0;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.shadowOpacity = 0;
        baseStyle.elevation = 0;
        break;
      case 'danger':
        baseStyle.backgroundColor = '#dc2626';
        baseStyle.shadowColor = '#dc2626';
        baseStyle.shadowOpacity = 0.2;
        break;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.3,
    };

    // Size text styles
    switch (size) {
      case 'sm':
        baseTextStyle.fontSize = 13;
        break;
      case 'lg':
        baseTextStyle.fontSize = 16;
        break;
      default: // md
        baseTextStyle.fontSize = 14;
    }

    // Variant text styles
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        baseTextStyle.color = '#ffffff';
        break;
      case 'outline':
        baseTextStyle.color = '#1e40af';
        break;
      case 'ghost':
        baseTextStyle.color = '#1e40af';
        break;
    }

    return baseTextStyle;
  };

  const buttonStyle = [getButtonStyle(), style];
  const textStyleCombined = [getTextStyle(), textStyle];

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && !loading && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <Text style={textStyleCombined}>
        {loading ? 'Loading...' : title}
      </Text>
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginHorizontal: 4,
  },
}); 