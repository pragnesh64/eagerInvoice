import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { StatusBadge } from './ui/Badge';

interface InvoiceCardProps {
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  onPress?: () => void;
  style?: ViewStyle;
}

export function InvoiceCard({
  invoiceNumber,
  clientName,
  amount,
  date,
  dueDate,
  status,
  onPress,
  style,
}: InvoiceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (status) {
      case 'paid':
        return '#059669';
      case 'pending':
        return '#d97706';
      case 'overdue':
        return '#dc2626';
      case 'draft':
        return '#6b7280';
    }
  };

  const CardComponent = onPress ? Pressable : View;

  return (
    <CardComponent
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
            <Text style={styles.clientName}>
              {clientName}
            </Text>
          </View>
          <StatusBadge status={status} size="sm" />
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <View style={styles.amountSection}>
            <Text style={styles.amount}>
              ${amount.toLocaleString()}
            </Text>
            <Text style={styles.amountLabel}>
              Amount
            </Text>
          </View>

          <View style={styles.dateSection}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Issued:</Text>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Due:</Text>
              <Text style={[styles.dateText, { color: getStatusColor() }]}>
                {formatDate(dueDate)}
              </Text>
            </View>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
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
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountSection: {
    alignItems: 'flex-start',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  amountLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginRight: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
}); 