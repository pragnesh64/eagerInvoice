import { cva, type VariantProps } from 'class-variance-authority';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { useColorScheme } from '../../hooks/useColorScheme';
import { createFocusAnimation } from '../../utils/animationUtils';

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border-2",
        filled: "bg-muted",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-2 py-1",
        lg: "h-11 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface InputProps 
  extends Omit<RNTextInputProps, 'style'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
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
  size = 'default',
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
  
  // Animation refs
  // Removed borderAnim to fix native driver conflicts
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
    };

    // Animate border width on focus
    if (isFocused) {
      baseStyle.borderWidth = 2;
    }

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
      default: // default
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
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        break;
      default:
        baseStyle.backgroundColor = colors.background;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      color: colors.text,
      fontSize: Typography.base,
      fontWeight: Typography.normal,
      ...Platform.select({
        ios: {
          paddingVertical: 0,
        },
        android: {
          paddingVertical: 0,
        },
      }),
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
      color: error ? colors.error : colors.text,
      fontSize: Typography.sm,
      fontWeight: Typography.semibold,
      marginBottom: 6,
      opacity: 1,
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

  const focusAnimation = createFocusAnimation(scaleAnim, undefined, labelAnim);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.blur();
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Animated.Text 
          style={[
            StyleSheet.flatten([getLabelStyle(), labelStyle]),
            {
              transform: [{ scale: labelAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05]
              })}],
            }
          ]}
        >
          {label}
        </Animated.Text>
      )}
      
      <Animated.View 
        style={[
          getContainerStyle(),
          {
            transform: [{ scale: scaleAnim }],
            borderWidth: isFocused ? 2 : 1,
          }
        ]}
      >
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
          autoCapitalize={textInputProps.autoCapitalize || 'sentences'}
          autoCorrect={textInputProps.autoCorrect !== undefined ? textInputProps.autoCorrect : true}
          returnKeyType={textInputProps.returnKeyType || 'default'}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </Animated.View>
      
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

export { inputVariants };
