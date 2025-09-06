import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AddClientModal, ClientCard, EditClientModal, FloatingActionButton, IconSymbol } from '../../components';
import { Colors } from '../../constants/Colors';
import { useDatabase } from '../../context/DatabaseContext';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  startDate: string;
  notes?: string;
  createdAt: string;
}

export default function ClientsScreen() {
  const router = useRouter();
  const { clients } = useDatabase();
  const { invoices } = useDatabase();
  const [clientList, setClientList] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchQuery, clientList]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const allClients = await clients.getAll();
      setClientList(allClients as Client[]);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = () => {
    if (!searchQuery.trim()) {
      setFilteredClients(clientList);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = clientList.filter(client =>
      client.name.toLowerCase().includes(searchLower) ||
      client.type.toLowerCase().includes(searchLower) ||
      (client.notes && client.notes.toLowerCase().includes(searchLower))
    );
    setFilteredClients(filtered);
  };

  const handleDeleteClient = async (client: Client) => {
    try {
      // Check if client has associated invoices
      const clientInvoices = await invoices.getByClientId(client.id);
      const hasInvoices = clientInvoices && clientInvoices.length > 0;
      
      const message = hasInvoices 
        ? `Are you sure you want to delete "${client.name}"? This will also delete ${clientInvoices.length} associated invoice(s). This action cannot be undone.`
        : `Are you sure you want to delete "${client.name}"? This action cannot be undone.`;

      Alert.alert(
        'Confirm Deletion',
        message,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await clients.delete(client.id);
                loadClients(); // Reload the list
              } catch (error) {
                console.error('Error deleting client:', error);
                Alert.alert('Error', 'Failed to delete client. Please try again.');
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error checking client invoices:', error);
      // Fallback to basic confirmation if invoice check fails
      Alert.alert(
        'Confirm Deletion',
        `Are you sure you want to delete "${client.name}"? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await clients.delete(client.id);
                loadClients(); // Reload the list
              } catch (error) {
                console.error('Error deleting client:', error);
                Alert.alert('Error', 'Failed to delete client. Please try again.');
              }
            },
          },
        ],
      );
    }
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditClientModal(true);
  };

  const handleViewInvoices = (client: Client) => {
    // Navigate to invoices screen with client filter
    router.push({
      pathname: '/invoices',
      params: { clientId: client.id, clientName: client.name }
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleAddClient = () => {
    setShowAddClientModal(true);
  };

  const refreshData = () => {
    loadClients();
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../../assets/images/bgimage.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={20} tint="light" style={styles.blurOverlay} />
        <View style={styles.darkOverlay} />
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/bgimage.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <BlurView intensity={20} tint="light" style={styles.blurOverlay} />
      <View style={styles.darkOverlay} />
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Clients</Text>
            <Text style={styles.subtitle}>Manage your client relationships</Text>
          </View>

          <View style={styles.spacer} />

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={Colors.light.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients..."
              placeholderTextColor={Colors.light.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <IconSymbol name="xmark.circle.fill" size={20} color={Colors.light.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.spacer} />

          {/* Client List */}
          <View style={styles.clientList}>
            {filteredClients.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {searchQuery.trim() ? 'No clients found matching your search' : 'No clients yet. Add your first client!'}
                </Text>
                {searchQuery.trim() && (
                  <Text style={styles.emptySubtext}>Try searching by name, type, or notes</Text>
                )}
              </View>
            ) : (
              filteredClients.map(client => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={() => handleEditClient(client)}
                  onDelete={() => handleDeleteClient(client)}
                  onInvoices={() => handleViewInvoices(client)}
                  style={styles.clientCard}
                />
              ))
            )}
          </View>

          <View style={styles.largeSpacer} />
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton
          icon="plus"
          variant="primary"
          onPress={handleAddClient}
        />

        {/* Add Client Modal */}
        <AddClientModal
          visible={showAddClientModal}
          onClose={() => {
            setShowAddClientModal(false);
          }}
          onRefresh={refreshData}
        />

        {/* Edit Client Modal */}
        <EditClientModal
          visible={showEditClientModal}
          client={selectedClient}
          onClose={() => {
            setShowEditClientModal(false);
            setSelectedClient(null);
          }}
          onRefresh={refreshData}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  header: {
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  spacer: {
    height: 16,
  },
  largeSpacer: {
    height: 32,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.dark.text,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  clientList: {
    gap: 12,
  },
  clientCard: {
    marginBottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    textAlign: 'center',
  },
}); 