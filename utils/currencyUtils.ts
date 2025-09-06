import { formatCurrency as formatCurrencyUtil, paiseToRupees as paiseToRupeesUtil, rupeesToPaise as rupeesToPaiseUtil } from './calculationUtils';

/**
 * Format a number as Indian Rupees (INR)
 * @param value - The amount in paise (1 rupee = 100 paise)
 * @returns Formatted currency string (e.g., "₹2,000.00")
 */
export const formatCurrency = (value: number): string => {
  return formatCurrencyUtil(value, true);
};

/**
 * Convert rupees to paise for database storage
 * @param rupees - The amount in rupees
 * @returns Amount in paise
 */
export const rupeesToPaise = (rupees: number): number => {
  return rupeesToPaiseUtil(rupees);
};

/**
 * Convert paise to rupees for display/input
 * @param paise - The amount in paise
 * @returns Amount in rupees
 */
export const paiseToRupees = (paise: number): number => {
  return paiseToRupeesUtil(paise);
};

/**
 * Format a number as plain rupees without currency symbol
 * @param value - The amount in paise
 * @returns Formatted number string (e.g., "2,000.00")
 */
export const formatRupees = (value: number): string => {
  return formatCurrencyUtil(value, false);
};
