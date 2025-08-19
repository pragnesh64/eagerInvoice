import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  style?: ViewStyle;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  style,
}: StatCardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      minHeight: 100,
      borderRadius: 12,
      padding: 16,
    };

    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = '#1e40af'; // Dark blue
        break;
      case 'success':
        baseStyle.backgroundColor = '#047857'; // Dark green
        break;
      case 'warning':
        baseStyle.backgroundColor = '#b45309'; // Dark amber
        break;
      default:
        baseStyle.backgroundColor = '#ffffff'; // White
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = '#d1d5db';
    }

    return baseStyle;
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'warning':
        return '#ffffff'; // White text
      default:
        return '#111827'; // Dark text
    }
  };

  const getSubtitleColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'warning':
        return '#e5e7eb'; // Light gray
      default:
        return '#6b7280'; // Gray
    }
  };

  const getIconBackgroundColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'warning':
        return 'rgba(255, 255, 255, 0.2)';
      default:
        return '#f3f4f6';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'warning':
        return '#ffffff';
      default:
        return '#1e40af';
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
            <IconSymbol
              name={icon}
              size={18}
              color={getIconColor()}
            />
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: getSubtitleColor() }]}>
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.valueText, { color: getTextColor() }]}>
          {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
        </Text>
        
        {subtitle && (
          <Text style={[styles.subtitleText, { color: getSubtitleColor() }]}>
            {subtitle}
          </Text>
        )}

        {trend && (
          <View style={styles.trendContainer}>
            <IconSymbol
              name={trend.isPositive ? 'chevron.right' : 'chevron.left.forwardslash.chevron.right'}
              size={10}
              color={trend.isPositive ? '#10b981' : '#ef4444'}
            />
            <Text style={[styles.trendText, { color: trend.isPositive ? '#10b981' : '#ef4444' }]}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 11,
    marginBottom: 6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  trendText: {
    marginLeft: 3,
    fontSize: 11,
    fontWeight: '600',
  },
}); 