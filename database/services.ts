import { DatabaseUtils } from './db';
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

    getById: (id: string) => DatabaseUtils.select('clients', { id })[0],

    getAll: () => DatabaseUtils.select('clients', undefined, { field: 'name', direction: 'ASC' }),

    getByType: (type: string) => DatabaseUtils.select('clients', { type }),
};

// Invoice Services
export const InvoiceService = {
    create: (data: {
        clientId: string;
        invoiceNo: string;
        amount: number;
        date: string;
    }) => {
        const now = new Date().toISOString();
        const client = ClientService.getById(data.clientId);
        if (!client) throw new Error('Client not found');

        return DatabaseUtils.insert('invoices', {
            id: generateId(),
            invoice_no: data.invoiceNo,
            client_id: data.clientId,
            amount: data.amount,
            date: data.date,
            created_at: now,
            updated_at: now,
        });
    },

    getAll: () => {
        return DatabaseUtils.query(`
            SELECT 
                i.*,
                c.name as client_name
            FROM invoices i
            LEFT JOIN clients c ON i.client_id = c.id
            ORDER BY i.date DESC
        `);
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
        const result = DatabaseUtils.query(`
            SELECT 
                SUM(i.amount) as total_revenue,
                COUNT(DISTINCT i.id) as total_invoices,
                COUNT(DISTINCT i.client_id) as total_clients,
                (SELECT SUM(total) FROM salary_records) as total_salary_paid
            FROM invoices i
        `)[0];

        return {
            totalRevenue: result?.total_revenue || 0,
            totalInvoices: result?.total_invoices || 0,
            totalClients: result?.total_clients || 0,
            totalSalaryPaid: result?.total_salary_paid || 0,
            totalNetProfit: (result?.total_revenue || 0) - (result?.total_salary_paid || 0),
        };
    },
}; 