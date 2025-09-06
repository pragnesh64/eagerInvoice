/**
 * Centralized calculation utilities for EagerInvoice
 * Ensures consistent calculations across the entire application
 */

// Currency conversion constants and functions
export const PAISE_PER_RUPEE = 100;

/**
 * Convert rupees to paise for database storage
 * @param rupees - Amount in rupees
 * @returns Amount in paise (rounded to avoid floating point issues)
 */
export const rupeesToPaise = (rupees: number): number => {
  if (typeof rupees !== 'number' || isNaN(rupees)) {
    throw new Error('Invalid rupees value');
  }
  return Math.round(rupees * PAISE_PER_RUPEE);
};

/**
 * Convert paise to rupees for display
 * @param paise - Amount in paise
 * @returns Amount in rupees
 */
export const paiseToRupees = (paise: number): number => {
  if (typeof paise !== 'number' || isNaN(paise)) {
    throw new Error('Invalid paise value');
  }
  return paise / PAISE_PER_RUPEE;
};

/**
 * Salary calculation constants
 */
export const SALARY_CONFIG = {
  RETAINER_RUPEES: 15000,
  MAX_SALARY_RUPEES: 60000,
  COMMISSION_TIERS: [
    { maxRevenue: 50000, rate: 0.10 },    // 10% up to ₹50,000
    { maxRevenue: 100000, rate: 0.15 },   // 15% from ₹50,000 to ₹100,000
    { maxRevenue: Infinity, rate: 0.20 }  // 20% above ₹100,000
  ]
};

/**
 * Calculate commission based on monthly revenue
 * @param monthlyRevenueInPaise - Monthly revenue in paise
 * @returns Commission in paise
 */
export const calculateCommission = (monthlyRevenueInPaise: number): number => {
  if (typeof monthlyRevenueInPaise !== 'number' || isNaN(monthlyRevenueInPaise) || monthlyRevenueInPaise < 0) {
    return 0;
  }

  const revenueInRupees = paiseToRupees(monthlyRevenueInPaise);
  let commission = 0;
  let processedRevenue = 0;

  // Process each tier sequentially
  for (const tier of SALARY_CONFIG.COMMISSION_TIERS) {
    if (revenueInRupees <= processedRevenue) break;

    // Calculate the revenue amount for this tier
    const tierMaxRevenue = tier.maxRevenue === Infinity ? revenueInRupees : tier.maxRevenue;
    const tierRevenue = Math.min(revenueInRupees - processedRevenue, tierMaxRevenue - processedRevenue);
    
    if (tierRevenue > 0) {
      commission += tierRevenue * tier.rate;
      processedRevenue += tierRevenue;
    }
  }

  return rupeesToPaise(commission);
};

/**
 * Calculate complete salary breakdown
 * @param monthlyRevenueInPaise - Monthly revenue in paise
 * @returns Salary breakdown in paise
 */
export interface SalaryBreakdown {
  retainer: number;
  commission: number;
  total: number;
  revenueUsed: number;
}

export const calculateSalary = (monthlyRevenueInPaise: number): SalaryBreakdown => {
  if (typeof monthlyRevenueInPaise !== 'number' || isNaN(monthlyRevenueInPaise)) {
    monthlyRevenueInPaise = 0;
  }

  const retainer = rupeesToPaise(SALARY_CONFIG.RETAINER_RUPEES);
  const commission = calculateCommission(monthlyRevenueInPaise);
  const uncappedTotal = retainer + commission;
  const maxSalary = rupeesToPaise(SALARY_CONFIG.MAX_SALARY_RUPEES);
  const total = Math.min(uncappedTotal, maxSalary);

  return {
    retainer,
    commission,
    total,
    revenueUsed: monthlyRevenueInPaise
  };
};

/**
 * Calculate net profit
 * @param revenueInPaise - Revenue in paise
 * @param salaryInPaise - Salary in paise
 * @returns Net profit in paise
 */
export const calculateNetProfit = (revenueInPaise: number, salaryInPaise: number): number => {
  if (typeof revenueInPaise !== 'number' || isNaN(revenueInPaise)) {
    revenueInPaise = 0;
  }
  if (typeof salaryInPaise !== 'number' || isNaN(salaryInPaise)) {
    salaryInPaise = 0;
  }
  return revenueInPaise - salaryInPaise;
};

/**
 * Validate and sanitize numeric input
 * @param value - Input value (string or number)
 * @param allowNegative - Whether to allow negative values
 * @returns Sanitized number or null if invalid
 */
export const sanitizeNumericInput = (value: string | number, allowNegative: boolean = false): number | null => {
  if (typeof value === 'string') {
    value = value.trim();
    if (value === '') return null;
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (!allowNegative && num < 0) {
    return null;
  }

  // Round to 2 decimal places to avoid floating point issues
  return Math.round(num * 100) / 100;
};

/**
 * Format currency for display
 * @param amountInPaise - Amount in paise
 * @param includeCurrencySymbol - Whether to include ₹ symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (amountInPaise: number, includeCurrencySymbol: boolean = true): string => {
  if (typeof amountInPaise !== 'number' || isNaN(amountInPaise)) {
    return includeCurrencySymbol ? '₹0.00' : '0.00';
  }

  const rupees = paiseToRupees(amountInPaise);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rupees);

  return includeCurrencySymbol ? `₹${formatted}` : formatted;
};

/**
 * Validate invoice amount
 * @param amount - Amount in rupees (as string or number)
 * @returns Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  value?: number;
}

export const validateInvoiceAmount = (amount: string | number): ValidationResult => {
  const sanitized = sanitizeNumericInput(amount);
  
  if (sanitized === null) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }

  if (sanitized <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }

  if (sanitized > 10000000) { // 1 crore limit
    return { isValid: false, error: 'Amount cannot exceed ₹1,00,00,000' };
  }

  return { isValid: true, value: sanitized };
};

/**
 * Calculate percentage
 * @param part - Part value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export const calculatePercentage = (part: number, total: number): number => {
  if (typeof part !== 'number' || typeof total !== 'number' || isNaN(part) || isNaN(total) || total === 0) {
    return 0;
  }
  return Math.round((part / total) * 10000) / 100; // Round to 2 decimal places
};

/**
 * Aggregate invoice amounts by month
 * @param invoices - Array of invoices with amount and date
 * @returns Map of month -> total amount in paise
 */
export const aggregateInvoicesByMonth = (invoices: Array<{ amount: number; date: string }>): Map<string, number> => {
  const monthlyTotals = new Map<string, number>();

  for (const invoice of invoices) {
    try {
      const date = new Date(invoice.date);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date in invoice: ${invoice.date}`);
        continue;
      }

      const month = date.toISOString().slice(0, 7); // YYYY-MM format
      const currentTotal = monthlyTotals.get(month) || 0;
      const amount = typeof invoice.amount === 'number' ? invoice.amount : 0;
      monthlyTotals.set(month, currentTotal + amount);
    } catch (error) {
      console.warn(`Error processing invoice:`, error);
    }
  }

  return monthlyTotals;
};
