import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ClientTypeBadge } from './ui/Badge';

interface ClientCardProps {
  name: string;
  type: 'individual' | 'company' | 'startup' | 'enterprise';
  email: string;
  totalRevenue: number;
  invoiceCount: number;
  lastInvoiceDate?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ClientCard({
  name,
  type,
  email,
  totalRevenue,
  invoiceCount,
  lastInvoiceDate,
  onPress,
  style,
}: ClientCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (clientName: string) => {
    return clientName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const CardComponent = onPress ? Pressable : View;

  return (
    <CardComponent
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(name)}
            </Text>
          </View>
          
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{name}</Text>
            <Text style={styles.clientEmail}>
              {email}
            </Text>
          </View>
          
          <ClientTypeBadge type={type} size="sm" />
        </View>

        <View style={styles.divider} />

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${totalRevenue.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>
              Total Revenue
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {invoiceCount}
            </Text>
            <Text style={styles.statLabel}>
              Invoices
            </Text>
          </View>

          {lastInvoiceDate && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDate(lastInvoiceDate)}
              </Text>
              <Text style={styles.statLabel}>
                Last Invoice
              </Text>
            </View>
          )}
        </View>
      </View>
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  clientEmail: {
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
}); 