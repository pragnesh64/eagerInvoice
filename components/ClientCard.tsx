import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ClientTypeBadge } from './ui/Badge';

interface ClientCardProps {
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  email?: string;
  totalRevenue: number;
  invoiceCount: number;
  lastInvoiceDate?: string;
  onPress?: () => void;
}

export function ClientCard({
  name,
  type,
  email,
  totalRevenue,
  invoiceCount,
  lastInvoiceDate,
  onPress,
}: ClientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{name}</Text>
          <ClientTypeBadge type={type} />
          {email && <Text style={styles.clientEmail}>{email}</Text>}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹{totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{invoiceCount}</Text>
          <Text style={styles.statLabel}>Invoices</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {lastInvoiceDate ? formatDate(lastInvoiceDate) : 'N/A'}
          </Text>
          <Text style={styles.statLabel}>Last Invoice</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
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
  stat: {
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
  },
}); 