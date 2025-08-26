import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-white",
        info: "border-transparent bg-blue-500 text-white",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5",
        lg: "px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge = React.forwardRef<React.ElementRef<typeof View>, BadgeProps>(
  ({ className, variant, size, children, style, textStyle, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getBadgeStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
      };

      // Size variants
      switch (size) {
        case 'sm':
          baseStyle.paddingHorizontal = 8;
          baseStyle.paddingVertical = 2;
          break;
        case 'lg':
          baseStyle.paddingHorizontal = 12;
          baseStyle.paddingVertical = 4;
          break;
        default: // default
          baseStyle.paddingHorizontal = 10;
          baseStyle.paddingVertical = 2;
      }

      // Variant styles
      switch (variant) {
        case 'secondary':
          baseStyle.backgroundColor = colors.backgroundSecondary;
          baseStyle.borderColor = colors.border;
          break;
        case 'destructive':
          baseStyle.backgroundColor = colors.error;
          baseStyle.borderColor = colors.error;
          break;
        case 'outline':
          baseStyle.backgroundColor = 'transparent';
          baseStyle.borderColor = colors.border;
          break;
        case 'success':
          baseStyle.backgroundColor = '#10b981';
          baseStyle.borderColor = '#10b981';
          break;
        case 'warning':
          baseStyle.backgroundColor = '#f59e0b';
          baseStyle.borderColor = '#f59e0b';
          break;
        case 'info':
          baseStyle.backgroundColor = '#3b82f6';
          baseStyle.borderColor = '#3b82f6';
          break;
        default: // primary
          baseStyle.backgroundColor = colors.primary;
          baseStyle.borderColor = colors.primary;
      }

      return baseStyle;
    };

    const getTextStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
      };

      // Size text styles
      switch (size) {
        case 'sm':
          baseStyle.fontSize = 10;
          break;
        case 'lg':
          baseStyle.fontSize = 14;
          break;
      }

      // Variant text colors
      switch (variant) {
        case 'secondary':
        case 'outline':
          baseStyle.color = colors.text;
          break;
        case 'destructive':
        case 'success':
        case 'warning':
        case 'info':
        case 'default':
          baseStyle.color = '#ffffff';
          break;
      }

      return baseStyle;
    };

    return (
      <View
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        style={[getBadgeStyle(), style]}
        {...props}
      >
        <Text style={[getTextStyle(), textStyle]}>
          {children}
        </Text>
      </View>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
