import { DatabaseUtils, clearAllData } from './db';
import { generateId } from './models';

// Client Services
export const ClientService = {
    create: (data: {
        name: string;
        type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
        startDate: string;
        notes?: string;
    }) => {
        const now = new Date().toISOString();
        return DatabaseUtils.insert('clients', {
            id: generateId(),
            name: data.name,
            type: data.type,
            start_date: data.startDate,
            notes: data.notes,
            created_at: now,
            updated_at: now,
        });
    },

    update: (id: string, data: {
        name?: string;
        type?: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
        startDate?: string;
        notes?: string;
    }) => {
        const updates: any = {};
        if (data.name) updates.name = data.name;
        if (data.type) updates.type = data.type;
        if (data.startDate) updates.start_date = data.startDate;
        if (data.notes !== undefined) updates.notes = data.notes;

        return DatabaseUtils.update('clients', updates, { id });
    },

    delete: (id: string) => DatabaseUtils.delete('clients', { id }),

    getById: (id: string) => {
        try {
            console.log('🔍 ClientService.getById called with ID:', id);
            const result = DatabaseUtils.select('clients', { id });
            console.log('📋 Query result:', result);
            return result[0];
        } catch (error) {
            console.error('❌ Error in ClientService.getById:', error);
            return null;
        }
    },

    getAll: () => {
        const results = DatabaseUtils.select('clients', undefined, { field: 'created_at', direction: 'DESC' });
        return results;
    },

    getByType: (type: string) => DatabaseUtils.select('clients', { type }),
};

// Invoice Services
export const InvoiceService = {
    create: (data: {
        clientId: string;
        amount: number;
        date: string;
    }) => {
        try {
            const now = new Date().toISOString();
            
            // Validate input data
            if (!data.clientId || typeof data.clientId !== 'string' || data.clientId.trim() === '') {
                throw new Error('Invalid client ID provided');
            }
            
            if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
                throw new Error('Invalid amount provided');
            }
            
            if (!data.date || typeof data.date !== 'string') {
                throw new Error('Invalid date provided');
            }
            
            // Debug: Log the client ID being searched
            console.log('🔍 Looking for client with ID:', data.clientId, 'Type:', typeof data.clientId);
            
            // Debug: Get all clients to see what's available
            const allClients = ClientService.getAll();
            console.log('📋 Available clients:', allClients.map(c => ({ id: c.id, name: c.name, idType: typeof c.id })));
            
            // Try multiple approaches to find the client
            let client = ClientService.getById(data.clientId);
            console.log('🎯 Found client (first attempt):', client);
            
            // If not found, try trimming the ID and searching again
            if (!client) {
                const trimmedId = data.clientId.trim();
                console.log('🔄 Trying with trimmed ID:', trimmedId);
                client = ClientService.getById(trimmedId);
                console.log('🎯 Found client (trimmed attempt):', client);
            }
            
            // If still not found, try to find by exact string match
            if (!client) {
                console.log('🔄 Trying direct array search...');
                client = allClients.find(c => c.id === data.clientId || c.id === data.clientId.trim()) || null;
                console.log('🎯 Found client (array search):', client);
            }
            
            if (!client) {
                const availableIds = allClients.map(c => c.id);
                console.error('❌ Client not found after all attempts.');
                console.error('🔍 Searched for:', data.clientId);
                console.error('📋 Available IDs:', availableIds);
                console.error('🔢 ID comparisons:');
                availableIds.forEach(id => {
                    console.error(`  "${id}" === "${data.clientId}": ${id === data.clientId}`);
                    console.error(`  "${id}" === "${data.clientId.trim()}": ${id === data.clientId.trim()}`);
                });
                throw new Error(`Client not found. Searched ID: "${data.clientId}". Available IDs: [${availableIds.join(', ')}]`);
            }
            
            console.log('✅ Client found successfully:', client.name);

            // Debug: Get all existing invoices to see what's there
            const allInvoices = DatabaseUtils.query('SELECT invoice_no FROM invoices ORDER BY created_at ASC');
            console.log('All existing invoices:', allInvoices.map(inv => inv.invoice_no));

            // Generate a hybrid invoice number (sequential + random suffix)
            const generateHybridInvoiceNumber = () => {
                // Get the next sequential number
                let maxNumber = 0;
                for (const invoice of allInvoices) {
                    if (invoice.invoice_no) {
                        // Extract sequential part (INV-0001-ABC -> 1)
                        const match = invoice.invoice_no.match(/^INV-(\d+)/);
                        if (match) {
                            const number = parseInt(match[1], 10);
                            if (number > maxNumber) {
                                maxNumber = number;
                            }
                        }
                    }
                }

                const nextSequentialNumber = maxNumber + 1;
                const sequentialPart = nextSequentialNumber.toString().padStart(4, '0');
                
                // Generate random 3-character suffix
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let suffix = '';
                for (let i = 0; i < 3; i++) {
                    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                return `INV-${sequentialPart}-${suffix}`;
            };

            // Generate a unique hybrid invoice number
            let newInvoiceNo;
            let attempts = 0;
            const maxAttempts = 10;

            do {
                attempts++;
                if (attempts > maxAttempts) {
                    throw new Error('Failed to generate unique invoice number after multiple attempts');
                }

                newInvoiceNo = generateHybridInvoiceNumber();
                console.log(`Attempt ${attempts}: Generated invoice number: ${newInvoiceNo}`);

                // Check if this invoice number already exists
                const existingInvoice = DatabaseUtils.select('invoices', { invoice_no: newInvoiceNo })[0];
                if (!existingInvoice) {
                    console.log(`✅ Unique invoice number found: ${newInvoiceNo}`);
                    break;
                } else {
                    console.log(`❌ Invoice number ${newInvoiceNo} already exists, trying again...`);
                }
            } while (true);

            console.log(`Creating invoice with number: ${newInvoiceNo}`);

            const result = DatabaseUtils.insert('invoices', {
                id: generateId(),
                invoice_no: newInvoiceNo,
                client_id: data.clientId,
                amount: data.amount,
                date: data.date,
                created_at: now,
                updated_at: now,
            });

            console.log(`Invoice created successfully with ID: ${result}`);
            return result;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    },

    getAll: () => {
        const results = DatabaseUtils.query(`
            SELECT 
                i.*,
                c.name as client_name
            FROM invoices i
            LEFT JOIN clients c ON i.client_id = c.id
            ORDER BY i.created_at DESC
        `);
        return results;
    },

    getByClientId: (clientId: string) => 
        DatabaseUtils.select('invoices', { client_id: clientId }, { field: 'date', direction: 'DESC' }),

    getMonthlyRevenue: (month: string) => {
        const result = DatabaseUtils.query(
            'SELECT SUM(amount) as total FROM invoices WHERE strftime("%Y-%m", date) = ?',
            [month]
        )[0];
        return result?.total || 0;
    },

    getLatestInvoiceNumber: () => {
        const result = DatabaseUtils.query(
            'SELECT invoice_no FROM invoices ORDER BY created_at DESC LIMIT 1'
        )[0];
        return result?.invoice_no;
    },

    getNextInvoiceNumber: () => {
        // Get all existing invoices
        const allInvoices = DatabaseUtils.query('SELECT invoice_no FROM invoices');
        
        // Generate a hybrid invoice number (sequential + random suffix)
        const generateHybridInvoiceNumber = () => {
            // Get the next sequential number
            let maxNumber = 0;
            for (const invoice of allInvoices) {
                if (invoice.invoice_no) {
                    // Extract sequential part (INV-0001-ABC -> 1)
                    const match = invoice.invoice_no.match(/^INV-(\d+)/);
                    if (match) {
                        const number = parseInt(match[1], 10);
                        if (number > maxNumber) {
                            maxNumber = number;
                        }
                    }
                }
            }

            const nextSequentialNumber = maxNumber + 1;
            const sequentialPart = nextSequentialNumber.toString().padStart(4, '0');
            
            // Generate random 3-character suffix
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let suffix = '';
            for (let i = 0; i < 3; i++) {
                suffix += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            return `INV-${sequentialPart}-${suffix}`;
        };

        // Generate a unique hybrid invoice number
        let newInvoiceNo;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            attempts++;
            if (attempts > maxAttempts) {
                throw new Error('Failed to generate unique invoice number after multiple attempts');
            }

            newInvoiceNo = generateHybridInvoiceNumber();

            // Check if this invoice number already exists
            const existingInvoice = DatabaseUtils.select('invoices', { invoice_no: newInvoiceNo })[0];
            if (!existingInvoice) {
                break;
            }
        } while (true);

        return newInvoiceNo;
    },

    update: (id: string, data: {
        clientId?: string;
        amount?: number;
        date?: string;
    }) => {
        try {
            // Get original invoice to check if month changed
            const originalInvoice = DatabaseUtils.select('invoices', { id })[0];
            if (!originalInvoice) {
                throw new Error('Invoice not found');
            }

            const updates: any = {};
            if (data.clientId) updates.client_id = data.clientId;
            if (data.amount !== undefined) updates.amount = data.amount;
            if (data.date) updates.date = data.date;
            updates.updated_at = new Date().toISOString();

            const result = DatabaseUtils.update('invoices', updates, { id });

            // Recalculate salary for affected months
            const originalMonth = new Date(originalInvoice.date).toISOString().slice(0, 7);
            const newMonth = data.date ? new Date(data.date).toISOString().slice(0, 7) : originalMonth;

            // Recalculate for original month
            SalaryService.calculateAndUpdateSalary(originalMonth);

            // If month changed, recalculate for new month too
            if (newMonth !== originalMonth) {
                SalaryService.calculateAndUpdateSalary(newMonth);
                console.log(`Salary recalculated for both months: ${originalMonth} and ${newMonth}`);
            } else {
                console.log(`Salary recalculated for month: ${originalMonth}`);
            }

            return result;
        } catch (error) {
            console.error('Error updating invoice:', error);
            throw error;
        }
    },

    delete: (id: string) => {
        try {
            // Get invoice details before deletion to recalculate salary
            const invoice = DatabaseUtils.select('invoices', { id })[0];
            if (!invoice) {
                throw new Error('Invoice not found');
            }

            // Delete the invoice
            const result = DatabaseUtils.delete('invoices', { id });

            // Recalculate salary for the invoice's month
            if (invoice.date) {
                const invoiceMonth = new Date(invoice.date).toISOString().slice(0, 7);
                SalaryService.calculateAndUpdateSalary(invoiceMonth);
                console.log(`Salary recalculated for month ${invoiceMonth} after invoice deletion`);
            }

            return result;
        } catch (error) {
            console.error('Error deleting invoice:', error);
            throw error;
        }
    },

    getById: (id: string) => DatabaseUtils.select('invoices', { id })[0],

    // Temporary debug function - call this from console to see what's in the database
    debugInvoices: () => {
        const allInvoices = DatabaseUtils.query('SELECT * FROM invoices ORDER BY created_at ASC');
        console.log('=== DEBUG: All Invoices in Database ===');
        console.log('Total invoices:', allInvoices.length);
        allInvoices.forEach((invoice, index) => {
            console.log(`${index + 1}. ID: ${invoice.id}, Number: ${invoice.invoice_no}, Client: ${invoice.client_id}, Amount: ${invoice.amount}, Date: ${invoice.date}`);
        });
        console.log('=== END DEBUG ===');
        return allInvoices;
    },
};

// Salary Services
export const SalaryService = {
    create: (data: {
        month: string;
        retainer: number;
        commission: number;
        total: number;
    }) => {
        const now = new Date().toISOString();
        return DatabaseUtils.insert('salary_records', {
            id: generateId(),
            month: data.month,
            retainer: data.retainer,
            commission: data.commission,
            total: data.total,
            created_at: now,
            updated_at: now,
        });
    },

    getByMonth: (month: string) => 
        DatabaseUtils.select('salary_records', { month })[0],

    getMonthlyStats: (months: number = 12) => {
        return DatabaseUtils.query(`
            SELECT 
                month,
                retainer,
                commission,
                total
            FROM salary_records
            ORDER BY month DESC
            LIMIT ?
        `, [months]);
    },

    calculateAndUpdateSalary: (month: string) => {
        try {
            // Get monthly revenue
            const monthlyRevenue = InvoiceService.getMonthlyRevenue(month);
            
            // Use centralized calculation logic
            const { calculateSalary } = require('../utils/calculationUtils');
            const salaryBreakdown = calculateSalary(monthlyRevenue);
            
            // Check if salary record exists for this month
            const existingSalary = DatabaseUtils.select('salary_records', { month })[0];
            
            if (existingSalary) {
                // Update existing record
                return DatabaseUtils.update('salary_records', {
                    retainer: salaryBreakdown.retainer,
                    commission: salaryBreakdown.commission,
                    total: salaryBreakdown.total,
                    updated_at: new Date().toISOString()
                }, { month });
            } else {
                // Create new record
                return DatabaseUtils.insert('salary_records', {
                    id: generateId(),
                    month,
                    retainer: salaryBreakdown.retainer,
                    commission: salaryBreakdown.commission,
                    total: salaryBreakdown.total,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            }
        } catch (error) {
            console.error('Error calculating and updating salary:', error);
            throw error;
        }
    },

    getCalculatedSalary: (month: string) => {
        try {
            // Get monthly revenue
            const monthlyRevenue = InvoiceService.getMonthlyRevenue(month);
            
            // Use centralized calculation logic
            const { calculateSalary } = require('../utils/calculationUtils');
            return calculateSalary(monthlyRevenue);
        } catch (error) {
            console.error('Error calculating salary:', error);
            // Return default values on error
            const { rupeesToPaise } = require('../utils/calculationUtils');
            return {
                retainer: rupeesToPaise(15000),
                commission: 0,
                total: rupeesToPaise(15000),
                revenueUsed: 0
            };
        }
    },
};

// Report Services
export const ReportService = {
    getMonthlyOverview: (month: string) => {
        return DatabaseUtils.query(`
            SELECT 
                strftime('%Y-%m', i.date) as month,
                SUM(i.amount) as revenue,
                COALESCE(s.total, 0) as salary,
                SUM(i.amount) - COALESCE(s.total, 0) as net_profit
            FROM invoices i
            LEFT JOIN salary_records s ON strftime('%Y-%m', i.date) = s.month
            WHERE strftime('%Y-%m', i.date) = ?
            GROUP BY strftime('%Y-%m', i.date)
        `, [month])[0] || { month, revenue: 0, salary: 0, netProfit: 0 };
    },

    getMonthlyStats: (months: number = 12) => {
        return DatabaseUtils.query(`
            SELECT 
                strftime('%Y-%m', i.date) as month,
                SUM(i.amount) as revenue,
                COALESCE(s.total, 0) as salary,
                SUM(i.amount) - COALESCE(s.total, 0) as net_profit
            FROM invoices i
            LEFT JOIN salary_records s ON strftime('%Y-%m', i.date) = s.month
            GROUP BY strftime('%Y-%m', i.date)
            ORDER BY month DESC
            LIMIT ?
        `, [months]);
    },

    getTopClients: (limit: number = 5) => {
        return DatabaseUtils.query(`
            SELECT 
                c.id as client_id,
                c.name as client_name,
                SUM(i.amount) as revenue,
                (SUM(i.amount) * 100.0 / (SELECT SUM(amount) FROM invoices)) as percentage
            FROM clients c
            LEFT JOIN invoices i ON c.id = i.client_id
            GROUP BY c.id
            ORDER BY revenue DESC
            LIMIT ?
        `, [limit]);
    },

    getAllTimeStats: () => {
        // Get all invoices grouped by month
        const monthlyData = DatabaseUtils.query(`
            SELECT 
                strftime('%Y-%m', i.date) as month,
                SUM(i.amount) as monthly_revenue
            FROM invoices i
            GROUP BY strftime('%Y-%m', i.date)
            ORDER BY month
        `);

        // Calculate total revenue and salary for each month
        let totalRevenue = 0;
        let totalSalaryPaid = 0;

        // Handle case when no invoices exist
        if (!monthlyData || monthlyData.length === 0) {
            return {
                totalRevenue: 0,
                totalInvoices: 0,
                totalClients: 0,
                totalSalaryPaid: 0,
                totalNetProfit: 0,
            };
        }

        monthlyData.forEach((monthData: any) => {
            // Ensure monthlyRevenue is a valid number
            const monthlyRevenue = Number(monthData.monthly_revenue) || 0;
            totalRevenue += monthlyRevenue;

            // Calculate salary for this month based on revenue
            const retainer = 15000 * 100; // ₹15,000 in paise
            let commission = 0;
            
            const revenueInRupees = monthlyRevenue / 100;
            if (revenueInRupees <= 50000) {
                commission = revenueInRupees * 0.10 * 100; // 10% up to ₹50,000
            } else if (revenueInRupees <= 100000) {
                commission = (50000 * 0.10 * 100) + // 10% on first ₹50,000
                            ((revenueInRupees - 50000) * 0.15 * 100); // 15% on ₹50,000-₹100,000
            } else {
                commission = (50000 * 0.10 * 100) + // 10% on first ₹50,000
                            (50000 * 0.15 * 100) + // 15% on next ₹50,000
                            ((revenueInRupees - 100000) * 0.20 * 100); // 20% above ₹100,000
            }
            
            const monthlySalary = Math.min(retainer + commission, 60000 * 100); // Cap at ₹60,000
            totalSalaryPaid += monthlySalary;
        });

        // Get additional stats
        const additionalStats = DatabaseUtils.query(`
            SELECT 
                COUNT(DISTINCT i.id) as total_invoices,
                COUNT(DISTINCT i.client_id) as total_clients
            FROM invoices i
        `)[0];

        return {
            totalRevenue: Number(totalRevenue) || 0,
            totalInvoices: Number(additionalStats?.total_invoices) || 0,
            totalClients: Number(additionalStats?.total_clients) || 0,
            totalSalaryPaid: Number(totalSalaryPaid) || 0,
            totalNetProfit: (Number(totalRevenue) || 0) - (Number(totalSalaryPaid) || 0),
        };
    },
};

// Utility function to clear all data
export const clearAllAppData = () => {
    return clearAllData();
}; 