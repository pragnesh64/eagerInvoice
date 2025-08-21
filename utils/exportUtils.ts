import { Client, Invoice } from '../database/models';

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

// CSV Export Functions
export const exportClientsToCSV = (clients: Client[]): string => {
  const headers = [
    'ID',
    'Name',
    'Type',
    'Start Date',
    'Notes',
  ];

  const rows = clients.map(client => [
    client.id,
    client.name,
    client.type,
    client.startDate,
    client.notes || '',
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

export const exportInvoicesToCSV = (invoices: Invoice[]): string => {
  const headers = [
    'Invoice Number',
    'Client Name',
    'Amount',
    'Date',
  ];

  const rows = invoices.map(invoice => [
    invoice.invoiceNo,
    invoice.clientName,
    invoice.amount.toString(),
    invoice.date,
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

export const exportReportToCSV = (reportData: ReportData): string => {
  const headers = [
    'Report Type',
    'Value',
    'Details',
  ];

  const rows = [
    // Current Month Summary
    ['Monthly Revenue', reportData.monthlyRevenue.toString(), 'Current month total revenue'],
    ['Monthly Salary', reportData.salary.total.toString(), `Retainer: ${reportData.salary.retainer}, Commission: ${reportData.salary.commission}`],
    ['Monthly Net Profit', reportData.netProfit.toString(), 'Revenue - Salary'],

    // All-time Summary
    ['Total Revenue', reportData.allTimeSummary.totalRevenue.toString(), 'All-time total revenue'],
    ['Total Salary Paid', reportData.allTimeSummary.totalSalaryPaid.toString(), 'All-time total salary'],
    ['Total Net Profit', reportData.allTimeSummary.totalNetProfit.toString(), 'All-time net profit'],
    ['Total Invoices', reportData.totalInvoices.toString(), 'Total number of invoices'],
    ['Total Clients', reportData.totalClients.toString(), 'Total number of clients'],

    // Top Clients
    ...reportData.topClients.map((client, index) => 
      [`Top Client ${index + 1}`, client.clientName, `Revenue: ${client.revenue} (${client.percentage.toFixed(1)}%)`]
    ),
  ];

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

// PDF Report Generation
export const generatePDFReport = (reportData: ReportData): string => {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  
  let report = 'EAGERINVOICE - BUSINESS REPORT\n';
  report += 'Generated on: ' + new Date().toLocaleDateString() + '\n\n';
  
  // Current Month Overview
  report += 'CURRENT MONTH OVERVIEW\n';
  report += '=====================\n';
  report += `Revenue: ${formatCurrency(reportData.monthlyRevenue)}\n`;
  report += `Salary: ${formatCurrency(reportData.salary.total)} (Retainer: ${formatCurrency(reportData.salary.retainer)}, Commission: ${formatCurrency(reportData.salary.commission)})\n`;
  report += `Net Profit: ${formatCurrency(reportData.netProfit)}\n\n`;
  
  // All-time Summary
  report += 'ALL-TIME SUMMARY\n';
  report += '===============\n';
  report += `Total Revenue: ${formatCurrency(reportData.allTimeSummary.totalRevenue)}\n`;
  report += `Total Salary Paid: ${formatCurrency(reportData.allTimeSummary.totalSalaryPaid)}\n`;
  report += `Total Net Profit: ${formatCurrency(reportData.allTimeSummary.totalNetProfit)}\n`;
  report += `Total Invoices: ${reportData.totalInvoices}\n`;
  report += `Total Clients: ${reportData.totalClients}\n\n`;
  
  // Monthly Trends
  report += 'MONTHLY TRENDS\n';
  report += '==============\n';
  reportData.monthlyTrends.forEach(trend => {
    report += `${trend.month}:\n`;
    report += `  Revenue: ${formatCurrency(trend.revenue)}\n`;
    report += `  Salary: ${formatCurrency(trend.salary)}\n`;
    report += `  Net Profit: ${formatCurrency(trend.netProfit)}\n`;
  });
  report += '\n';
  
  // Top Clients
  report += 'TOP PERFORMING CLIENTS\n';
  report += '=====================\n';
  reportData.topClients.forEach((client, index) => {
    report += `${index + 1}. ${client.clientName}: ${formatCurrency(client.revenue)} (${client.percentage.toFixed(1)}%)\n`;
  });
  
  return report;
};

// Data Download Functions
export const downloadCSV = (data: string, filename: string) => {
  // In a real app, you would use react-native-fs or similar
  console.log(`Downloading ${filename}:`);
  console.log(data);
};

export const downloadPDF = (data: string, filename: string) => {
  // In a real app, you would use react-native-pdf or similar
  console.log(`Downloading ${filename}:`);
  console.log(data);
};

// Share Functions
export const shareData = (data: string, filename: string, type: 'csv' | 'pdf') => {
  // In a real app, you would use react-native-share
  console.log(`Sharing ${filename} (${type}):`);
  console.log(data);
}; 