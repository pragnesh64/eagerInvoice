import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Dropdown, InvoiceCard, StatCard } from '../../components';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
import { useData } from '../../context/DataContext';
import { Invoice } from '../../data/dummyData';

export default function InvoicesScreen() {
  const { 
    filteredInvoices, 
    getTotalInvoices, 
    getOutstandingAmount, 
    setInvoiceFilter,
    clients 
  } = useData();
  
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');

  const handleInvoicePress = (invoiceNumber: string) => {
    console.log('Invoice pressed:', invoiceNumber);
  };

  const handleAddInvoice = () => {
    setShowAddInvoiceModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters(query, selectedStatus, selectedClient);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    updateFilters(searchQuery, status, selectedClient);
  };

  const handleClientFilter = (clientId: string) => {
    setSelectedClient(clientId);
    updateFilters(searchQuery, selectedStatus, clientId);
  };

  const updateFilters = (search: string, status: string, clientId: string) => {
    setInvoiceFilter({
      search: search || undefined,
      status: status === 'all' ? undefined : status as Invoice['status'],
      clientId: clientId === 'all' ? undefined : clientId,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedClient('all');
    setInvoiceFilter({});
  };

  // Calculate statistics
  const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid');
  const pendingInvoices = filteredInvoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = filteredInvoices.filter(inv => inv.status === 'overdue');

  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Draft', value: 'draft' },
  ];

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
            value={getTotalInvoices()}
            subtitle="All time"
            icon="house.fill"
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Outstanding"
            value={getOutstandingAmount()}
            subtitle="Pending payment"
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
              label="Filter by Status"
              options={statusOptions}
              value={selectedStatus}
              onValueChange={handleStatusFilter}
              placeholder="Select status"
            />
          </View>

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

          {(searchQuery || selectedStatus !== 'all' || selectedClient !== 'all') && (
            <Button
              title="Clear Filters"
              variant="ghost"
              size="sm"
              onPress={clearFilters}
            />
          )}
        </View>

        <View style={styles.spacer} />

        {/* Status Summary */}
        <View style={styles.statusSummary}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Paid</Text>
            <Text style={styles.statusValue}>${totalPaid.toLocaleString()}</Text>
            <Text style={styles.statusCount}>({paidInvoices.length})</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Pending</Text>
            <Text style={styles.statusValue}>${totalPending.toLocaleString()}</Text>
            <Text style={styles.statusCount}>({pendingInvoices.length})</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Overdue</Text>
            <Text style={styles.statusValue}>${totalOverdue.toLocaleString()}</Text>
            <Text style={styles.statusCount}>({overdueInvoices.length})</Text>
          </View>
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
              invoiceNumber={invoice.invoiceNumber}
              clientName={invoice.clientName}
              amount={invoice.totalAmount}
              date={invoice.issueDate}
              dueDate={invoice.dueDate}
              status={invoice.status}
              onPress={() => handleInvoicePress(invoice.invoiceNumber)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedStatus !== 'all' || selectedClient !== 'all' 
                ? 'No invoices match your filters' 
                : 'No invoices yet'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedStatus !== 'all' || selectedClient !== 'all'
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
  statusSummary: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statusCount: {
    fontSize: 11,
    color: '#9ca3af',
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