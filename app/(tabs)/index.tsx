import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  ClientCard,
  FloatingActionButton,
  InvoiceCard,
  StatCard
} from '../../components';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
import { useData } from '../../context/DataContext';

export default function DashboardScreen() {
  const { 
    filteredInvoices, 
    filteredClients, 
    getTotalRevenue, 
    getOutstandingAmount,
    getActiveClients 
  } = useData();
  
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);

  const handleAddInvoice = () => {
    setShowAddInvoiceModal(true);
  };

  const handleInvoicePress = (invoiceNumber: string) => {
    console.log('Invoice pressed:', invoiceNumber);
  };

  const handleClientPress = (clientName: string) => {
    console.log('Client pressed:', clientName);
  };

  // Get recent invoices (last 3)
  const recentInvoices = filteredInvoices.slice(0, 3);
  
  // Get top clients (by revenue, last 2)
  const topClients = filteredClients
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 2);

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
          <Text style={styles.mainTitle}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back! Here's your overview.</Text>
        </View>

        <View style={styles.spacer} />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total Revenue"
            value={getTotalRevenue()}
            subtitle="All time"
            icon="house.fill"
            trend={{ value: 12, isPositive: true }}
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Outstanding"
            value={getOutstandingAmount()}
            subtitle="Pending payment"
            icon="chevron.right"
            trend={{ value: 8, isPositive: false }}
            variant="warning"
            style={styles.statCard}
          />
        </View>

        <View style={styles.spacer} />

        {/* Recent Invoices */}
        <View style={styles.cardContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Invoices</Text>
            <Button title="View All" variant="outline" size="sm" onPress={() => {}} />
          </View>
          
          <View style={styles.smallSpacer} />
          
          {recentInvoices.length > 0 ? (
            recentInvoices.map((invoice) => (
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
              <Text style={styles.emptyText}>No invoices yet</Text>
              <Text style={styles.emptySubtext}>Create your first invoice to get started</Text>
            </View>
          )}
        </View>

        <View style={styles.spacer} />

        {/* Top Clients */}
        <View style={styles.cardContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Clients</Text>
            <Button title="View All" variant="outline" size="sm" onPress={() => {}} />
          </View>
          
          <View style={styles.smallSpacer} />
          
          {topClients.length > 0 ? (
            topClients.map((client) => (
              <ClientCard
                key={client.id}
                name={client.name}
                type={client.type}
                email={client.email}
                totalRevenue={client.totalRevenue}
                invoiceCount={client.invoiceCount}
                lastInvoiceDate={client.lastInvoiceDate}
                onPress={() => handleClientPress(client.name)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No clients yet</Text>
              <Text style={styles.emptySubtext}>Add your first client to get started</Text>
            </View>
          )}
        </View>

        <View style={styles.largeSpacer} />
      </ScrollView>

      {/* Floating Action Button - Add Invoice */}
      <FloatingActionButton
        icon="chevron.left.forwardslash.chevron.right"
        variant="primary"
        onPress={handleAddInvoice}
      />

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
  cardContainer: {
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
