/**
 * Monthly Data Management Utilities for EagerInvoice
 * Handles month filtering, calculations, and data aggregation
 */

import { InvoiceService } from '../database/services';
import { calculateSalary, paiseToRupees } from './calculationUtils';

export interface MonthlyData {
  month: string; // YYYY-MM format
  monthName: string; // "January 2025"
  revenue: number; // in paise
  invoiceCount: number;
  salary: {
    retainer: number; // in paise
    commission: number; // in paise
    total: number; // in paise
  };
  netProfit: number; // in paise
  topClients: Array<{
    clientId: string;
    clientName: string;
    revenue: number; // in paise
    percentage: number;
  }>;
}

export interface MonthOption {
  value: string; // YYYY-MM
  label: string; // "January 2025"
  shortLabel: string; // "Jan 2025"
}

/**
 * Generate month options for the last N months including future months
 */
export const generateMonthOptions = (pastMonths: number = 12, futureMonths: number = 6): MonthOption[] => {
  const options: MonthOption[] = [];
  const now = new Date();
  
  // Generate past months
  for (let i = pastMonths; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthValue = date.toISOString().slice(0, 7); // YYYY-MM
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const shortLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    options.push({
      value: monthValue,
      label: monthName,
      shortLabel
    });
  }
  
  // Generate future months
  for (let i = 1; i <= futureMonths; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthValue = date.toISOString().slice(0, 7); // YYYY-MM
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const shortLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    options.push({
      value: monthValue,
      label: monthName,
      shortLabel
    });
  }
  
  return options;
};

/**
 * Get current month in YYYY-MM format
 */
export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

/**
 * Get month name from YYYY-MM format
 */
export const getMonthName = (monthValue: string): string => {
  const [year, month] = monthValue.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Get invoices for a specific month
 */
export const getInvoicesForMonth = async (month: string): Promise<any[]> => {
  try {
    console.log(`📅 Getting invoices for month: ${month}`);
    
    // Get all invoices and filter by month
    const allInvoices = await InvoiceService.getAll();
    const monthInvoices = allInvoices.filter(invoice => {
      const invoiceMonth = new Date(invoice.date).toISOString().slice(0, 7);
      return invoiceMonth === month;
    });
    
    console.log(`📊 Found ${monthInvoices.length} invoices for ${month}`);
    return monthInvoices;
  } catch (error) {
    console.error('Error getting invoices for month:', error);
    return [];
  }
};

/**
 * Calculate monthly data for a specific month
 */
export const calculateMonthlyData = async (month: string): Promise<MonthlyData> => {
  try {
    console.log(`🧮 Calculating monthly data for: ${month}`);
    
    // Get invoices for the month
    const monthInvoices = await getInvoicesForMonth(month);
    
    // Calculate total revenue
    const revenue = monthInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
    
    // Calculate salary using centralized logic
    const salaryBreakdown = calculateSalary(revenue);
    
    // Calculate net profit
    const netProfit = revenue - salaryBreakdown.total;
    
    // Calculate top clients for the month
    const clientRevenue = new Map<string, { name: string; revenue: number }>();
    
    monthInvoices.forEach(invoice => {
      const clientId = invoice.client_id || invoice.clientId;
      const clientName = invoice.client_name || invoice.clientName || 'Unknown Client';
      const amount = invoice.amount || 0;
      
      if (clientRevenue.has(clientId)) {
        clientRevenue.get(clientId)!.revenue += amount;
      } else {
        clientRevenue.set(clientId, { name: clientName, revenue: amount });
      }
    });
    
    const topClients = Array.from(clientRevenue.entries())
      .map(([clientId, data]) => ({
        clientId,
        clientName: data.name,
        revenue: data.revenue,
        percentage: revenue > 0 ? (data.revenue / revenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 clients
    
    const monthlyData: MonthlyData = {
      month,
      monthName: getMonthName(month),
      revenue,
      invoiceCount: monthInvoices.length,
      salary: salaryBreakdown,
      netProfit,
      topClients
    };
    
    console.log(`✅ Monthly data calculated:`, {
      month,
      revenue: paiseToRupees(revenue),
      invoiceCount: monthInvoices.length,
      salary: paiseToRupees(salaryBreakdown.total),
      netProfit: paiseToRupees(netProfit)
    });
    
    return monthlyData;
  } catch (error) {
    console.error('Error calculating monthly data:', error);
    
    // Return empty data structure on error
    return {
      month,
      monthName: getMonthName(month),
      revenue: 0,
      invoiceCount: 0,
      salary: { retainer: 0, commission: 0, total: 0 },
      netProfit: 0,
      topClients: []
    };
  }
};

/**
 * Get monthly data for multiple months (for trends/charts)
 */
export const getMonthlyTrends = async (months: string[]): Promise<MonthlyData[]> => {
  try {
    console.log(`📈 Getting monthly trends for ${months.length} months`);
    
    const trends = await Promise.all(
      months.map(month => calculateMonthlyData(month))
    );
    
    return trends.sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    console.error('Error getting monthly trends:', error);
    return [];
  }
};

/**
 * Get year-over-year comparison
 */
export const getYearOverYearData = async (currentMonth: string): Promise<{
  currentYear: MonthlyData;
  previousYear: MonthlyData;
  growth: {
    revenue: number; // percentage
    profit: number; // percentage
    invoices: number; // percentage
  };
}> => {
  try {
    const [year, month] = currentMonth.split('-');
    const previousYearMonth = `${parseInt(year) - 1}-${month}`;
    
    const [currentData, previousData] = await Promise.all([
      calculateMonthlyData(currentMonth),
      calculateMonthlyData(previousYearMonth)
    ]);
    
    const growth = {
      revenue: previousData.revenue > 0 ? 
        ((currentData.revenue - previousData.revenue) / previousData.revenue) * 100 : 0,
      profit: previousData.netProfit > 0 ? 
        ((currentData.netProfit - previousData.netProfit) / previousData.netProfit) * 100 : 0,
      invoices: previousData.invoiceCount > 0 ? 
        ((currentData.invoiceCount - previousData.invoiceCount) / previousData.invoiceCount) * 100 : 0
    };
    
    return {
      currentYear: currentData,
      previousYear: previousData,
      growth
    };
  } catch (error) {
    console.error('Error getting year-over-year data:', error);
    throw error;
  }
};

/**
 * Pre-calculate and cache monthly summaries (for performance)
 */
export const precalculateMonthlyCache = async (months: string[]): Promise<Map<string, MonthlyData>> => {
  console.log(`🔄 Pre-calculating monthly cache for ${months.length} months`);
  
  const cache = new Map<string, MonthlyData>();
  
  try {
    const monthlyData = await Promise.all(
      months.map(month => calculateMonthlyData(month))
    );
    
    monthlyData.forEach(data => {
      cache.set(data.month, data);
    });
    
    console.log(`✅ Monthly cache ready for ${cache.size} months`);
  } catch (error) {
    console.error('Error pre-calculating monthly cache:', error);
  }
  
  return cache;
};

/**
 * Export monthly data for reports
 */
export const exportMonthlyData = (monthlyData: MonthlyData): {
  csv: string;
  summary: string;
} => {
  const csv = [
    'Metric,Value',
    `Month,${monthlyData.monthName}`,
    `Revenue,₹${paiseToRupees(monthlyData.revenue).toLocaleString()}`,
    `Invoice Count,${monthlyData.invoiceCount}`,
    `Retainer,₹${paiseToRupees(monthlyData.salary.retainer).toLocaleString()}`,
    `Commission,₹${paiseToRupees(monthlyData.salary.commission).toLocaleString()}`,
    `Total Salary,₹${paiseToRupees(monthlyData.salary.total).toLocaleString()}`,
    `Net Profit,₹${paiseToRupees(monthlyData.netProfit).toLocaleString()}`,
    '',
    'Top Clients',
    'Client,Revenue,Percentage',
    ...monthlyData.topClients.map(client => 
      `${client.clientName},₹${paiseToRupees(client.revenue).toLocaleString()},${client.percentage.toFixed(1)}%`
    )
  ].join('\n');
  
  const summary = `
${monthlyData.monthName} Summary
=====================================
💰 Revenue: ₹${paiseToRupees(monthlyData.revenue).toLocaleString()}
📄 Invoices: ${monthlyData.invoiceCount}
👤 Salary: ₹${paiseToRupees(monthlyData.salary.total).toLocaleString()}
📈 Net Profit: ₹${paiseToRupees(monthlyData.netProfit).toLocaleString()}

Top Clients:
${monthlyData.topClients.map((client, i) => 
  `${i + 1}. ${client.clientName}: ₹${paiseToRupees(client.revenue).toLocaleString()} (${client.percentage.toFixed(1)}%)`
).join('\n')}
  `.trim();
  
  return { csv, summary };
};

export default {
  generateMonthOptions,
  getCurrentMonth,
  getMonthName,
  calculateMonthlyData,
  getMonthlyTrends,
  getYearOverYearData,
  precalculateMonthlyCache,
  exportMonthlyData
};
