/**
 * Custom hook for managing monthly data state and filtering
 */

import { useCallback, useEffect, useState } from 'react';
import { calculateMonthlyData, getCurrentMonth, getMonthlyTrends, MonthlyData } from '../utils/monthlyDataUtils';

interface UseMonthlyDataReturn {
  selectedMonth: string;
  monthlyData: MonthlyData | null;
  isLoading: boolean;
  error: string | null;
  setSelectedMonth: (month: string) => void;
  refreshData: () => Promise<void>;
  trends: MonthlyData[];
  isLoadingTrends: boolean;
}

interface UseMonthlyDataOptions {
  initialMonth?: string;
  autoLoad?: boolean;
  includeTrends?: boolean;
  trendMonths?: number;
}

export const useMonthlyData = (options: UseMonthlyDataOptions = {}): UseMonthlyDataReturn => {
  const {
    initialMonth = getCurrentMonth(),
    autoLoad = true,
    includeTrends = false,
    trendMonths = 6
  } = options;

  const [selectedMonth, setSelectedMonthState] = useState<string>(initialMonth);
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [trends, setTrends] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load monthly data for selected month
  const loadMonthlyData = useCallback(async (month: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔄 Loading monthly data for: ${month}`);
      const data = await calculateMonthlyData(month);
      setMonthlyData(data);
      console.log(`✅ Monthly data loaded for ${month}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load monthly data';
      console.error('❌ Error loading monthly data:', errorMessage);
      setError(errorMessage);
      setMonthlyData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load trend data
  const loadTrendData = useCallback(async (currentMonth: string) => {
    if (!includeTrends) return;

    setIsLoadingTrends(true);

    try {
      console.log(`📈 Loading trend data for ${trendMonths} months ending at ${currentMonth}`);
      
      // Generate list of months for trends
      const trendMonthsList: string[] = [];
      const baseDate = new Date(currentMonth + '-01');
      
      for (let i = trendMonths - 1; i >= 0; i--) {
        const trendDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
        const trendMonth = trendDate.toISOString().slice(0, 7);
        trendMonthsList.push(trendMonth);
      }

      const trendData = await getMonthlyTrends(trendMonthsList);
      setTrends(trendData);
      console.log(`✅ Trend data loaded for ${trendData.length} months`);
    } catch (err) {
      console.error('❌ Error loading trend data:', err);
      setTrends([]);
    } finally {
      setIsLoadingTrends(false);
    }
  }, [includeTrends, trendMonths]);

  // Handle month change
  const setSelectedMonth = useCallback((month: string) => {
    console.log(`📅 Selected month changed to: ${month}`);
    setSelectedMonthState(month);
  }, []);

  // Refresh current data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadMonthlyData(selectedMonth),
      loadTrendData(selectedMonth)
    ]);
  }, [selectedMonth, loadMonthlyData, loadTrendData]);

  // Load data when selected month changes
  useEffect(() => {
    if (autoLoad) {
      loadMonthlyData(selectedMonth);
      loadTrendData(selectedMonth);
    }
  }, [selectedMonth, autoLoad, loadMonthlyData, loadTrendData]);

  return {
    selectedMonth,
    monthlyData,
    isLoading,
    error,
    setSelectedMonth,
    refreshData,
    trends,
    isLoadingTrends
  };
};

/**
 * Hook for comparing two months
 */
interface UseMonthComparisonReturn {
  primaryMonth: string;
  comparisonMonth: string;
  primaryData: MonthlyData | null;
  comparisonData: MonthlyData | null;
  isLoading: boolean;
  error: string | null;
  setPrimaryMonth: (month: string) => void;
  setComparisonMonth: (month: string) => void;
  comparison: {
    revenueGrowth: number;
    profitGrowth: number;
    invoiceGrowth: number;
    salaryGrowth: number;
  } | null;
}

export const useMonthComparison = (
  initialPrimary: string = getCurrentMonth(),
  initialComparison?: string
): UseMonthComparisonReturn => {
  const [primaryMonth, setPrimaryMonth] = useState(initialPrimary);
  const [comparisonMonth, setComparisonMonth] = useState(initialComparison || '');
  const [primaryData, setPrimaryData] = useState<MonthlyData | null>(null);
  const [comparisonData, setComparisonData] = useState<MonthlyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate comparison metrics
  const comparison = primaryData && comparisonData ? {
    revenueGrowth: comparisonData.revenue > 0 
      ? ((primaryData.revenue - comparisonData.revenue) / comparisonData.revenue) * 100 
      : 0,
    profitGrowth: comparisonData.netProfit > 0 
      ? ((primaryData.netProfit - comparisonData.netProfit) / comparisonData.netProfit) * 100 
      : 0,
    invoiceGrowth: comparisonData.invoiceCount > 0 
      ? ((primaryData.invoiceCount - comparisonData.invoiceCount) / comparisonData.invoiceCount) * 100 
      : 0,
    salaryGrowth: comparisonData.salary.total > 0 
      ? ((primaryData.salary.total - comparisonData.salary.total) / comparisonData.salary.total) * 100 
      : 0
  } : null;

  // Load comparison data
  const loadComparisonData = useCallback(async () => {
    if (!primaryMonth || !comparisonMonth) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔄 Loading comparison data: ${primaryMonth} vs ${comparisonMonth}`);
      
      const [primary, comparison] = await Promise.all([
        calculateMonthlyData(primaryMonth),
        calculateMonthlyData(comparisonMonth)
      ]);

      setPrimaryData(primary);
      setComparisonData(comparison);
      console.log(`✅ Comparison data loaded`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load comparison data';
      console.error('❌ Error loading comparison data:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [primaryMonth, comparisonMonth]);

  // Load data when months change
  useEffect(() => {
    loadComparisonData();
  }, [loadComparisonData]);

  return {
    primaryMonth,
    comparisonMonth,
    primaryData,
    comparisonData,
    isLoading,
    error,
    setPrimaryMonth,
    setComparisonMonth,
    comparison
  };
};

/**
 * Hook for dashboard monthly filtering
 */
export const useDashboardMonthFilter = () => {
  const {
    selectedMonth,
    monthlyData,
    isLoading,
    error,
    setSelectedMonth,
    refreshData
  } = useMonthlyData({
    initialMonth: getCurrentMonth(),
    autoLoad: true,
    includeTrends: false
  });

  // Format data for dashboard display
  const dashboardData = monthlyData ? {
    month: monthlyData.monthName,
    revenue: monthlyData.revenue,
    invoiceCount: monthlyData.invoiceCount,
    salary: monthlyData.salary,
    netProfit: monthlyData.netProfit,
    topClients: monthlyData.topClients.slice(0, 3), // Top 3 for dashboard
    hasData: monthlyData.invoiceCount > 0
  } : null;

  return {
    selectedMonth,
    setSelectedMonth,
    dashboardData,
    isLoading,
    error,
    refreshData
  };
};

export default useMonthlyData;
