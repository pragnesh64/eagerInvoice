import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  ClientCard,
  FloatingActionButton,
  InvoiceCard,
  StatCard
} from '../../components';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
import { useDatabase } from '../../context/DatabaseContext';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  startDate: string;
  notes?: string;
}

interface Invoice {
  id: string;
  clientId: string;
  invoiceNo: string;
  clientName: string;
  amount: number;
  date: string;
  totalRevenue?: number;
}

interface SalaryData {
  retainer: number;
  commission: number;
  total: number;
}

const DEFAULT_SALARY: SalaryData = {
  retainer: 15000,
  commission: 0,
  total: 15000
};

export default function DashboardScreen() {
  const { clients, invoices, salary, reports } = useDatabase();

  const [clientList, setClientList] = useState<Client[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    revenue: 0,
    salary: DEFAULT_SALARY,
    netProfit: 0
  });
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load clients
      const allClients = await clients.getAll();
      setClientList(allClients.map(client => ({
        id: client.id,
        name: client.name,
        type: client.type,
        startDate: client.start_date,
        notes: client.notes
      })));

      // Load invoices with client names
      const allInvoices = await invoices.getAll();
      const mappedInvoices = allInvoices.map(invoice => ({
        id: invoice.id,
        clientId: invoice.client_id,
        invoiceNo: invoice.invoice_no,
        clientName: invoice.client_name || 'Unknown Client',
        amount: invoice.amount,
        date: invoice.date,
        totalRevenue: 0 // Added for client sorting
      }));
      setInvoiceList(mappedInvoices);

      // Load monthly stats
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthOverview = await reports.getMonthlyOverview(currentMonth);
      const monthSalaryData = await salary.getByMonth(currentMonth);
      const monthSalary = monthSalaryData ? {
        retainer: monthSalaryData.retainer,
        commission: monthSalaryData.commission,
        total: monthSalaryData.total
      } : DEFAULT_SALARY;
      
      setMonthlyStats({
        revenue: monthOverview?.revenue || 0,
        salary: monthSalary,
        netProfit: monthOverview?.netProfit || 0
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
  const recentInvoices = invoiceList.slice(0, 3);
  
  // Get top clients (by revenue, last 2)
  const topClients = clientList
    .map(client => {
      const clientInvoices = invoiceList.filter(inv => inv.clientId === client.id);
      const totalRevenue = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      return { ...client, totalRevenue };
    })
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 2);

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
            value={monthlyStats.revenue}
            subtitle="Total this month"
            icon="house.fill"
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Mohit's Salary"
            value={monthlyStats.salary.total}
            subtitle={`₹${monthlyStats.salary.total.toLocaleString()}`}
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
            <Text style={styles.profitValue}>₹{monthlyStats.netProfit.toLocaleString()}</Text>
            <Text style={styles.profitSubtitle}>
              Revenue: ₹{monthlyStats.revenue.toLocaleString()} - Salary: ₹{monthlyStats.salary.total.toLocaleString()}
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
                dueDate={invoice.date} // Using same date as due date for now
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
            topClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={() => {}} // Add delete handler if needed
                style={styles.clientCard}
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
  clientCard: {
    marginBottom: 8,
  },
});
