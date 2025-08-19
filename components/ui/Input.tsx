import React, { useState } from 'react';
import {
    TextInputProps as RNTextInputProps,
    StyleSheet,
    TextInput,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Text } from './Text';

interface InputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
}

export function Input({
  label,
  placeholder,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  ...textInputProps
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = 12;
        baseStyle.paddingVertical = 8;
        baseStyle.minHeight = 36;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 16;
        baseStyle.minHeight = 56;
        break;
      default: // md
        baseStyle.paddingHorizontal = 14;
        baseStyle.paddingVertical = 12;
        baseStyle.minHeight = 44;
    }

    // Variant and state styles
    if (error) {
      baseStyle.borderColor = colors.error;
    } else if (isFocused) {
      baseStyle.borderColor = colors.primary;
      baseStyle.borderWidth = 2;
    } else {
      baseStyle.borderColor = colors.border;
    }

    switch (variant) {
      case 'filled':
        baseStyle.backgroundColor = colors.backgroundSecondary;
        break;
      case 'outlined':
        baseStyle.backgroundColor = 'transparent';
        break;
      default:
        baseStyle.backgroundColor = colors.card;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      color: colors.text,
      fontSize: Typography.base,
      fontWeight: Typography.normal,
    };

    // Size text styles
    switch (size) {
      case 'sm':
        baseStyle.fontSize = Typography.sm;
        break;
      case 'lg':
        baseStyle.fontSize = Typography.lg;
        break;
    }

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    return {
      color: error ? colors.error : colors.textSecondary,
      fontSize: Typography.sm,
      fontWeight: Typography.medium,
      marginBottom: 4,
    };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      color: colors.error,
      fontSize: Typography.xs,
      fontWeight: Typography.normal,
      marginTop: 4,
    };
  };

  const getHelperStyle = (): TextStyle => {
    return {
      color: colors.textMuted,
      fontSize: Typography.xs,
      fontWeight: Typography.normal,
      marginTop: 4,
    };
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={StyleSheet.flatten([getLabelStyle(), labelStyle])}>
          {label}
        </Text>
      )}
      
      <View style={[getContainerStyle()]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={StyleSheet.flatten([getErrorStyle(), errorStyle])}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text style={StyleSheet.flatten([getHelperStyle(), helperStyle])}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 8,
  },
}); 