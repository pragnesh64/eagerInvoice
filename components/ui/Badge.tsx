import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
}: BadgeProps) {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingVertical = 2;
        baseStyle.paddingHorizontal = 6;
        break;
      case 'lg':
        baseStyle.paddingVertical = 6;
        baseStyle.paddingHorizontal = 12;
        break;
      default: // md
        baseStyle.paddingVertical = 4;
        baseStyle.paddingHorizontal = 8;
    }

    // Variant styles
    switch (variant) {
      case 'success':
        baseStyle.backgroundColor = '#059669';
        break;
      case 'warning':
        baseStyle.backgroundColor = '#d97706';
        break;
      case 'error':
        baseStyle.backgroundColor = '#dc2626';
        break;
      case 'info':
        baseStyle.backgroundColor = '#1e40af';
        break;
      case 'primary':
        baseStyle.backgroundColor = '#1e40af';
        break;
      case 'secondary':
        baseStyle.backgroundColor = '#7c3aed';
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = '#d1d5db';
        break;
      default:
        baseStyle.backgroundColor = '#f3f4f6';
    }

    return baseStyle;
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
      case 'warning':
      case 'error':
      case 'info':
      case 'primary':
      case 'secondary':
        return '#ffffff';
      case 'outline':
        return '#6b7280';
      default:
        return '#374151';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 10;
      case 'lg':
        return 12;
      default:
        return 11;
    }
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text
        style={{
          color: getTextColor(),
          fontSize: getTextSize(),
          fontWeight: '600',
        }}
      >
        {children}
      </Text>
    </View>
  );
}

// Convenience components for common badge types
export function StatusBadge({ 
  status, 
  ...props 
}: Omit<BadgeProps, 'children' | 'variant'> & { 
  status: 'paid' | 'pending' | 'overdue' | 'draft' 
}) {
  const getVariant = () => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'draft':
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant()} {...props}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function ClientTypeBadge({ 
  type, 
  ...props 
}: Omit<BadgeProps, 'children' | 'variant'> & { 
  type: 'individual' | 'company' | 'startup' | 'enterprise' 
}) {
  const getVariant = () => {
    switch (type) {
      case 'enterprise':
        return 'primary';
      case 'company':
        return 'info';
      case 'startup':
        return 'secondary';
      case 'individual':
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant()} {...props}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
} 