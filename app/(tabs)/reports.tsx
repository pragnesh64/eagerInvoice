import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, StatCard } from '../../components';
import { Colors } from '../../constants/Colors';
import { useDatabase } from '../../context/DatabaseContext';
import { downloadPDF } from '../../utils/exportUtils';

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


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load clients and invoices for report data
      const allClients = await clients.getAll();
      const allInvoices = await invoices.getAll();

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
          clientId: client.clientId || '',
          clientName: client.clientName || '',
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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const filename = `business_report_${new Date().toISOString().split('T')[0]}.pdf`;
      await downloadPDF(reportData, filename);
      Alert.alert('Success', `Report saved and shared successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../../assets/images/bgimage.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={20} tint="light" style={styles.blurOverlay} />
        <View style={styles.darkOverlay} />
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/bgimage.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <BlurView intensity={20} tint="light" style={styles.blurOverlay} />
      <View style={styles.darkOverlay} />
      <View style={styles.container}>
        <StatusBar style="light" />

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
                <Text style={styles.exportSubtitle}>Download PDF report</Text>
              </View>
              <View style={styles.exportButtons}>
                <Button 
                  title="Download PDF" 
                  variant="primary" 
                  size="sm" 
                  onPress={handleExportPDF}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.textMuted,
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
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  spacer: {
    height: 16,
  },
  largeSpacer: {
    height: 32,
  },
  exportCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
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
    color: Colors.dark.text,
    marginBottom: 2,
  },
  exportSubtitle: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  csvExportSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.borderLight,
    paddingTop: 16,
  },
  csvTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
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
    color: Colors.dark.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  salaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
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
    color: Colors.dark.textSecondary,
  },
  salaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  totalSalaryRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.borderLight,
    marginTop: 8,
    paddingTop: 12,
  },
  totalSalaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  totalSalaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.success,
  },
  performanceCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
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
    color: Colors.dark.text,
    marginBottom: 2,
  },
  clientRevenue: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  clientPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.primaryDark,
  },
  summaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
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
    color: Colors.dark.text,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  chartCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
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
    color: Colors.dark.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.dark.textSecondary,
    fontSize: 14,
    padding: 16,
  },
}); 