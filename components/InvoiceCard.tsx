import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from './ui/Badge';

interface InvoiceCardProps {
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  onPress?: () => void;
}

export function InvoiceCard({
  invoiceNumber,
  clientName,
  amount,
  date,
  dueDate,
  status,
  onPress,
}: InvoiceCardProps) {
  const formatDate = (dateString: string) => {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) throw new Error('Invalid date format');
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'destructive';
      case 'draft':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
          <Text style={styles.clientName}>{clientName}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>₹{amount.toLocaleString()}</Text>
          <Badge variant={getStatusVariant(status)} size="sm">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>Issued</Text>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>Due</Text>
          <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937', // Dark card
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#9ca3af',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f3f4f6',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInfo: {
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e7eb',
  },
});
