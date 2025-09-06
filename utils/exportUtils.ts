import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Client, Invoice } from '../database/models';
import { formatCurrency } from './calculationUtils';

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

// Generate HTML content for PDF
export const generateHTMLContent = (reportData: ReportData): string => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>EagerInvoice Business Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #6b7280; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .table th { background-color: #3b82f6; color: white; padding: 10px; text-align: left; font-weight: bold; }
        .table td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
        .table tr:nth-child(even) { background-color: #f9fafb; }
        .highlight { font-weight: bold; color: #059669; }
        .client-list { list-style: none; padding: 0; }
        .client-item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .trend-item { margin-bottom: 10px; padding: 10px; background-color: #f9fafb; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">EAGERINVOICE - BUSINESS REPORT</div>
        <div class="subtitle">Generated on: ${new Date().toLocaleDateString()}</div>
      </div>

      <div class="section">
        <div class="section-title">CURRENT MONTH OVERVIEW</div>
        <table class="table">
          <tr>
            <th>Metric</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>Revenue</td>
            <td class="highlight">${formatCurrency(reportData.monthlyRevenue)}</td>
          </tr>
          <tr>
            <td>Salary (Total)</td>
            <td>${formatCurrency(reportData.salary.total)}</td>
          </tr>
          <tr>
            <td>Salary (Retainer)</td>
            <td>${formatCurrency(reportData.salary.retainer)}</td>
          </tr>
          <tr>
            <td>Salary (Commission)</td>
            <td>${formatCurrency(reportData.salary.commission)}</td>
          </tr>
          <tr>
            <td>Net Profit</td>
            <td class="highlight">${formatCurrency(reportData.netProfit)}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">ALL-TIME SUMMARY</div>
        <table class="table">
          <tr>
            <th>Metric</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>Total Revenue</td>
            <td class="highlight">${formatCurrency(reportData.allTimeSummary.totalRevenue)}</td>
          </tr>
          <tr>
            <td>Total Salary Paid</td>
            <td>${formatCurrency(reportData.allTimeSummary.totalSalaryPaid)}</td>
          </tr>
          <tr>
            <td>Total Net Profit</td>
            <td class="highlight">${formatCurrency(reportData.allTimeSummary.totalNetProfit)}</td>
          </tr>
          <tr>
            <td>Total Invoices</td>
            <td>${reportData.totalInvoices}</td>
          </tr>
          <tr>
            <td>Total Clients</td>
            <td>${reportData.totalClients}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">TOP PERFORMING CLIENTS</div>
        ${reportData.topClients.length > 0 ? `
          <table class="table">
            <tr>
              <th>Rank</th>
              <th>Client Name</th>
              <th>Revenue</th>
            </tr>
            ${reportData.topClients.map((client, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${client.clientName}</td>
                <td class="highlight">${formatCurrency(client.revenue)} (${client.percentage.toFixed(1)}%)</td>
              </tr>
            `).join('')}
          </table>
        ` : '<p style="color: #6b7280; font-style: italic;">No client data available</p>'}
      </div>

      <div class="section">
        <div class="section-title">MONTHLY TRENDS</div>
        ${reportData.monthlyTrends.length > 0 ? 
          reportData.monthlyTrends.map(trend => `
            <div class="trend-item">
              <strong>${trend.month}:</strong><br>
              Revenue: ${formatCurrency(trend.revenue)} | 
              Salary: ${formatCurrency(trend.salary)} | 
              Net Profit: ${formatCurrency(trend.netProfit)}
            </div>
          `).join('') : 
          '<p style="color: #6b7280; font-style: italic;">No trend data available</p>'
        }
      </div>
    </body>
    </html>
  `;
  
  return html;
};

// Generate formatted report content (for text file fallback)
export const generateReportContent = (reportData: ReportData): string => {
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

// Real PDF download with sharing
export const downloadPDF = async (reportData: ReportData, filename: string): Promise<string> => {
  try {
    // Generate PDF using expo-print
    const htmlContent = generateHTMLContent(reportData);
    
    // Generate PDF as base64
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false
    });
    
    console.log('PDF generated successfully:', uri);
    
    // Try to share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Business Report'
      });
    }
    
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Fallback to text file if PDF generation fails
    try {
      const reportContent = generateReportContent(reportData);
      const safeFilename = filename.replace('.pdf', '.txt');
      const fileUri = `${FileSystem.documentDirectory}${safeFilename}`;

      // Write report content to file
      await FileSystem.writeAsStringAsync(fileUri, reportContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log('Text report saved to', fileUri);

      // Try to share/open the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Share Business Report'
        });
      }

      return fileUri;
    } catch (textError) {
      console.error('Error saving text report:', textError);
      throw textError;
    }
  }
};

// Data Download Functions (kept for backward compatibility)
export const downloadCSV = (data: string, filename: string) => {
  // In a real app, you would use react-native-fs or similar
  console.log(`Downloading ${filename}:`);
  console.log(data);
};

// Share Functions (kept for backward compatibility)
export const shareData = (data: string, filename: string, type: 'csv' | 'pdf') => {
  // In a real app, you would use react-native-share
  console.log(`Sharing ${filename} (${type}):`);
  console.log(data);
}; 