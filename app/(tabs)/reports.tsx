import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, StatCard } from '../../components';
import { useData } from '../../context/DataContext';
import {
  downloadCSV,
  downloadPDF,
  exportClientsToCSV,
  exportInvoicesToCSV,
  exportReportToCSV,
  generatePDFReport,
  shareData
} from '../../utils/exportUtils';

export default function ReportsScreen() {
  const { 
    reportData, 
    clients, 
    filteredInvoices 
  } = useData();
  
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async (type: 'clients' | 'invoices' | 'reports') => {
    setIsExporting(true);
    try {
      let data: string;
      let filename: string;
      
      switch (type) {
        case 'clients':
          data = exportClientsToCSV(clients);
          filename = `clients_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'invoices':
          data = exportInvoicesToCSV(filteredInvoices);
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
      Alert.alert('Error', 'Failed to share report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

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

        {/* Monthly Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Revenue"
            value={reportData.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0)}
            subtitle="Total this year"
            icon="house.fill"
            trend={{ value: 12, isPositive: true }}
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            title="Expenses"
            value={reportData.monthlyRevenue.reduce((sum, month) => sum + month.expenses, 0)}
            subtitle="Total this year"
            icon="chevron.right"
            trend={{ value: 5, isPositive: false }}
            variant="warning"
            style={styles.statCard}
          />
        </View>

        <View style={styles.spacer} />

        {/* Top Performing Clients */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Performing Clients</Text>
        </View>

        <View style={styles.performanceCard}>
          {reportData.topClients.map((client, index) => (
            <View key={client.clientId} style={styles.clientRow}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.clientName}</Text>
                <Text style={styles.clientRevenue}>${client.revenue.toLocaleString()}</Text>
              </View>
              <Text style={styles.clientPercentage}>{client.percentage}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        {/* Payment Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Status</Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <View style={[styles.statusDot, { backgroundColor: '#059669' }]} />
              <Text style={styles.statusLabel}>Paid</Text>
            </View>
            <Text style={styles.statusValue}>
              ${reportData.paymentStatus.paid.amount.toLocaleString()} ({reportData.paymentStatus.paid.percentage}%)
            </Text>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <View style={[styles.statusDot, { backgroundColor: '#d97706' }]} />
              <Text style={styles.statusLabel}>Pending</Text>
            </View>
            <Text style={styles.statusValue}>
              ${reportData.paymentStatus.pending.amount.toLocaleString()} ({reportData.paymentStatus.pending.percentage}%)
            </Text>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <View style={[styles.statusDot, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.statusLabel}>Overdue</Text>
            </View>
            <Text style={styles.statusValue}>
              ${reportData.paymentStatus.overdue.amount.toLocaleString()} ({reportData.paymentStatus.overdue.percentage}%)
            </Text>
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
  statusCard: {
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
}); 