import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBadge } from './ui/Badge';

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
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
          <Text style={styles.clientName}>{clientName}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>₹{amount.toLocaleString()}</Text>
          <StatusBadge status={status} size="sm" />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>Date:</Text>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>Due:</Text>
          <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  clientName: {
    fontSize: 13,
    color: '#6b7280',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInfo: {
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#111827',
  },
}); 