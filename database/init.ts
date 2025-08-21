import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { SQLite } from 'expo-sqlite';

// Database schema version
const SCHEMA_VERSION = 1;

// Database instance
export const db = SQLite.openDatabase('eagerinvoice.db');

// Types
interface SQLResultSetRow {
    sql: string;
}

interface SQLResultSet {
    rows: {
        _array: SQLResultSetRow[];
    };
}

interface SQLTransaction {
    executeSql: (
        sqlStatement: string,
        args?: any[],
        callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
        errorCallback?: (transaction: SQLTransaction, error: Error) => void
    ) => void;
}

// SQL statements for creating tables
const CREATE_SCHEMA_VERSION = `
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

const CREATE_CLIENTS_TABLE = `
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('Micro', 'Mid', 'Core', 'Large Retainer')) NOT NULL,
    start_date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

const CREATE_INVOICES_TABLE = `
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
`;

const CREATE_SALARY_RECORDS_TABLE = `
CREATE TABLE IF NOT EXISTS salary_records (
    id TEXT PRIMARY KEY,
    month TEXT NOT NULL UNIQUE,
    retainer INTEGER NOT NULL,
    commission INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

// Create indexes
const CREATE_INDEXES = [
    'CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);',
    'CREATE INDEX IF NOT EXISTS idx_clients_start_date ON clients(start_date);',
    'CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);',
    'CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date);',
    'CREATE INDEX IF NOT EXISTS idx_invoices_amount ON invoices(amount);',
    'CREATE INDEX IF NOT EXISTS idx_salary_records_month ON salary_records(month);'
];

// Create triggers
const CREATE_TRIGGERS = [
    `CREATE TRIGGER IF NOT EXISTS clients_update_trigger
     AFTER UPDATE ON clients
     BEGIN
         UPDATE clients 
         SET updated_at = CURRENT_TIMESTAMP 
         WHERE id = NEW.id;
     END;`,
    `CREATE TRIGGER IF NOT EXISTS invoices_update_trigger
     AFTER UPDATE ON invoices
     BEGIN
         UPDATE invoices 
         SET updated_at = CURRENT_TIMESTAMP 
         WHERE id = NEW.id;
     END;`,
    `CREATE TRIGGER IF NOT EXISTS salary_records_update_trigger
     AFTER UPDATE ON salary_records
     BEGIN
         UPDATE salary_records 
         SET updated_at = CURRENT_TIMESTAMP 
         WHERE id = NEW.id;
     END;`
];

// Initialize database
export const initDatabase = async (): Promise<void> => {
    try {
        // Check if database is already initialized
        const initialized = await AsyncStorage.getItem('DB_INITIALIZED');
        if (initialized === 'true') {
            console.log('Database already initialized');
            return;
        }

        // Create tables
        await new Promise<void>((resolve, reject) => {
            db.transaction(
                (tx: SQLTransaction) => {
                    // Create schema version table
                    tx.executeSql(CREATE_SCHEMA_VERSION);
                    tx.executeSql('INSERT INTO schema_version (version) VALUES (?)', [SCHEMA_VERSION]);

                    // Create tables
                    tx.executeSql(CREATE_CLIENTS_TABLE);
                    tx.executeSql(CREATE_INVOICES_TABLE);
                    tx.executeSql(CREATE_SALARY_RECORDS_TABLE);

                    // Create indexes
                    CREATE_INDEXES.forEach(index => {
                        tx.executeSql(index);
                    });

                    // Create triggers
                    CREATE_TRIGGERS.forEach(trigger => {
                        tx.executeSql(trigger);
                    });
                },
                (error: Error) => {
                    console.error('Error initializing database:', error);
                    reject(error);
                },
                () => {
                    console.log('Database initialized successfully');
                    resolve();
                }
            );
        });

        // Mark database as initialized
        await AsyncStorage.setItem('DB_INITIALIZED', 'true');

    } catch (error) {
        console.error('Error in initDatabase:', error);
        throw error;
    }
};

// Backup database
export const backupDatabase = async (): Promise<string> => {
    try {
        const backupDir = `${FileSystem.documentDirectory}backups/`;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = `${backupDir}eagerinvoice-${timestamp}.sql`;

        // Ensure backup directory exists
        await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });

        // Export database to SQL
        await new Promise<void>((resolve, reject) => {
            db.transaction(
                (tx: SQLTransaction) => {
                    tx.executeSql(
                        'SELECT sql FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"',
                        [],
                        (_: any, result: SQLResultSet) => {
                            const schema = result.rows._array.map(row => row.sql).join(';\n');
                            FileSystem.writeAsStringAsync(backupFile, schema)
                                .then(() => resolve())
                                .catch(error => reject(error));
                        }
                    );
                },
                (error: Error) => reject(error)
            );
        });

        console.log('Database backup created:', backupFile);
        return backupFile;

    } catch (error) {
        console.error('Error in backupDatabase:', error);
        throw error;
    }
};

// Restore database from backup
export const restoreDatabase = async (backupFile: string): Promise<void> => {
    try {
        // Read backup file
        const backup = await FileSystem.readAsStringAsync(backupFile);

        // Drop existing tables and restore from backup
        await new Promise<void>((resolve, reject) => {
            db.transaction(
                (tx: SQLTransaction) => {
                    // Drop existing tables
                    tx.executeSql('DROP TABLE IF EXISTS clients');
                    tx.executeSql('DROP TABLE IF EXISTS invoices');
                    tx.executeSql('DROP TABLE IF EXISTS salary_records');
                    tx.executeSql('DROP TABLE IF EXISTS schema_version');

                    // Restore from backup
                    backup.split(';\n').forEach(statement => {
                        if (statement.trim()) {
                            tx.executeSql(statement);
                        }
                    });
                },
                (error: Error) => {
                    console.error('Error restoring database:', error);
                    reject(error);
                },
                () => {
                    console.log('Database restored successfully');
                    resolve();
                }
            );
        });

    } catch (error) {
        console.error('Error in restoreDatabase:', error);
        throw error;
    }
}; 