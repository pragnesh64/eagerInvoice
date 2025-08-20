import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Dropdown, InvoiceCard, StatCard } from '../../components';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
import { useData } from '../../context/DataContext';

export default function InvoicesScreen() {
  const { 
    filteredInvoices, 
    getTotalInvoices, 
    getTotalRevenue, 
    setInvoiceFilter,
    clients 
  } = useData();
  
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('all');

  const handleInvoicePress = (invoiceNumber: string) => {
    console.log('Invoice pressed:', invoiceNumber);
  };

  const handleAddInvoice = () => {
    setShowAddInvoiceModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters(query, selectedClient);
  };

  const handleClientFilter = (clientId: string) => {
    setSelectedClient(clientId);
    updateFilters(searchQuery, clientId);
  };

  const updateFilters = (search: string, clientId: string) => {
    setInvoiceFilter({
      search: search || undefined,
      clientId: clientId === 'all' ? undefined : clientId,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedClient('all');
    setInvoiceFilter({});
  };

  // Calculate statistics
  const totalRevenue = getTotalRevenue();
  const totalInvoices = getTotalInvoices();

  const clientOptions = [
    { label: 'All Clients', value: 'all' },
    ...clients.map(client => ({
      label: client.name,
      value: client.id,
    })),
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
            value={totalInvoices}
            subtitle="All time"
            icon="house.fill"
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
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
          />
          
          <View style={styles.filterSection}>
            <Dropdown
              label="Filter by Client"
              options={clientOptions}
              value={selectedClient}
              onValueChange={handleClientFilter}
              placeholder="Select client"
              searchable={true}
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
              clientName={invoice.clientName}
              amount={invoice.amount}
              date={invoice.date}
              dueDate={invoice.date}
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
        onClose={() => setShowAddInvoiceModal(false)}
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