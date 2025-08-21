import { db } from './init';
import { Client, Invoice, SalaryRecord, generateId } from './models';

// Types
interface SQLTransaction {
    executeSql: (
        sqlStatement: string,
        args?: any[],
        callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
        errorCallback?: (transaction: SQLTransaction, error: Error) => void
    ) => void;
}

interface SQLResultSet {
    rows: {
        length: number;
        item: (index: number) => any;
        _array: any[];
    };
}

// Type guard for error objects
const isError = (error: any): error is Error => {
    return error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error);
};

// Client operations
export const createClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    const now = new Date().toISOString();
    const newClient: Client = {
        id: generateId(),
        ...client,
        createdAt: now,
        updatedAt: now,
    };

    return new Promise((resolve, reject) => {
        db.transaction((tx: SQLTransaction) => {
            tx.executeSql(
                `INSERT INTO clients (id, name, type, start_date, notes, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    newClient.id,
                    newClient.name,
                    newClient.type,
                    newClient.startDate,
                    newClient.notes,
                    newClient.createdAt,
                    newClient.updatedAt,
                ],
                () => resolve(newClient),
                (_: SQLTransaction, error: Error) => reject(error)
            );
        });
    });
};

export const updateClient = async (id: string, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
            updateFields.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (updateFields.length === 0) return;

    values.push(new Date().toISOString()); // updated_at
    values.push(id);

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE clients 
                 SET ${updateFields.join(', ')}, updated_at = ?
                 WHERE id = ?`,
                values,
                () => resolve(),
                (_, error) => reject(error)
            );
        });
    });
};

export const deleteClient = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM clients WHERE id = ?',
                [id],
                () => resolve(),
                (_, error) => reject(error)
            );
        });
    });
};

export const getClientById = async (id: string): Promise<Client | null> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM clients WHERE id = ?',
                [id],
                (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
                (_, error) => reject(error)
            );
        });
    });
};

export const getAllClients = async (): Promise<Client[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM clients ORDER BY name',
                [],
                (_, { rows }) => {
                    const clients: Client[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        clients.push(rows.item(i));
                    }
                    resolve(clients);
                },
                (_, error) => reject(error)
            );
        });
    });
};

// Invoice operations
export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
        id: generateId(),
        ...invoice,
        createdAt: now,
        updatedAt: now,
    };

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO invoices (id, invoice_no, client_id, amount, date, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    newInvoice.id,
                    newInvoice.invoiceNo,
                    newInvoice.clientId,
                    newInvoice.amount,
                    newInvoice.date,
                    newInvoice.createdAt,
                    newInvoice.updatedAt,
                ],
                () => resolve(newInvoice),
                (_, error) => reject(error)
            );
        });
    });
};

export const getInvoicesByClientId = async (clientId: string): Promise<Invoice[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM invoices WHERE client_id = ? ORDER BY date DESC',
                [clientId],
                (_, { rows }) => {
                    const invoices: Invoice[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        invoices.push(rows.item(i));
                    }
                    resolve(invoices);
                },
                (_, error) => reject(error)
            );
        });
    });
};

export const getMonthlyRevenue = async (month: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT SUM(amount) as total
                 FROM invoices 
                 WHERE strftime('%Y-%m', date) = ?`,
                [month],
                (_, { rows }) => resolve(rows.item(0).total || 0),
                (_, error) => reject(error)
            );
        });
    });
};

// Salary operations
export const createSalaryRecord = async (salary: Omit<SalaryRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<SalaryRecord> => {
    const now = new Date().toISOString();
    const newSalary: SalaryRecord = {
        id: generateId(),
        ...salary,
        createdAt: now,
        updatedAt: now,
    };

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO salary_records (id, month, retainer, commission, total, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    newSalary.id,
                    newSalary.month,
                    newSalary.retainer,
                    newSalary.commission,
                    newSalary.total,
                    newSalary.createdAt,
                    newSalary.updatedAt,
                ],
                () => resolve(newSalary),
                (_, error) => reject(error)
            );
        });
    });
};

export const getSalaryByMonth = async (month: string): Promise<SalaryRecord | null> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM salary_records WHERE month = ?',
                [month],
                (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
                (_, error) => reject(error)
            );
        });
    });
};

// Report operations
export interface MonthlyStats {
    month: string;
    revenue: number;
    salary: number;
    netProfit: number;
}

export const getMonthlyStats = async (months: number = 12): Promise<MonthlyStats[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT 
                    strftime('%Y-%m', i.date) as month,
                    SUM(i.amount) as revenue,
                    COALESCE(s.total, 0) as salary,
                    SUM(i.amount) - COALESCE(s.total, 0) as net_profit
                 FROM invoices i
                 LEFT JOIN salary_records s ON strftime('%Y-%m', i.date) = s.month
                 GROUP BY strftime('%Y-%m', i.date)
                 ORDER BY month DESC
                 LIMIT ?`,
                [months],
                (_, { rows }) => {
                    const stats: MonthlyStats[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        stats.push(rows.item(i));
                    }
                    resolve(stats);
                },
                (_, error) => reject(error)
            );
        });
    });
}; 