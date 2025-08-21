// Database models and types for EagerInvoice

// Client model
export interface Client {
    id: string;
    name: string;
    type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
    startDate: string;  // ISO 8601 format: YYYY-MM-DD
    notes?: string;
    createdAt: string;  // ISO 8601 format
    updatedAt: string;  // ISO 8601 format
}

// Invoice model
export interface Invoice {
    id: string;
    invoiceNo: string;
    clientId: string;
    clientName: string;  // Added for convenience
    amount: number;     // Amount in paise (1 rupee = 100 paise)
    date: string;       // ISO 8601 format: YYYY-MM-DD
    createdAt: string;  // ISO 8601 format
    updatedAt: string;  // ISO 8601 format
}

// Salary record model
export interface SalaryRecord {
    id: string;
    month: string;      // Format: YYYY-MM
    retainer: number;   // Amount in paise
    commission: number; // Amount in paise
    total: number;      // Amount in paise
    createdAt: string;  // ISO 8601 format
    updatedAt: string;  // ISO 8601 format
}

// Helper functions for data conversion
export const toPaise = (rupees: number): number => Math.round(rupees * 100);
export const toRupees = (paise: number): number => paise / 100;

// Helper function to format dates
export const formatDate = (date: Date): string => date.toISOString().split('T')[0];
export const formatMonth = (date: Date): string => date.toISOString().slice(0, 7);

// Helper function to generate IDs
export const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Helper function to validate client type
export const isValidClientType = (type: string): type is Client['type'] => {
    return ['Micro', 'Mid', 'Core', 'Large Retainer'].includes(type);
};

// Helper function to calculate commission based on revenue
export const calculateCommission = (monthlyRevenue: number): number => {
    const revenueInRupees = toRupees(monthlyRevenue);
    let commission = 0;

    if (revenueInRupees <= 50000) {
        commission = revenueInRupees * 0.10; // 10% up to ₹50,000
    } else if (revenueInRupees <= 100000) {
        commission = (50000 * 0.10) + // 10% on first ₹50,000
                    ((revenueInRupees - 50000) * 0.15); // 15% on ₹50,000-₹100,000
    } else {
        commission = (50000 * 0.10) + // 10% on first ₹50,000
                    (50000 * 0.15) + // 15% on next ₹50,000
                    ((revenueInRupees - 100000) * 0.20); // 20% above ₹100,000
    }

    return toPaise(commission);
};

// Helper function to calculate total salary
export const calculateSalary = (monthlyRevenue: number): SalaryRecord => {
    const retainer = toPaise(15000); // Fixed monthly retainer: ₹15,000
    const commission = calculateCommission(monthlyRevenue);
    const total = Math.min(retainer + commission, toPaise(60000)); // Cap at ₹60,000

    return {
        id: generateId(),
        month: formatMonth(new Date()),
        retainer,
        commission,
        total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

// Helper function to validate invoice number format
export const isValidInvoiceNumber = (invoiceNo: string): boolean => {
    return /^INV-\d{3,}$/.test(invoiceNo);
};

// Helper function to generate next invoice number
export const generateInvoiceNumber = (lastInvoiceNo: string): string => {
    const match = lastInvoiceNo.match(/^INV-(\d+)$/);
    if (!match) return 'INV-001';
    
    const nextNumber = parseInt(match[1], 10) + 1;
    return `INV-${nextNumber.toString().padStart(3, '0')}`;
}; 