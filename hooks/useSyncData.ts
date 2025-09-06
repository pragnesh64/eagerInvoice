/**
 * Custom hook for real-time data synchronization
 * Ensures commission and profit calculations are always up-to-date
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { syncUtils } from '../utils/syncUtils';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  syncSuccess: boolean;
}

interface UseSyncDataReturn {
  syncState: SyncState;
  triggerSync: (reason?: string) => Promise<void>;
  forceSyncAll: () => Promise<void>;
  clearSyncError: () => void;
}

export const useSyncData = (autoSyncInterval?: number): UseSyncDataReturn => {
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
    syncSuccess: false
  });

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // Auto-sync interval
  useEffect(() => {
    if (autoSyncInterval && autoSyncInterval > 0) {
      const interval = setInterval(async () => {
        if (mountedRef.current && !syncState.isSyncing) {
          await triggerSync('auto-sync');
        }
      }, autoSyncInterval);

      return () => clearInterval(interval);
    }
  }, [autoSyncInterval, syncState.isSyncing]);

  const updateSyncState = useCallback((updates: Partial<SyncState>) => {
    if (mountedRef.current) {
      setSyncState(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const triggerSync = useCallback(async (reason: string = 'manual') => {
    if (syncState.isSyncing || !mountedRef.current) {
      return;
    }

    updateSyncState({
      isSyncing: true,
      syncError: null,
      syncSuccess: false
    });

    try {
      console.log(`🔄 Starting sync - Reason: ${reason}`);
      
      // Force a full sync to ensure all calculations are up-to-date
      const result = await syncUtils.forceFullSync();
      
      if (mountedRef.current) {
        updateSyncState({
          isSyncing: false,
          lastSyncTime: new Date(),
          syncSuccess: result.success,
          syncError: result.success ? null : (result.errors?.join(', ') || 'Unknown sync error')
        });

        if (result.success) {
          console.log(`✅ Sync completed successfully - Affected months: ${result.affectedMonths.join(', ')}`);
        } else {
          console.error('❌ Sync failed:', result.errors);
        }
      }
    } catch (error) {
      console.error('❌ Sync error:', error);
      if (mountedRef.current) {
        updateSyncState({
          isSyncing: false,
          syncError: String(error),
          syncSuccess: false
        });
      }
    }
  }, [syncState.isSyncing, updateSyncState]);

  const forceSyncAll = useCallback(async () => {
    await triggerSync('force-all');
  }, [triggerSync]);

  const clearSyncError = useCallback(() => {
    updateSyncState({ syncError: null });
  }, [updateSyncState]);

  return {
    syncState,
    triggerSync,
    forceSyncAll,
    clearSyncError
  };
};

/**
 * Hook specifically for invoice operations with automatic sync
 */
export const useInvoiceSync = () => {
  const { syncState, triggerSync } = useSyncData();

  const syncAfterInvoiceOperation = useCallback(async (
    operation: 'create' | 'update' | 'delete',
    invoiceData?: { month?: string; oldMonth?: string }
  ) => {
    try {
      console.log(`🔄 Syncing after invoice ${operation}`);
      
      if (operation === 'update' && invoiceData?.oldMonth && invoiceData?.month && 
          invoiceData.oldMonth !== invoiceData.month) {
        // Month changed - sync both months
        await syncUtils.syncAfterInvoiceUpdate('', [invoiceData.oldMonth, invoiceData.month]);
      } else if (invoiceData?.month) {
        // Single month sync
        const syncFunction = {
          create: syncUtils.syncAfterInvoiceCreate,
          update: syncUtils.syncAfterInvoiceUpdate,
          delete: syncUtils.syncAfterInvoiceDelete
        }[operation];
        
        if (operation === 'create') {
          await syncUtils.syncAfterInvoiceCreate('', invoiceData.month);
        } else if (operation === 'delete') {
          await syncUtils.syncAfterInvoiceDelete(invoiceData.month);
        } else {
          await syncUtils.syncAfterInvoiceUpdate('', [invoiceData.month]);
        }
      } else {
        // Fallback to full sync
        await triggerSync(`invoice-${operation}-fallback`);
      }

      console.log(`✅ Invoice ${operation} sync completed`);
    } catch (error) {
      console.error(`❌ Invoice ${operation} sync failed:`, error);
      // Fallback to full sync on error
      await triggerSync(`invoice-${operation}-error-fallback`);
    }
  }, [triggerSync]);

  return {
    syncState,
    syncAfterInvoiceOperation
  };
};

/**
 * Hook for dashboard real-time updates
 */
export const useDashboardSync = (refreshInterval: number = 30000) => {
  const { syncState, triggerSync } = useSyncData(refreshInterval);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  const refreshDashboard = useCallback(async () => {
    await triggerSync('dashboard-refresh');
    setLastRefreshTime(new Date());
  }, [triggerSync]);

  return {
    syncState,
    lastRefreshTime,
    refreshDashboard,
    isDataStale: syncState.lastSyncTime ? 
      (Date.now() - syncState.lastSyncTime.getTime()) > refreshInterval : true
  };
};

export default useSyncData;
