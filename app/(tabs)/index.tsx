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
    getSalary,
    getNetProfit,
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
    .sort((a, b) => {
      const aRevenue = filteredInvoices
        .filter(inv => inv.clientId === a.id)
        .reduce((sum, inv) => sum + inv.amount, 0);
      const bRevenue = filteredInvoices
        .filter(inv => inv.clientId === b.id)
        .reduce((sum, inv) => sum + inv.amount, 0);
      return bRevenue - aRevenue;
    })
    .slice(0, 2);

  const salary = getSalary();

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
            title="Monthly Revenue"
            value={getTotalRevenue()}
            subtitle="Total this month"
            icon="house.fill"
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Mohit's Salary"
            value={salary.total}
            subtitle={`₹${salary.retainer.toLocaleString()} + ₹${salary.commission.toLocaleString()}`}
            icon="chevron.right"
            variant="warning"
            style={styles.statCard}
          />
        </View>

        <View style={styles.spacer} />

        {/* Net Profit */}
        <View style={styles.profitCard}>
          <View style={styles.profitContent}>
            <Text style={styles.profitLabel}>Your Net Profit</Text>
            <Text style={styles.profitValue}>₹{getNetProfit().toLocaleString()}</Text>
            <Text style={styles.profitSubtitle}>
              Revenue: ₹{getTotalRevenue().toLocaleString()} - Salary: ₹{salary.total.toLocaleString()}
            </Text>
          </View>
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
            topClients.map((client) => {
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
  profitCard: {
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
  profitContent: {
    alignItems: 'center',
  },
  profitLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  profitValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  profitSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
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
