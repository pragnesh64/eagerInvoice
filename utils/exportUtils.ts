import { Client, Invoice, ReportData } from '../data/dummyData';

// CSV Export Functions
export const exportClientsToCSV = (clients: Client[]): string => {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Type',
    'Status',
    'Total Revenue',
    'Invoice Count',
    'Last Invoice Date',
    'Created At',
  ];

  const rows = clients.map(client => [
    client.id,
    client.name,
    client.email,
    client.phone || '',
    client.type,
    client.status,
    client.totalRevenue.toString(),
    client.invoiceCount.toString(),
    client.lastInvoiceDate || '',
    client.createdAt,
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
    'Tax',
    'Total Amount',
    'Issue Date',
    'Due Date',
    'Status',
    'Description',
    'Created At',
  ];

  const rows = invoices.map(invoice => [
    invoice.invoiceNumber,
    invoice.clientName,
    invoice.amount.toString(),
    invoice.tax.toString(),
    invoice.totalAmount.toString(),
    invoice.issueDate,
    invoice.dueDate,
    invoice.status,
    invoice.description,
    invoice.createdAt,
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
    ['Monthly Revenue', 'Total', reportData.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0).toString()],
    ['Monthly Expenses', 'Total', reportData.monthlyRevenue.reduce((sum, month) => sum + month.expenses, 0).toString()],
    ['Monthly Profit', 'Total', reportData.monthlyRevenue.reduce((sum, month) => sum + month.profit, 0).toString()],
    ['Top Client', reportData.topClients[0]?.clientName || '', reportData.topClients[0]?.revenue.toString() || ''],
    ['Paid Invoices', 'Amount', reportData.paymentStatus.paid.amount.toString()],
    ['Pending Invoices', 'Amount', reportData.paymentStatus.pending.amount.toString()],
    ['Overdue Invoices', 'Amount', reportData.paymentStatus.overdue.amount.toString()],
    ['Total Invoices', 'Count', reportData.invoiceStats.total.toString()],
    ['Outstanding Amount', 'Total', reportData.invoiceStats.outstanding.toString()],
  ];

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

// PDF Report Generation (Text-based for now, can be enhanced with react-native-pdf)
export const generatePDFReport = (reportData: ReportData): string => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  
  let report = 'EAGERINVOICE - BUSINESS REPORT\n';
  report += 'Generated on: ' + new Date().toLocaleDateString() + '\n\n';
  
  // Monthly Overview
  report += 'MONTHLY OVERVIEW\n';
  report += '================\n';
  reportData.monthlyRevenue.forEach(month => {
    report += `${month.month}: Revenue ${formatCurrency(month.revenue)}, Expenses ${formatCurrency(month.expenses)}, Profit ${formatCurrency(month.profit)}\n`;
  });
  report += '\n';
  
  // Top Clients
  report += 'TOP PERFORMING CLIENTS\n';
  report += '=====================\n';
  reportData.topClients.forEach((client, index) => {
    report += `${index + 1}. ${client.clientName}: ${formatCurrency(client.revenue)} (${client.percentage}%)\n`;
  });
  report += '\n';
  
  // Payment Status
  report += 'PAYMENT STATUS\n';
  report += '==============\n';
  report += `Paid: ${formatCurrency(reportData.paymentStatus.paid.amount)} (${reportData.paymentStatus.paid.percentage}%)\n`;
  report += `Pending: ${formatCurrency(reportData.paymentStatus.pending.amount)} (${reportData.paymentStatus.pending.percentage}%)\n`;
  report += `Overdue: ${formatCurrency(reportData.paymentStatus.overdue.amount)} (${reportData.paymentStatus.overdue.percentage}%)\n`;
  report += '\n';
  
  // Invoice Statistics
  report += 'INVOICE STATISTICS\n';
  report += '==================\n';
  report += `Total Invoices: ${reportData.invoiceStats.total}\n`;
  report += `This Month: ${reportData.invoiceStats.thisMonth}\n`;
  report += `This Year: ${reportData.invoiceStats.thisYear}\n`;
  report += `Outstanding: ${formatCurrency(reportData.invoiceStats.outstanding)}\n`;
  
  return report;
};

// Data Download Functions
export const downloadCSV = (data: string, filename: string) => {
  // In a real app, you would use react-native-fs or similar
  // For now, we'll just log the data
  console.log(`Downloading ${filename}:`);
  console.log(data);
  
  // You can implement actual file download using:
  // - react-native-fs for file system operations
  // - react-native-share for sharing files
  // - react-native-blob-util for blob handling
};

export const downloadPDF = (data: string, filename: string) => {
  // In a real app, you would use react-native-pdf or similar
  console.log(`Downloading ${filename}:`);
  console.log(data);
};

// Email Export Functions
export const emailCSV = (data: string, filename: string) => {
  // In a real app, you would use react-native-mail or similar
  console.log(`Emailing ${filename}:`);
  console.log(data);
};

export const emailPDF = (data: string, filename: string) => {
  // In a real app, you would use react-native-mail or similar
  console.log(`Emailing ${filename}:`);
  console.log(data);
};

// Share Functions
export const shareData = (data: string, filename: string, type: 'csv' | 'pdf') => {
  // In a real app, you would use react-native-share
  console.log(`Sharing ${filename} (${type}):`);
  console.log(data);
}; 