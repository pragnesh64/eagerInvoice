import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  startDate: string;
  notes?: string;
}

export interface ClientCardProps {
  client: Client;
  onDelete?: () => void;
  onEdit?: () => void;
  style?: ViewStyle;
}

export function ClientCard({ client, onDelete, onEdit, style }: ClientCardProps) {
  const lastTap = useRef(0);
  const DOUBLE_TAP_DELAY = 300;
  const [isDoubleTapped, setIsDoubleTapped] = useState(false);

  const handleDoubleTap = () => {
    const now = Date.now();
    const delta = now - lastTap.current;

    if (delta < DOUBLE_TAP_DELAY) {
      if (onEdit) onEdit();
      setIsDoubleTapped(true);
      setTimeout(() => setIsDoubleTapped(false), 800);
    }
    lastTap.current = now;
  };

  const getTypeColor = (type: Client['type']) => {
    switch (type) {
      case 'Micro':
        return '#10b981'; // green
      case 'Mid':
        return '#3b82f6'; // blue
      case 'Core':
        return '#8b5cf6'; // purple
      case 'Large Retainer':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) throw new Error('Invalid format');
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <View style={[styles.container, style, isDoubleTapped && styles.doubleTapped]}>
      <TouchableOpacity style={styles.cardContent} onPress={handleDoubleTap} activeOpacity={0.85}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{client.name}</Text>
            <View style={styles.headerRight}>
              <View style={[styles.badge, { backgroundColor: getTypeColor(client.type) }]}>
                <Text style={styles.badgeText}>{client.type}</Text>
              </View>
              {onEdit && <IconSymbol name="hand.tap" size={16} color="#9ca3af" style={styles.editHint} />}
            </View>
          </View>

          {/* Details */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <IconSymbol name="calendar" size={16} color="#9ca3af" />
              <Text style={styles.detailText}>Started: {formatDate(client.startDate)}</Text>
            </View>

            {client.notes && (
              <View style={styles.detailRow}>
                <IconSymbol name="note.text" size={16} color="#9ca3af" />
                <Text style={styles.detailText} numberOfLines={2}>
                  {client.notes}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actionButtons}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <IconSymbol name="pencil" size={18} color="#3b82f6" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <IconSymbol name="trash" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937', // dark modern background
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  doubleTapped: {
    opacity: 0.9,
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    minWidth: 80,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  editHint: {
    marginTop: -2,
  },
  details: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#d1d5db',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
});
