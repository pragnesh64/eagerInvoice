import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  ClientCard,
  InvoiceCard,
  StatCard
} from '../../components';
import { AddClientModal } from '../../components/modals/AddClientModal';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
import { EditInvoiceModal } from '../../components/modals/EditInvoiceModal';
import { useDatabase } from '../../context/DatabaseContext';
import { formatCurrency } from '../../utils/currencyUtils';

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
  const router = useRouter();

  const [clientList, setClientList] = useState<Client[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    revenue: 0,
    salary: DEFAULT_SALARY,
    netProfit: 0
  });
  const [allTimeStats, setAllTimeStats] = useState({
    totalRevenue: 0,
    totalSalaryPaid: 0,
    netProfit: 0
  });
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const allClients = await clients.getAll();
      setClientList(allClients.map(client => ({
        id: client.id,
        name: client.name,
        type: client.type,
        startDate: client.startDate,
        notes: client.notes,
        createdAt: client.createdAt
      })));

      const allInvoices = await invoices.getAll();
      const mappedInvoices = allInvoices.map(invoice => ({
        id: invoice.id,
        clientId: invoice.clientId,
        invoiceNo: invoice.invoiceNo,
        clientName: invoice.clientName || 'Unknown Client',
        amount: invoice.amount,
        date: invoice.date,
        totalRevenue: 0 // Added for client sorting
      }));
      setInvoiceList(mappedInvoices);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthOverview = await reports.getMonthlyOverview(currentMonth);

      // Get calculated salary based on current revenue
      const calculatedSalary = salary.getCalculatedSalary(currentMonth);
      const monthSalary = {
        retainer: calculatedSalary.retainer,
        commission: calculatedSalary.commission,
        total: calculatedSalary.total
      };

      setMonthlyStats({
        revenue: monthOverview?.revenue || 0,
        salary: monthSalary,
        netProfit: (monthOverview?.revenue || 0) - monthSalary.total
      });

      // Get all-time statistics
      const allTimeOverview = await reports.getAllTimeStats();
      console.log('All-time overview:', allTimeOverview); // Debug log
      setAllTimeStats({
        totalRevenue: Number(allTimeOverview.totalRevenue) || 0,
        totalSalaryPaid: Number(allTimeOverview.totalSalaryPaid) || 0,
        netProfit: Number(allTimeOverview.totalNetProfit) || 0
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

  const handleAddClient = () => {
    setShowAddClientModal(true);
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

  const handleClientPress = (clientName: string) => {
    console.log('Client pressed:', clientName);
  };

  const refreshData = async () => {
    await loadData();
  };



  // Get recent invoices (last 3) - already sorted by creation date from database
  const recentInvoices = invoiceList.slice(0, 3);

  // Get top clients (by revenue, last 2) - but show most recent first if revenue is same
  const topClients = clientList
    .map(client => {
      const clientInvoices = invoiceList.filter(inv => inv.clientId === client.id);
      const totalRevenue = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      return { ...client, totalRevenue };
    })
    .sort((a, b) => {
      // First sort by revenue (highest first)
      const revenueDiff = (b.totalRevenue || 0) - (a.totalRevenue || 0);
      if (revenueDiff !== 0) return revenueDiff;

      // If revenue is same, sort by creation date (newest first)
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    })
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
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back! Here's your overview.</Text>
        </View>

        <View style={styles.spacer} />

        {/* Monthly Summary Section */}
        <View>
          <Text style={styles.sectionTitle}>Monthly Summary</Text>
          <View style={styles.smallSpacer} />

          <View style={styles.statsRow}>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(monthlyStats.revenue)}
              subtitle="All clients this month"
              icon="house.fill"
              variant="primary"
              style={styles.statCard}
            />
            <StatCard
              title="Mohit's Salary"
              value={formatCurrency(monthlyStats.salary.total)}
              subtitle={`Retainer: ${formatCurrency(monthlyStats.salary.retainer)} | Commission: ${formatCurrency(monthlyStats.salary.commission)}`}
              icon="chevron.right"
              variant="warning"
              style={styles.statCard}
            />
          </View>

          <View style={styles.spacer} />

          <View style={styles.profitCard}>
            <View style={styles.profitContent}>
              <Text style={styles.profitLabel}>Your Remaining Profit</Text>
                          <Text style={styles.profitValue}>{formatCurrency(monthlyStats.netProfit)}</Text>
            <Text style={styles.profitSubtitle}>
              Revenue: {formatCurrency(monthlyStats.revenue)} - Salary: {formatCurrency(monthlyStats.salary.total)}
            </Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* All-time Summary Section */}
        <View>
          <Text style={styles.sectionTitle}>All-time Summary</Text>
          <View style={styles.smallSpacer} />

          <View style={styles.statsRow}>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(allTimeStats.totalRevenue)}
              subtitle="Cumulative revenue"
              icon="house.fill"
              variant="success"
              style={styles.statCard}
            />
            <StatCard
              title="Total Paid to Mohit"
              value={formatCurrency(allTimeStats.totalSalaryPaid)}
              subtitle="All-time salary paid"
              icon="chevron.right"
              variant="warning"
              style={styles.statCard}
            />
          </View>

          <View style={styles.spacer} />

          <View style={[styles.profitCard, styles.allTimeProfitCard]}>
            <View style={styles.profitContent}>
              <Text style={styles.profitLabel}>Net Profit</Text>
                          <Text style={styles.profitValue}>{formatCurrency(allTimeStats.netProfit)}</Text>
            <Text style={styles.profitSubtitle}>
              Total Revenue: {formatCurrency(allTimeStats.totalRevenue)} - Total Salary: {formatCurrency(allTimeStats.totalSalaryPaid)}
            </Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Clients</Text>
            <View style={styles.headerButtons}>
              <Button title="Add Client" variant="outline" size="sm" onPress={handleAddClient} />
              <Button title="View All" variant="outline" size="sm" onPress={() => router.push('/clients')} />
            </View>

          </View>

          <View style={styles.smallSpacer} />

          {topClients.length > 0 ? (
            topClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
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
        <View style={styles.spacer} />
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Invoices</Text>
            <Button title="View All" variant="outline" size="sm" onPress={() => router.push('/invoices')} />
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
                onEdit={() => handleEditInvoice(invoice)}
                onDelete={() => handleDeleteInvoice(invoice)}
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
      </ScrollView>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        visible={showAddInvoiceModal}
        onClose={() => setShowAddInvoiceModal(false)}
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
    backgroundColor: 'rgba(249, 250, 251, 0.1)',  
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  allTimeProfitCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
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
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  fabButton: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

});
