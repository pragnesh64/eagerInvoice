import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  style?: any;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  style 
}: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#059669', color: '#ffffff' };
      case 'warning':
        return { backgroundColor: '#d97706', color: '#ffffff' };
      case 'error':
        return { backgroundColor: '#dc2626', color: '#ffffff' };
      case 'info':
        return { backgroundColor: '#1e40af', color: '#ffffff' };
      case 'outline':
        return { backgroundColor: 'transparent', color: '#6b7280', borderColor: '#d1d5db' };
      case 'primary':
        return { backgroundColor: '#7c3aed', color: '#ffffff' };
      case 'secondary':
        return { backgroundColor: '#f3f4f6', color: '#374151' };
      default:
        return { backgroundColor: '#6b7280', color: '#ffffff' };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 };
      case 'lg':
        return { paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 };
      default:
        return { paddingHorizontal: 8, paddingVertical: 3, fontSize: 11 };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
      },
      sizeStyle,
      style
    ]}>
      <Text style={[
        styles.text,
        {
          color: variantStyle.color,
          fontSize: sizeStyle.fontSize,
        }
      ]}>
        {children}
      </Text>
    </View>
  );
}

interface StatusBadgeProps {
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusVariant = () => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'draft':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getStatusVariant()} size={size}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

interface ClientTypeBadgeProps {
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  size?: 'sm' | 'md' | 'lg';
}

export function ClientTypeBadge({ type, size = 'md' }: ClientTypeBadgeProps) {
  const getTypeVariant = () => {
    switch (type) {
      case 'Micro':
        return 'outline';
      case 'Mid':
        return 'secondary';
      case 'Core':
        return 'primary';
      case 'Large Retainer':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getTypeVariant()} size={size}>
      {type}
    </Badge>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
}); 