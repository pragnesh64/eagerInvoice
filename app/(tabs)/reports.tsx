import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Button, StatCard } from '../../components';
import { useDatabase } from '../../context/DatabaseContext';
import {
  downloadCSV,
  downloadPDF,
  exportClientsToCSV,
  exportInvoicesToCSV,
  exportReportToCSV,
  generatePDFReport,
  shareData
} from '../../utils/exportUtils';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  startDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface MonthlyTrend {
  month: string;
  revenue: number;
  salary: number;
  netProfit: number;
}

interface TopClient {
  clientId: string;
  clientName: string;
  revenue: number;
  percentage: number;
}

interface ReportData {
  monthlyRevenue: number;
  totalInvoices: number;
  totalClients: number;
  salary: {
    retainer: number;
    commission: number;
    total: number;
  };
  netProfit: number;
  monthlyTrends: MonthlyTrend[];
  topClients: TopClient[];
  allTimeSummary: {
    totalRevenue: number;
    totalSalaryPaid: number;
    totalNetProfit: number;
  };
}

export default function ReportsScreen() {
  const { clients, invoices, reports } = useDatabase();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    monthlyRevenue: 0,
    totalInvoices: 0,
    totalClients: 0,
    salary: { retainer: 0, commission: 0, total: 0 },
    netProfit: 0,
    monthlyTrends: [],
    topClients: [],
    allTimeSummary: {
      totalRevenue: 0,
      totalSalaryPaid: 0,
      totalNetProfit: 0,
    },
  });
  const [clientList, setClientList] = useState<Client[]>([]);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load clients and invoices
      const allClients = await clients.getAll();
      const allInvoices = await invoices.getAll();
      setClientList(allClients || []);
      setInvoiceList(allInvoices || []);

      // Load monthly overview
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthOverview = await reports.getMonthlyOverview(currentMonth);

      // Load monthly trends
      const trends = await reports.getMonthlyStats(12);

      // Load top clients
      const topClients = await reports.getTopClients(5);

      // Load all-time stats
      const allTimeStats = await reports.getAllTimeStats();

      setReportData({
        monthlyRevenue: monthOverview?.revenue || 0,
        totalInvoices: allTimeStats?.totalInvoices || 0,
        totalClients: allTimeStats?.totalClients || 0,
        salary: {
          retainer: monthOverview?.salary?.retainer || 0,
          commission: monthOverview?.salary?.commission || 0,
          total: monthOverview?.salary?.total || 0,
        },
        netProfit: monthOverview?.netProfit || 0,
        monthlyTrends: trends?.map(trend => ({
          month: trend.month || '',
          revenue: trend.revenue || 0,
          salary: trend.salary || 0,
          netProfit: trend.netProfit || 0,
        })) || [],
        topClients: topClients?.map(client => ({
          clientId: client.client_id || '',
          clientName: client.client_name || '',
          revenue: client.revenue || 0,
          percentage: client.percentage || 0,
        })) || [],
        allTimeSummary: {
          totalRevenue: allTimeStats?.totalRevenue || 0,
          totalSalaryPaid: allTimeStats?.totalSalaryPaid || 0,
          totalNetProfit: allTimeStats?.totalNetProfit || 0,
        },
      });

    } catch (error) {
      console.error('Error loading report data:', error);
      Alert.alert('Error', 'Failed to load report data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async (type: 'clients' | 'invoices' | 'reports') => {
    setIsExporting(true);
    try {
      let data: string;
      let filename: string;
      
      switch (type) {
        case 'clients':
          data = exportClientsToCSV(clientList);
          filename = `clients_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'invoices':
          data = exportInvoicesToCSV(invoiceList);
          filename = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'reports':
          data = exportReportToCSV(reportData);
          filename = `business_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }
      
      downloadCSV(data, filename);
      Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const data = generatePDFReport(reportData);
      const filename = `business_report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      downloadPDF(data, filename);
      Alert.alert('Success', 'PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareReport = async () => {
    setIsExporting(true);
    try {
      const data = generatePDFReport(reportData);
      const filename = `business_report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      shareData(data, filename, 'pdf');
      Alert.alert('Success', 'Report shared successfully!');
    } catch (error) {
      console.error('Error sharing report:', error);
      Alert.alert('Error', 'Failed to share report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

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
          <Text style={styles.mainTitle}>Reports</Text>
          <Text style={styles.subtitle}>Analytics and insights</Text>
        </View>

        <View style={styles.spacer} />

        {/* Export Card */}
        <View style={styles.exportCard}>
          <View style={styles.exportContent}>
            <View>
              <Text style={styles.exportTitle}>Export Reports</Text>
              <Text style={styles.exportSubtitle}>Download PDF or CSV reports</Text>
            </View>
            <View style={styles.exportButtons}>
              <Button 
                title="PDF" 
                variant="primary" 
                size="sm" 
                onPress={handleExportPDF}
                disabled={isExporting}
              />
              <Button 
                title="Share" 
                variant="secondary" 
                size="sm" 
                onPress={handleShareReport}
                disabled={isExporting}
              />
            </View>
          </View>
          
          <View style={styles.csvExportSection}>
            <Text style={styles.csvTitle}>Export Data as CSV</Text>
            <View style={styles.csvButtons}>
              <Button 
                title="Clients" 
                variant="outline" 
                size="sm" 
                onPress={() => handleExportCSV('clients')}
                disabled={isExporting}
              />
              <Button 
                title="Invoices" 
                variant="outline" 
                size="sm" 
                onPress={() => handleExportCSV('invoices')}
                disabled={isExporting}
              />
              <Button 
                title="Reports" 
                variant="outline" 
                size="sm" 
                onPress={() => handleExportCSV('reports')}
                disabled={isExporting}
              />
            </View>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* Business Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Revenue"
            value={reportData.monthlyRevenue}
            subtitle="Total this month"
            icon="house.fill"
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Net Profit"
            value={reportData.netProfit}
            subtitle="After salary"
            icon="chevron.right"
            variant="success"
            style={styles.statCard}
          />
        </View>

        <View style={styles.spacer} />

        {/* Salary Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Salary Breakdown</Text>
        </View>

        <View style={styles.salaryCard}>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryLabel}>Retainer:</Text>
            <Text style={styles.salaryValue}>₹{reportData.salary.retainer.toLocaleString()}</Text>
          </View>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryLabel}>Commission:</Text>
            <Text style={styles.salaryValue}>₹{reportData.salary.commission.toLocaleString()}</Text>
          </View>
          <View style={[styles.salaryRow, styles.totalSalaryRow]}>
            <Text style={styles.totalSalaryLabel}>Total Salary:</Text>
            <Text style={styles.totalSalaryValue}>₹{reportData.salary.total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* Top Performing Clients */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Performing Clients</Text>
        </View>

        <View style={styles.performanceCard}>
          {reportData.topClients.map((client, index) => (
            <View key={client.clientId || index} style={styles.clientRow}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.clientName}</Text>
                <Text style={styles.clientRevenue}>₹{client.revenue.toLocaleString()}</Text>
              </View>
              <Text style={styles.clientPercentage}>{client.percentage.toFixed(1)}%</Text>
            </View>
          ))}
          {reportData.topClients.length === 0 && (
            <Text style={styles.emptyText}>No client data available</Text>
          )}
        </View>

        <View style={styles.spacer} />

        {/* Monthly Trend Chart */}
        {reportData.monthlyTrends.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Monthly Trends</Text>
            </View>

            <View style={styles.chartCard}>
              <LineChart
                data={{
                  labels: reportData.monthlyTrends.map(trend => trend.month.slice(-2)),
                  datasets: [
                    {
                      data: reportData.monthlyTrends.map(trend => trend.revenue / 1000),
                      color: () => '#2563eb',
                      strokeWidth: 2,
                    },
                    {
                      data: reportData.monthlyTrends.map(trend => trend.salary / 1000),
                      color: () => '#059669',
                      strokeWidth: 2,
                    },
                    {
                      data: reportData.monthlyTrends.map(trend => trend.netProfit / 1000),
                      color: () => '#dc2626',
                      strokeWidth: 2,
                    },
                  ],
                  legend: ['Revenue', 'Salary', 'Net Profit'],
                }}
                width={Dimensions.get('window').width - 32}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                  },
                  formatYLabel: (value) => `${value}k`,
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2563eb' }]} />
                  <Text style={styles.legendText}>Revenue</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
                  <Text style={styles.legendText}>Salary</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
                  <Text style={styles.legendText}>Net Profit</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>No trend data available</Text>
        )}

        <View style={styles.spacer} />

        {/* All-time Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All-time Summary</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Revenue:</Text>
            <Text style={styles.summaryValue}>₹{reportData.allTimeSummary.totalRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Salary Paid:</Text>
            <Text style={styles.summaryValue}>₹{reportData.allTimeSummary.totalSalaryPaid.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Net Profit:</Text>
            <Text style={styles.summaryValue}>₹{reportData.allTimeSummary.totalNetProfit.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.largeSpacer} />
      </ScrollView>
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
  largeSpacer: {
    height: 32,
  },
  exportCard: {
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
  exportContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  exportSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  csvExportSection: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  csvTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  csvButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  salaryCard: {
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
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  salaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  salaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalSalaryRow: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 8,
    paddingTop: 12,
  },
  totalSalaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalSalaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  performanceCard: {
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
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  clientRevenue: {
    fontSize: 12,
    color: '#6b7280',
  },
  clientPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  chartCard: {
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
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    padding: 16,
  },
}); 