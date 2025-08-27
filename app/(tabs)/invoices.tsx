import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, InvoiceCard } from '../../components';
import { AddClientModal } from '../../components/modals/AddClientModal';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
import { EditInvoiceModal } from '../../components/modals/EditInvoiceModal';
import { Dropdown } from '../../components/ui/Dropdown';
import { useDatabase } from '../../context/DatabaseContext';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  startDate: string;
  notes?: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  clientId: string;
  invoiceNo: string;
  clientName: string;
  amount: number;
  date: string;
}

export default function InvoicesScreen() {
  const params = useLocalSearchParams();
  const { clients, invoices, reports } = useDatabase();
  
  const [clientList, setClientList] = useState<Client[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  // Auto-apply client filter when navigating from client card
  useEffect(() => {
    if (params.clientId && typeof params.clientId === 'string') {
      setSelectedClient(params.clientId);
      // Clear any existing search when auto-filtering by client
      setSearchQuery('');
    }
  }, [params.clientId]);

  useEffect(() => {
    filterInvoices();
  }, [searchQuery, selectedClient, invoiceList]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load clients
      const allClients = await clients.getAll();
      setClientList(allClients.map(client => ({
        id: client.id,
        name: client.name,
        type: client.type,
        startDate: client.startDate,
        notes: client.notes,
        createdAt: client.createdAt
      })));

      // Load invoices
      const allInvoices = await invoices.getAll();
      setInvoiceList(allInvoices.map(invoice => ({
        id: invoice.id,
        clientId: invoice.clientId,
        invoiceNo: invoice.invoiceNo,
        clientName: invoice.clientName || 'Unknown Client',
        amount: invoice.amount,
        date: invoice.date,
      })));

      // Load stats
      const allTimeStats = await reports.getAllTimeStats();
      setStats({
        totalInvoices: allTimeStats.totalInvoices,
        totalRevenue: allTimeStats.totalRevenue,
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoiceList];

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNo.toLowerCase().includes(searchLower) ||
        invoice.clientName.toLowerCase().includes(searchLower)
      );
    }

    // Apply client filter
    if (selectedClient !== 'all') {
      filtered = filtered.filter(invoice => invoice.clientId === selectedClient);
    }

    setFilteredInvoices(filtered);
  };

  const handleInvoicePress = (invoiceNumber: string) => {
    console.log('Invoice pressed:', invoiceNumber);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowEditInvoiceModal(true);
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    Alert.alert(
      'Delete Invoice',
      `Are you sure you want to delete invoice ${invoice.invoiceNo}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await invoices.delete(invoice.id);
              Alert.alert('Success', 'Invoice deleted successfully!');
              loadData(); // Refresh the data
            } catch (error) {
              console.error('Error deleting invoice:', error);
              Alert.alert('Error', 'Failed to delete invoice. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddInvoice = () => {
    setShowAddInvoiceModal(true);
  };

  const handleAddClient = () => {
    setShowAddClientModal(true);
  };

  // Refresh data function
  const refreshData = () => {
    loadData();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClientFilter = (clientId: string) => {
    setSelectedClient(clientId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedClient('all');
  };

  const clientOptions = [
    { label: 'All Clients', value: 'all' },
    ...clientList.map(client => ({
      label: client.name,
      value: client.id,
    })),
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Invoices</Text>
          <Text style={styles.subtitle}>Track and manage your invoices</Text>
        </View>

        <View style={styles.spacer} />

        <View>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search invoices..."
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.filterSection}>
            <Dropdown
              label="Filter by Client"
              options={clientOptions}
              value={selectedClient}
              onValueChange={handleClientFilter}
              placeholder="Select client"
              labelColor="#111827"
            />
            <Button
              title="Add Client"
              variant="outline"
              size="sm"
              onPress={handleAddClient}
              style={styles.addClientButton}
            />
          </View>

          {(searchQuery || selectedClient !== 'all') && (
            <Button
              title="Clear Filters"
              variant="ghost"
              size="sm"
              onPress={clearFilters}
            />
          )}
        </View>

        <View style={styles.spacer} />

        {/* Invoices List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filteredInvoices.length === 0 ? 'No Invoices Found' : `Recent Invoices (${filteredInvoices.length})`}
          </Text>
          <Button title="Add Invoice" variant="primary" size="sm" onPress={handleAddInvoice} />
        </View>

        <View style={styles.smallSpacer} />

        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoiceNumber={invoice.invoiceNo}
              clientName={invoice.clientName || 'Unknown Client'}
              amount={invoice.amount}
              date={invoice.date}
              dueDate={invoice.date} // Using same date as due date for now
              status="paid"
              onPress={() => handleInvoicePress(invoice.invoiceNo)}
              onEdit={() => handleEditInvoice(invoice)}
              onDelete={() => handleDeleteInvoice(invoice)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedClient !== 'all'
                ? 'No invoices match your filters' 
                : 'No invoices yet'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedClient !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first invoice to get started'
              }
            </Text>
          </View>
        )}

        <View style={styles.largeSpacer} />
      </ScrollView>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        visible={showAddInvoiceModal}
        onClose={() => {
          setShowAddInvoiceModal(false);
          loadData(); // Reload data after adding invoice
        }}
        onRefresh={refreshData}
      />

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        visible={showEditInvoiceModal}
        invoice={selectedInvoice}
        onClose={() => {
          setShowEditInvoiceModal(false);
          setSelectedInvoice(null);
        }}
        onRefresh={refreshData}
      />

      {/* Add Client Modal */}
      <AddClientModal
        visible={showAddClientModal}
        onClose={() => {
          setShowAddClientModal(false);
        }}
        onRefresh={refreshData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    marginBottom: 4,
  },
  mainTitle: {
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
  spacer: {
    height: 16,
  },
  smallSpacer: {
    height: 8,
  },
  largeSpacer: {
    height: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  filtersCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        paddingVertical: 12,
      },
      android: {
        paddingVertical: 8,
      },
    }),
  },
  filterSection: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  addClientButton: {
    flexShrink: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  autoFilterIndicator: {
    backgroundColor: '#dbeafe',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  autoFilterText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
}); 