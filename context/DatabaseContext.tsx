import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
    ClientService,
    initDatabase,
    InvoiceService,
    ReportService,
    SalaryService,
} from '../database';

interface DatabaseContextType {
    // Client operations
    clients: {
        create: typeof ClientService.create;
        update: typeof ClientService.update;
        delete: typeof ClientService.delete;
        getById: typeof ClientService.getById;
        getAll: typeof ClientService.getAll;
        getByType: typeof ClientService.getByType;
    };

    // Invoice operations
    invoices: {
        create: typeof InvoiceService.create;
        getAll: typeof InvoiceService.getAll;
        getByClientId: typeof InvoiceService.getByClientId;
        getMonthlyRevenue: typeof InvoiceService.getMonthlyRevenue;
        getLatestInvoiceNumber: typeof InvoiceService.getLatestInvoiceNumber;
    };

    // Salary operations
    salary: {
        create: typeof SalaryService.create;
        getByMonth: typeof SalaryService.getByMonth;
        getMonthlyStats: typeof SalaryService.getMonthlyStats;
    };

    // Report operations
    reports: {
        getMonthlyOverview: typeof ReportService.getMonthlyOverview;
        getMonthlyStats: typeof ReportService.getMonthlyStats;
        getTopClients: typeof ReportService.getTopClients;
        getAllTimeStats: typeof ReportService.getAllTimeStats;
    };

    // Loading state
    isLoading: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
};

interface DatabaseProviderProps {
    children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                setIsLoading(true);
                await initDatabase();
                setIsInitialized(true);
            } catch (err) {
                console.error('Database initialization error:', err);
                setError(err instanceof Error ? err : new Error('Failed to initialize database'));
            } finally {
                setIsLoading(false);
            }
        };

        initializeDatabase();
    }, []);

    const value: DatabaseContextType = {
        clients: {
            create: ClientService.create,
            update: ClientService.update,
            delete: ClientService.delete,
            getById: ClientService.getById,
            getAll: ClientService.getAll,
            getByType: ClientService.getByType,
        },

        invoices: {
            create: InvoiceService.create,
            getAll: InvoiceService.getAll,
            getByClientId: InvoiceService.getByClientId,
            getMonthlyRevenue: InvoiceService.getMonthlyRevenue,
            getLatestInvoiceNumber: InvoiceService.getLatestInvoiceNumber,
        },

        salary: {
            create: SalaryService.create,
            getByMonth: SalaryService.getByMonth,
            getMonthlyStats: SalaryService.getMonthlyStats,
        },

        reports: {
            getMonthlyOverview: ReportService.getMonthlyOverview,
            getMonthlyStats: ReportService.getMonthlyStats,
            getTopClients: ReportService.getTopClients,
            getAllTimeStats: ReportService.getAllTimeStats,
        },

        isLoading,
        error,
    };

    if (isLoading || !isInitialized) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (error) {
        throw error; // Let the error boundary handle it
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
}); 