import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, ClientCard } from '../../components';
import { AddClientModal } from '../../components/modals';
import { useDatabase } from '../../context/DatabaseContext';

interface Client {
    id: string;
    name: string;
    type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
    startDate: string;
    notes?: string;
}

export default function ClientsScreen() {
    const { clients } = useDatabase();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [clientList, setClientList] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setIsLoading(true);
            const data = await clients.getAll();
            setClientList(data);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddClient = async (data: Omit<Client, 'id'>) => {
        try {
            await clients.create(data);
            await loadClients();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    const handleDeleteClient = async (id: string) => {
        try {
            await clients.delete(id);
            await loadClients();
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Clients</Text>
                    <Text style={styles.subtitle}>Manage your client list</Text>
                </View>

                {/* Add Client Button */}
                <Button
                    title="Add New Client"
                    onPress={() => setIsModalVisible(true)}
                    variant="primary"
                    style={styles.addButton}
                />

                {/* Client List */}
                <View style={styles.clientList}>
                    {isLoading ? (
                        <Text style={styles.loadingText}>Loading clients...</Text>
                    ) : clientList.length === 0 ? (
                        <Text style={styles.emptyText}>No clients yet. Add your first client!</Text>
                    ) : (
                        clientList.map(client => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                onDelete={() => handleDeleteClient(client.id)}
                                style={styles.clientCard}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Add Client Modal */}
            <AddClientModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleAddClient}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 50,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    addButton: {
        marginBottom: 24,
    },
    clientList: {
        gap: 12,
    },
    clientCard: {
        marginBottom: 12,
    },
    loadingText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 24,
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 24,
    },
}); 