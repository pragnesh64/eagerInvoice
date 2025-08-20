import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, ClientCard, Dropdown } from '../../components';
import { AddClientModal } from '../../components/modals/AddClientModal';
import { useData } from '../../context/DataContext';
import { Client } from '../../data/dummyData';

export default function ClientsScreen() {
  const { 
    filteredClients, 
    filteredInvoices,
    getActiveClients, 
    getTotalRevenue, 
    setClientFilter 
  } = useData();
  
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleClientPress = (clientName: string) => {
    console.log('Client pressed:', clientName);
  };

  const handleAddClient = () => {
    setShowAddClientModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters(query, selectedType);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    updateFilters(searchQuery, type);
  };

  const updateFilters = (search: string, type: string) => {
    setClientFilter({
      search: search || undefined,
      type: type === 'all' ? undefined : type as Client['type'],
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setClientFilter({});
  };

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Micro', value: 'Micro' },
    { label: 'Mid', value: 'Mid' },
    { label: 'Core', value: 'Core' },
    { label: 'Large Retainer', value: 'Large Retainer' },
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
          <Text style={styles.mainTitle}>Clients</Text>
          <Text style={styles.subtitle}>Manage your client relationships</Text>
        </View>

        <View style={styles.spacer} />

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{filteredClients.length}</Text>
              <Text style={styles.statLabel}>Total Clients</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{getTotalRevenue().toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getActiveClients()}</Text>
              <Text style={styles.statLabel}>Active Clients</Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* Search and Filters */}
        <View style={styles.filtersCard}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search clients..."
            placeholderTextColor="#9ca3af"
          />
          
          <View style={styles.filterSection}>
            <Dropdown
              label="Filter by Type"
              options={typeOptions}
              value={selectedType}
              onValueChange={handleTypeFilter}
              placeholder="Select client type"
            />
          </View>

          {(searchQuery || selectedType !== 'all') && (
            <Button
              title="Clear Filters"
              variant="ghost"
              size="sm"
              onPress={clearFilters}
            />
          )}
        </View>

        <View style={styles.spacer} />

        {/* Clients List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filteredClients.length === 0 ? 'No Clients Found' : `All Clients (${filteredClients.length})`}
          </Text>
          <Button title="Add Client" variant="primary" size="sm" onPress={handleAddClient} />
        </View>

        <View style={styles.smallSpacer} />

        {filteredClients.length > 0 ? (
          filteredClients.map((client) => {
            // Calculate client revenue from invoices
            const clientInvoices = filteredInvoices.filter(inv => inv.clientId === client.id);
            const totalRevenue = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
            const invoiceCount = clientInvoices.length;
            const lastInvoice = clientInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            
            return (
              <ClientCard
                key={client.id}
                name={client.name}
                type={client.type}
                email={client.notes || ''}
                totalRevenue={totalRevenue}
                invoiceCount={invoiceCount}
                lastInvoiceDate={lastInvoice?.date}
                onPress={() => handleClientPress(client.name)}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedType !== 'all'
                ? 'No clients match your filters' 
                : 'No clients yet'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first client to get started'
              }
            </Text>
          </View>
        )}

        <View style={styles.largeSpacer} />
      </ScrollView>

      {/* Add Client Modal */}
      <AddClientModal
        visible={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
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
  statsCard: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
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