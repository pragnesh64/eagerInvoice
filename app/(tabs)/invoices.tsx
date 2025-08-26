import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, InvoiceCard, StatCard } from '../../components';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
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
  const { clients, invoices, reports } = useDatabase();
  
  const [clientList, setClientList] = useState<Client[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
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

  const handleAddInvoice = () => {
    setShowAddInvoiceModal(true);
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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total Invoices"
            value={stats.totalInvoices}
            subtitle="All time"
            icon="house.fill"
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            subtitle="All time"
            icon="chevron.right"
            variant="warning"
            style={styles.statCard}
          />
        </View>

        <View style={styles.spacer} />

        {/* Search and Filters */}
        <View style={styles.filtersCard}>
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
}); 