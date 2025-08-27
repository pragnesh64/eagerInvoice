import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

interface WhereClause {
    [key: string]: any;
}

interface OrderByClause {
    field: string;
    direction: 'ASC' | 'DESC';
}

interface DatabaseRow {
    [key: string]: any;
}

interface SQLiteResult {
    lastID?: number;
    changes: number;
}

export const db = SQLite.openDatabaseSync('eagerinvoice.db');

export class DatabaseUtils {
    static select(
        table: string,
        where?: WhereClause,
        orderBy?: OrderByClause,
        limit?: number
    ): DatabaseRow[] {
        let sql = `SELECT * FROM ${table}`;
        const values: any[] = [];

        // Add WHERE clause
        if (where && Object.keys(where).length > 0) {
            const conditions = Object.entries(where)
                .map(([key, value]) => {
                    values.push(value);
                    return `${key} = ?`;
                })
                .join(' AND ');
            sql += ` WHERE ${conditions}`;
        }

        // Add ORDER BY clause
        if (orderBy) {
            sql += ` ORDER BY ${orderBy.field} ${orderBy.direction}`;
        }

        // Add LIMIT clause
        if (limit) {
            sql += ` LIMIT ${limit}`;
        }

        const results = db.getAllSync(sql, values) as DatabaseRow[];
        
        // Map snake_case to camelCase
        return results.map(row => {
            const mappedRow: DatabaseRow = {};
            Object.entries(row).forEach(([key, value]) => {
                // Convert snake_case to camelCase
                const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
                mappedRow[camelKey] = value;
            });
            return mappedRow;
        });
    }

    static insert(table: string, data: DatabaseRow): number {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const result = db.runSync(sql, values) as SQLiteResult;
        return result.lastID || 0;
    }

    static update(table: string, data: DatabaseRow, where: WhereClause): number {
        const setClause = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ');
        const whereClause = Object.keys(where)
            .map(key => `${key} = ?`)
            .join(' AND ');
        const values = [...Object.values(data), ...Object.values(where)];

        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
        const result = db.runSync(sql, values) as SQLiteResult;
        return result.changes;
    }

    static delete(table: string, where: WhereClause): number {
        const whereClause = Object.keys(where)
            .map(key => `${key} = ?`)
            .join(' AND ');
        const values = Object.values(where);

        const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
        const result = db.runSync(sql, values) as SQLiteResult;
        return result.changes;
    }

    static query(sql: string, params: any[] = []): DatabaseRow[] {
        const results = db.getAllSync(sql, params) as DatabaseRow[];
        
        // Map snake_case to camelCase
        return results.map(row => {
            const mappedRow: DatabaseRow = {};
            Object.entries(row).forEach(([key, value]) => {
                // Convert snake_case to camelCase
                const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
                mappedRow[camelKey] = value;
            });
            return mappedRow;
        });
    }

    static execute(sql: string, params: any[] = []): SQLiteResult {
        return db.runSync(sql, params) as SQLiteResult;
    }
}

// Schema initialization
export function initDatabase() {
    // Create clients table
    db.execSync(`
        CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT CHECK(type IN ('Micro', 'Mid', 'Core', 'Large Retainer')) NOT NULL,
            start_date TEXT NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
        CREATE INDEX IF NOT EXISTS idx_clients_start_date ON clients(start_date);
    `);

    // Create invoices table
    db.execSync(`
        CREATE TABLE IF NOT EXISTS invoices (
            id TEXT PRIMARY KEY,
            invoice_no TEXT NOT NULL UNIQUE,
            client_id TEXT NOT NULL,
            amount INTEGER NOT NULL,
            date TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
        CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date);
        CREATE INDEX IF NOT EXISTS idx_invoices_amount ON invoices(amount);
    `);

    // Create salary_records table
    db.execSync(`
        CREATE TABLE IF NOT EXISTS salary_records (
            id TEXT PRIMARY KEY,
            month TEXT NOT NULL UNIQUE,
            retainer INTEGER NOT NULL,
            commission INTEGER NOT NULL,
            total INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_salary_records_month ON salary_records(month);
    `);

    // Create triggers for updated_at
    db.execSync(`
        CREATE TRIGGER IF NOT EXISTS clients_update_trigger
        AFTER UPDATE ON clients
        BEGIN
            UPDATE clients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;

        CREATE TRIGGER IF NOT EXISTS invoices_update_trigger
        AFTER UPDATE ON invoices
        BEGIN
            UPDATE invoices SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;

        CREATE TRIGGER IF NOT EXISTS salary_records_update_trigger
        AFTER UPDATE ON salary_records
        BEGIN
            UPDATE salary_records SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
    `);
}

// Database backup and restore
export async function backupDatabase(): Promise<void> {
    const tables = db.getAllSync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    ) as DatabaseRow[];

    const backup: Record<string, any[]> = {};
    for (const table of tables) {
        const tableName = table.name as string;
        backup[tableName] = db.getAllSync(`SELECT * FROM ${tableName};`) as any[];
    }

    const backupJson = JSON.stringify(backup);
    await SecureStore.setItemAsync('db_backup', backupJson);
}

export async function restoreDatabase(): Promise<void> {
    const backupJson = await SecureStore.getItemAsync('db_backup');
    if (!backupJson) return;

    const backup = JSON.parse(backupJson);
    
    // Start transaction
    db.execSync('BEGIN TRANSACTION;');
    
    try {
        // Clear existing data
        for (const table of Object.keys(backup)) {
            db.execSync(`DELETE FROM ${table};`);
        }

        // Restore data
        for (const [table, records] of Object.entries(backup)) {
            for (const record of records as any[]) {
                DatabaseUtils.insert(table, record);
            }
        }

        // Commit transaction
        db.execSync('COMMIT;');
    } catch (error) {
        // Rollback on error
        db.execSync('ROLLBACK;');
        throw error;
    }
}

// Clear all data from database
export function clearAllData(): void {
    try {
        // Start transaction
        db.execSync('BEGIN TRANSACTION;');
        
        // Clear all tables
        db.execSync('DELETE FROM salary_records;');
        db.execSync('DELETE FROM invoices;');
        db.execSync('DELETE FROM clients;');
        
        // Commit transaction
        db.execSync('COMMIT;');
        
        console.log('All data cleared successfully');
    } catch (error) {
        // Rollback on error
        db.execSync('ROLLBACK;');
        console.error('Error clearing data:', error);
        throw error;
    }
}

// Initialize database
initDatabase(); 