/**
 * Data Synchronization Utilities for EagerInvoice
 * Ensures real-time synchronization of calculations and data across the system
 */

import { InvoiceService, SalaryService } from '../database/services';
import { aggregateInvoicesByMonth } from './calculationUtils';

/**
 * Synchronization events that can trigger recalculations
 */
export enum SyncEvent {
  INVOICE_CREATED = 'invoice_created',
  INVOICE_UPDATED = 'invoice_updated',
  INVOICE_DELETED = 'invoice_deleted',
  CLIENT_DELETED = 'client_deleted',
  MANUAL_REFRESH = 'manual_refresh'
}

/**
 * Interface for synchronization result
 */
export interface SyncResult {
  success: boolean;
  affectedMonths: string[];
  errors?: string[];
  timestamp: string;
}

/**
 * Main synchronization service
 */
export class DataSyncService {
  private static instance: DataSyncService;
  private syncInProgress = false;
  private lastSyncTime: Date = new Date();

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  /**
   * Synchronize data after an invoice operation
   */
  async syncAfterInvoiceOperation(
    event: SyncEvent,
    affectedInvoiceIds: string[] = [],
    affectedMonths: string[] = []
  ): Promise<SyncResult> {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping...');
      return {
        success: false,
        affectedMonths: [],
        errors: ['Sync already in progress'],
        timestamp: new Date().toISOString()
      };
    }

    this.syncInProgress = true;
    const errors: string[] = [];
    const syncedMonths = new Set<string>();

    try {
      console.log(`Starting sync for event: ${event}`);

      // If specific months are provided, sync those
      if (affectedMonths.length > 0) {
        for (const month of affectedMonths) {
          try {
            await SalaryService.calculateAndUpdateSalary(month);
            syncedMonths.add(month);
            console.log(`✅ Synced salary for month: ${month}`);
          } catch (error) {
            const errorMsg = `Failed to sync month ${month}: ${error}`;
            console.error(errorMsg);
            errors.push(errorMsg);
          }
        }
      } else if (affectedInvoiceIds.length > 0) {
        // Get months from affected invoices
        const monthsToSync = new Set<string>();
        
        for (const invoiceId of affectedInvoiceIds) {
          try {
            const invoice = InvoiceService.getById(invoiceId);
            if (invoice && invoice.date) {
              const month = new Date(invoice.date).toISOString().slice(0, 7);
              monthsToSync.add(month);
            }
          } catch (error) {
            console.warn(`Could not get invoice ${invoiceId} for sync:`, error);
          }
        }

        // Sync all affected months
        for (const month of monthsToSync) {
          try {
            await SalaryService.calculateAndUpdateSalary(month);
            syncedMonths.add(month);
            console.log(`✅ Synced salary for month: ${month}`);
          } catch (error) {
            const errorMsg = `Failed to sync month ${month}: ${error}`;
            console.error(errorMsg);
            errors.push(errorMsg);
          }
        }
      } else {
        // Full sync - get all months with invoices and recalculate
        try {
          const allInvoices = InvoiceService.getAll();
          const monthlyTotals = aggregateInvoicesByMonth(allInvoices);

          for (const month of monthlyTotals.keys()) {
            try {
              await SalaryService.calculateAndUpdateSalary(month);
              syncedMonths.add(month);
              console.log(`✅ Full sync - updated salary for month: ${month}`);
            } catch (error) {
              const errorMsg = `Failed to sync month ${month}: ${error}`;
              console.error(errorMsg);
              errors.push(errorMsg);
            }
          }
        } catch (error) {
          const errorMsg = `Failed during full sync: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      this.lastSyncTime = new Date();
      
      const result: SyncResult = {
        success: errors.length === 0,
        affectedMonths: Array.from(syncedMonths),
        errors: errors.length > 0 ? errors : undefined,
        timestamp: this.lastSyncTime.toISOString()
      };

      console.log(`Sync completed. Affected months: ${result.affectedMonths.join(', ')}`);
      return result;

    } catch (error) {
      const errorMsg = `Critical sync error: ${error}`;
      console.error(errorMsg);
      return {
        success: false,
        affectedMonths: Array.from(syncedMonths),
        errors: [errorMsg],
        timestamp: new Date().toISOString()
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync after client deletion (removes all associated invoices)
   */
  async syncAfterClientDeletion(clientId: string): Promise<SyncResult> {
    try {
      // Get all invoices for this client before they're deleted
      const clientInvoices = InvoiceService.getByClientId(clientId);
      const affectedMonths = new Set<string>();

      // Collect all months that will be affected
      for (const invoice of clientInvoices) {
        if (invoice.date) {
          const month = new Date(invoice.date).toISOString().slice(0, 7);
          affectedMonths.add(month);
        }
      }

      // Perform sync for all affected months
      return await this.syncAfterInvoiceOperation(
        SyncEvent.CLIENT_DELETED,
        [],
        Array.from(affectedMonths)
      );
    } catch (error) {
      console.error('Error syncing after client deletion:', error);
      return {
        success: false,
        affectedMonths: [],
        errors: [`Failed to sync after client deletion: ${error}`],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Validate data consistency across the system
   */
  async validateDataConsistency(): Promise<{
    isConsistent: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check if all invoices have valid client references
      const allInvoices = InvoiceService.getAll();
      const orphanedInvoices = allInvoices.filter(invoice => {
        try {
          const client = InvoiceService.getById(invoice.client_id);
          return !client;
        } catch {
          return true;
        }
      });

      if (orphanedInvoices.length > 0) {
        issues.push(`Found ${orphanedInvoices.length} invoices with invalid client references`);
        recommendations.push('Clean up orphaned invoices or restore missing client data');
      }

      // Check for months with invoices but no salary records
      const monthsWithInvoices = aggregateInvoicesByMonth(allInvoices);
      for (const month of monthsWithInvoices.keys()) {
        try {
          const salaryRecord = SalaryService.getByMonth(month);
          if (!salaryRecord) {
            issues.push(`Month ${month} has invoices but no salary record`);
            recommendations.push(`Recalculate salary for month ${month}`);
          }
        } catch (error) {
          issues.push(`Error checking salary record for month ${month}: ${error}`);
        }
      }

      // Check for negative amounts
      const negativeAmountInvoices = allInvoices.filter(invoice => invoice.amount < 0);
      if (negativeAmountInvoices.length > 0) {
        issues.push(`Found ${negativeAmountInvoices.length} invoices with negative amounts`);
        recommendations.push('Review and correct negative invoice amounts');
      }

      return {
        isConsistent: issues.length === 0,
        issues,
        recommendations
      };
    } catch (error) {
      return {
        isConsistent: false,
        issues: [`Failed to validate data consistency: ${error}`],
        recommendations: ['Perform a full data sync and review database integrity']
      };
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      syncInProgress: this.syncInProgress,
      lastSyncTime: this.lastSyncTime.toISOString(),
      timeSinceLastSync: Date.now() - this.lastSyncTime.getTime()
    };
  }

  /**
   * Force a complete data resync
   */
  async forceFullSync(): Promise<SyncResult> {
    console.log('🔄 Starting forced full sync...');
    return await this.syncAfterInvoiceOperation(SyncEvent.MANUAL_REFRESH);
  }
}

/**
 * Convenience functions for common sync operations
 */
export const syncUtils = {
  // Sync after invoice creation
  syncAfterInvoiceCreate: async (invoiceId: string, month: string) => {
    const syncService = DataSyncService.getInstance();
    return await syncService.syncAfterInvoiceOperation(
      SyncEvent.INVOICE_CREATED,
      [invoiceId],
      [month]
    );
  },

  // Sync after invoice update
  syncAfterInvoiceUpdate: async (invoiceId: string, affectedMonths: string[]) => {
    const syncService = DataSyncService.getInstance();
    return await syncService.syncAfterInvoiceOperation(
      SyncEvent.INVOICE_UPDATED,
      [invoiceId],
      affectedMonths
    );
  },

  // Sync after invoice deletion
  syncAfterInvoiceDelete: async (month: string) => {
    const syncService = DataSyncService.getInstance();
    return await syncService.syncAfterInvoiceOperation(
      SyncEvent.INVOICE_DELETED,
      [],
      [month]
    );
  },

  // Sync after client deletion
  syncAfterClientDelete: async (clientId: string) => {
    const syncService = DataSyncService.getInstance();
    return await syncService.syncAfterClientDeletion(clientId);
  },

  // Validate data consistency
  validateConsistency: async () => {
    const syncService = DataSyncService.getInstance();
    return await syncService.validateDataConsistency();
  },

  // Force full sync
  forceFullSync: async () => {
    const syncService = DataSyncService.getInstance();
    return await syncService.forceFullSync();
  },

  // Get sync status
  getSyncStatus: () => {
    const syncService = DataSyncService.getInstance();
    return syncService.getSyncStatus();
  }
};

export default DataSyncService;
