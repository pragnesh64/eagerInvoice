/**
 * Format a number as Indian Rupees (INR)
 * @param value - The amount in paise (1 rupee = 100 paise)
 * @returns Formatted currency string (e.g., "₹2,000.00")
 */
export const formatCurrency = (value: number): string => {
  // Convert from paise to rupees
  const rupees = value / 100;
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
};

/**
 * Convert rupees to paise for database storage
 * @param rupees - The amount in rupees
 * @returns Amount in paise
 */
export const rupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

/**
 * Convert paise to rupees for display/input
 * @param paise - The amount in paise
 * @returns Amount in rupees
 */
export const paiseToRupees = (paise: number): number => {
  return paise / 100;
};

/**
 * Format a number as plain rupees without currency symbol
 * @param value - The amount in paise
 * @returns Formatted number string (e.g., "2,000.00")
 */
export const formatRupees = (value: number): string => {
  const rupees = value / 100;
  
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
};
