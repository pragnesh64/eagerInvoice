/**
 * Commission Calculation Testing and Validation Utilities
 * Ensures commission and profit calculations are working correctly
 */

import { calculateSalary, paiseToRupees, rupeesToPaise } from './calculationUtils';

export interface CommissionTestCase {
  revenue: number; // in rupees
  expectedCommission: number; // in rupees
  expectedTotal: number; // in rupees (retainer + commission, capped at 60k)
  description: string;
}

/**
 * Test cases for commission calculation validation
 */
export const COMMISSION_TEST_CASES: CommissionTestCase[] = [
  {
    revenue: 0,
    expectedCommission: 0,
    expectedTotal: 15000,
    description: 'Zero revenue'
  },
  {
    revenue: 10000,
    expectedCommission: 1000, // 10% of 10,000
    expectedTotal: 16000, // 15,000 + 1,000
    description: 'Low revenue (10% tier)'
  },
  {
    revenue: 25000,
    expectedCommission: 2500, // 10% of 25,000
    expectedTotal: 17500, // 15,000 + 2,500
    description: 'Mid-low revenue (10% tier)'
  },
  {
    revenue: 50000,
    expectedCommission: 5000, // 10% of 50,000
    expectedTotal: 20000, // 15,000 + 5,000
    description: 'Tier 1 maximum (10% tier)'
  },
  {
    revenue: 60000,
    expectedCommission: 6500, // (50,000 * 10%) + (10,000 * 15%) = 5,000 + 1,500
    expectedTotal: 21500, // 15,000 + 6,500
    description: 'Tier 2 start (mixed 10% + 15%)'
  },
  {
    revenue: 75000,
    expectedCommission: 8750, // (50,000 * 10%) + (25,000 * 15%) = 5,000 + 3,750
    expectedTotal: 23750, // 15,000 + 8,750
    description: 'Mid tier 2 (mixed 10% + 15%)'
  },
  {
    revenue: 100000,
    expectedCommission: 12500, // (50,000 * 10%) + (50,000 * 15%) = 5,000 + 7,500
    expectedTotal: 27500, // 15,000 + 12,500
    description: 'Tier 2 maximum (mixed 10% + 15%)'
  },
  {
    revenue: 120000,
    expectedCommission: 16500, // (50,000 * 10%) + (50,000 * 15%) + (20,000 * 20%) = 5,000 + 7,500 + 4,000
    expectedTotal: 31500, // 15,000 + 16,500
    description: 'Tier 3 start (mixed 10% + 15% + 20%)'
  },
  {
    revenue: 150000,
    expectedCommission: 22500, // (50,000 * 10%) + (50,000 * 15%) + (50,000 * 20%) = 5,000 + 7,500 + 10,000
    expectedTotal: 37500, // 15,000 + 22,500
    description: 'High tier 3 (mixed 10% + 15% + 20%)'
  },
  {
    revenue: 200000,
    expectedCommission: 32500, // (50,000 * 10%) + (50,000 * 15%) + (100,000 * 20%) = 5,000 + 7,500 + 20,000
    expectedTotal: 47500, // 15,000 + 32,500
    description: 'Very high revenue (mixed 10% + 15% + 20%)'
  },
  {
    revenue: 300000,
    expectedCommission: 52500, // (50,000 * 10%) + (50,000 * 15%) + (200,000 * 20%) = 5,000 + 7,500 + 40,000
    expectedTotal: 60000, // 15,000 + 52,500 = 67,500, but capped at 60,000
    description: 'Revenue that hits the salary cap'
  },
  {
    revenue: 500000,
    expectedCommission: 92500, // (50,000 * 10%) + (50,000 * 15%) + (400,000 * 20%) = 5,000 + 7,500 + 80,000
    expectedTotal: 60000, // Capped at 60,000 regardless of commission
    description: 'Very high revenue (salary capped)'
  }
];

/**
 * Run commission calculation tests
 */
export const testCommissionCalculations = (): {
  passed: number;
  failed: number;
  total: number;
  failures: Array<{
    testCase: CommissionTestCase;
    actualCommission: number;
    actualTotal: number;
    error: string;
  }>;
} => {
  const failures: Array<{
    testCase: CommissionTestCase;
    actualCommission: number;
    actualTotal: number;
    error: string;
  }> = [];

  let passed = 0;
  let failed = 0;

  console.log('🧪 Testing Commission Calculations...\n');

  for (const testCase of COMMISSION_TEST_CASES) {
    try {
      const revenueInPaise = rupeesToPaise(testCase.revenue);
      const salaryBreakdown = calculateSalary(revenueInPaise);
      
      const actualCommission = paiseToRupees(salaryBreakdown.commission);
      const actualTotal = paiseToRupees(salaryBreakdown.total);

      // Check commission calculation
      const commissionMatch = Math.abs(actualCommission - testCase.expectedCommission) < 0.01;
      const totalMatch = Math.abs(actualTotal - testCase.expectedTotal) < 0.01;

      if (commissionMatch && totalMatch) {
        passed++;
        console.log(`✅ ${testCase.description}: Revenue ₹${testCase.revenue.toLocaleString()} → Commission ₹${actualCommission.toLocaleString()} → Total ₹${actualTotal.toLocaleString()}`);
      } else {
        failed++;
        const error = `Expected commission: ₹${testCase.expectedCommission.toLocaleString()}, got: ₹${actualCommission.toLocaleString()}. Expected total: ₹${testCase.expectedTotal.toLocaleString()}, got: ₹${actualTotal.toLocaleString()}`;
        
        failures.push({
          testCase,
          actualCommission,
          actualTotal,
          error
        });

        console.log(`❌ ${testCase.description}: ${error}`);
      }
    } catch (error) {
      failed++;
      failures.push({
        testCase,
        actualCommission: 0,
        actualTotal: 0,
        error: String(error)
      });
      console.log(`❌ ${testCase.description}: Error - ${error}`);
    }
  }

  const total = COMMISSION_TEST_CASES.length;
  console.log(`\n📊 Commission Test Results: ${passed}/${total} passed, ${failed} failed`);

  return { passed, failed, total, failures };
};

/**
 * Validate commission calculation for a specific revenue amount
 */
export const validateCommissionForRevenue = (revenueInRupees: number): {
  isValid: boolean;
  calculatedCommission: number;
  calculatedTotal: number;
  expectedCommission: number;
  breakdown: string;
} => {
  const revenueInPaise = rupeesToPaise(revenueInRupees);
  const salaryBreakdown = calculateSalary(revenueInPaise);
  
  const calculatedCommission = paiseToRupees(salaryBreakdown.commission);
  const calculatedTotal = paiseToRupees(salaryBreakdown.total);

  // Calculate expected commission manually
  let expectedCommission = 0;
  let breakdown = '';

  if (revenueInRupees <= 50000) {
    expectedCommission = revenueInRupees * 0.10;
    breakdown = `₹${revenueInRupees.toLocaleString()} × 10% = ₹${expectedCommission.toLocaleString()}`;
  } else if (revenueInRupees <= 100000) {
    const tier1 = 50000 * 0.10;
    const tier2 = (revenueInRupees - 50000) * 0.15;
    expectedCommission = tier1 + tier2;
    breakdown = `(₹50,000 × 10%) + (₹${(revenueInRupees - 50000).toLocaleString()} × 15%) = ₹${tier1.toLocaleString()} + ₹${tier2.toLocaleString()} = ₹${expectedCommission.toLocaleString()}`;
  } else {
    const tier1 = 50000 * 0.10;
    const tier2 = 50000 * 0.15;
    const tier3 = (revenueInRupees - 100000) * 0.20;
    expectedCommission = tier1 + tier2 + tier3;
    breakdown = `(₹50,000 × 10%) + (₹50,000 × 15%) + (₹${(revenueInRupees - 100000).toLocaleString()} × 20%) = ₹${tier1.toLocaleString()} + ₹${tier2.toLocaleString()} + ₹${tier3.toLocaleString()} = ₹${expectedCommission.toLocaleString()}`;
  }

  const isValid = Math.abs(calculatedCommission - expectedCommission) < 0.01;

  return {
    isValid,
    calculatedCommission,
    calculatedTotal,
    expectedCommission,
    breakdown
  };
};

/**
 * Generate a commission calculation report
 */
export const generateCommissionReport = (revenueAmounts: number[]): string => {
  let report = '# Commission Calculation Report\n\n';
  report += 'Generated on: ' + new Date().toLocaleDateString() + '\n\n';
  
  report += '## Commission Structure\n';
  report += '- **Retainer**: ₹15,000/month (fixed)\n';
  report += '- **Commission Tiers**:\n';
  report += '  - Up to ₹50,000: 10%\n';
  report += '  - ₹50,001 to ₹100,000: 15% (on excess)\n';
  report += '  - Above ₹100,000: 20% (on excess)\n';
  report += '- **Maximum Total Salary**: ₹60,000/month\n\n';

  report += '## Calculation Examples\n\n';

  for (const revenue of revenueAmounts) {
    const validation = validateCommissionForRevenue(revenue);
    report += `### Revenue: ₹${revenue.toLocaleString()}\n`;
    report += `- **Commission Calculation**: ${validation.breakdown}\n`;
    report += `- **Calculated Commission**: ₹${validation.calculatedCommission.toLocaleString()}\n`;
    report += `- **Total Salary**: ₹15,000 + ₹${validation.calculatedCommission.toLocaleString()} = ₹${validation.calculatedTotal.toLocaleString()}\n`;
    report += `- **Status**: ${validation.isValid ? '✅ Correct' : '❌ Error'}\n\n`;
  }

  return report;
};

/**
 * Quick validation function for production use
 */
export const quickCommissionCheck = (): boolean => {
  const criticalTests = [
    { revenue: 25000, expectedCommission: 2500 },
    { revenue: 75000, expectedCommission: 8750 },
    { revenue: 150000, expectedCommission: 22500 },
    { revenue: 300000, expectedTotal: 60000 } // This should be capped
  ];

  for (const test of criticalTests) {
    const revenueInPaise = rupeesToPaise(test.revenue);
    const salaryBreakdown = calculateSalary(revenueInPaise);
    
    if (test.expectedCommission) {
      const actualCommission = paiseToRupees(salaryBreakdown.commission);
      if (Math.abs(actualCommission - test.expectedCommission) > 0.01) {
        console.error(`❌ Commission calculation error for revenue ₹${test.revenue}: expected ₹${test.expectedCommission}, got ₹${actualCommission}`);
        return false;
      }
    }

    if (test.expectedTotal) {
      const actualTotal = paiseToRupees(salaryBreakdown.total);
      if (Math.abs(actualTotal - test.expectedTotal) > 0.01) {
        console.error(`❌ Total salary calculation error for revenue ₹${test.revenue}: expected ₹${test.expectedTotal}, got ₹${actualTotal}`);
        return false;
      }
    }
  }

  console.log('✅ Quick commission check passed');
  return true;
};

export default {
  testCommissionCalculations,
  validateCommissionForRevenue,
  generateCommissionReport,
  quickCommissionCheck,
  COMMISSION_TEST_CASES
};
