import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { cn } from '../../utils/cn';

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-2",
        elevated: "shadow-lg",
        filled: "bg-muted",
      },
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card = React.forwardRef<React.ElementRef<typeof View>, CardProps>(
  ({ className, variant, size, children, style, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const getCardStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        borderRadius: 12,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
      };

      // Size variants
      switch (size) {
        case 'sm':
          baseStyle.padding = 12;
          break;
        case 'lg':
          baseStyle.padding = 24;
          break;
        default: // default
          baseStyle.padding = 16;
      }

      // Variant styles
      switch (variant) {
        case 'outline':
          baseStyle.borderWidth = 2;
          break;
        case 'elevated':
          baseStyle.shadowColor = '#000';
          baseStyle.shadowOffset = { width: 0, height: 4 };
          baseStyle.shadowOpacity = 0.1;
          baseStyle.shadowRadius = 8;
          baseStyle.elevation = 8;
          break;
        case 'filled':
          baseStyle.backgroundColor = colors.backgroundSecondary;
          break;
        default:
          baseStyle.shadowColor = '#000';
          baseStyle.shadowOffset = { width: 0, height: 2 };
          baseStyle.shadowOpacity = 0.05;
          baseStyle.shadowRadius = 4;
          baseStyle.elevation = 2;
      }

      return baseStyle;
    };

    return (
      <View
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        style={[getCardStyle(), style]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Card.displayName = "Card";

// Card Header Component
export interface CardHeaderProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardHeader = React.forwardRef<React.ElementRef<typeof View>, CardHeaderProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <View
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        ref={ref}
        style={[{ paddingBottom: 16 }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Title Component
export interface CardTitleProps
  extends React.ComponentPropsWithoutRef<typeof Text> {
  children: React.ReactNode;
  style?: TextStyle;
}

const CardTitle = React.forwardRef<React.ElementRef<typeof Text>, CardTitleProps>(
  ({ className, children, style, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
      <Text
        className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
        ref={ref}
        style={[
          {
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
          },
          style
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

CardTitle.displayName = "CardTitle";

// Card Description Component
export interface CardDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof Text> {
  children: React.ReactNode;
  style?: TextStyle;
}

const CardDescription = React.forwardRef<React.ElementRef<typeof Text>, CardDescriptionProps>(
  ({ className, children, style, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
      <Text
        className={cn("text-sm text-muted-foreground", className)}
        ref={ref}
        style={[
          {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
          },
          style
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

CardDescription.displayName = "CardDescription";

// Card Content Component
export interface CardContentProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardContent = React.forwardRef<React.ElementRef<typeof View>, CardContentProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <View
        className={cn("p-6 pt-0", className)}
        ref={ref}
        style={[{ paddingTop: 0 }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

CardContent.displayName = "CardContent";

// Card Footer Component
export interface CardFooterProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardFooter = React.forwardRef<React.ElementRef<typeof View>, CardFooterProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <View
        className={cn("flex items-center p-6 pt-0", className)}
        ref={ref}
        style={[{ paddingTop: 0 }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
