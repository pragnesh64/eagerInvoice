import React from 'react';
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
    style?: ViewStyle;
}

export function ClientCard({ client, onDelete, style }: ClientCardProps) {
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
            // First check if the date is in YYYY-MM-DD format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                throw new Error('Invalid date format');
            }

            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month is 0-based

            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{client.name}</Text>
                    <View style={[styles.badge, { backgroundColor: getTypeColor(client.type) }]}>
                        <Text style={styles.badgeText}>{client.type}</Text>
                    </View>
                </View>

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <IconSymbol name="calendar" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>
                            Started: {formatDate(client.startDate)}
                        </Text>
                    </View>

                    {client.notes && (
                        <View style={styles.detailRow}>
                            <IconSymbol name="note.text" size={16} color="#6b7280" />
                            <Text style={styles.detailText} numberOfLines={2}>
                                {client.notes}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <IconSymbol name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#ffffff',
    },
    details: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1,
    },
    deleteButton: {
        marginLeft: 16,
        padding: 8,
    },
}); 