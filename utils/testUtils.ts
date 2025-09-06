/**
 * Test utilities for validating EagerInvoice calculations and data integrity
 * These functions can be used for debugging and validation
 */

import { ClientService, InvoiceService, SalaryService } from '../database/services';
import { calculateSalary, formatCurrency, paiseToRupees, rupeesToPaise, validateInvoiceAmount } from './calculationUtils';

export interface TestResult {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
}

export interface TestSuite {
  suiteName: string;
  results: TestResult[];
  passed: number;
  failed: number;
  total: number;
}

/**
 * Test currency conversion functions
 */
export const testCurrencyConversion = (): TestSuite => {
  const results: TestResult[] = [];
  
  // Test rupees to paise conversion
  results.push({
    testName: 'rupeesToPaise(100) should equal 10000',
    passed: rupeesToPaise(100) === 10000,
    expected: 10000,
    actual: rupeesToPaise(100)
  });

  results.push({
    testName: 'rupeesToPaise(15000) should equal 1500000',
    passed: rupeesToPaise(15000) === 1500000,
    expected: 1500000,
    actual: rupeesToPaise(15000)
  });

  // Test paise to rupees conversion
  results.push({
    testName: 'paiseToRupees(10000) should equal 100',
    passed: paiseToRupees(10000) === 100,
    expected: 100,
    actual: paiseToRupees(10000)
  });

  // Test round-trip conversion
  const originalAmount = 12345.67;
  const roundTrip = paiseToRupees(rupeesToPaise(originalAmount));
  results.push({
    testName: `Round-trip conversion should preserve value: ${originalAmount}`,
    passed: Math.abs(roundTrip - originalAmount) < 0.01,
    expected: originalAmount,
    actual: roundTrip
  });

  const passed = results.filter(r => r.passed).length;
  return {
    suiteName: 'Currency Conversion Tests',
    results,
    passed,
    failed: results.length - passed,
    total: results.length
  };
};

/**
 * Test salary calculation logic
 */
export const testSalaryCalculations = (): TestSuite => {
  const results: TestResult[] = [];

  // Test cases for different revenue levels
  const testCases = [
    { revenue: 0, expectedCommission: 0, expectedTotal: rupeesToPaise(15000) },
    { revenue: rupeesToPaise(25000), expectedCommission: rupeesToPaise(2500), expectedTotal: rupeesToPaise(17500) },
    { revenue: rupeesToPaise(50000), expectedCommission: rupeesToPaise(5000), expectedTotal: rupeesToPaise(20000) },
    { revenue: rupeesToPaise(75000), expectedCommission: rupeesToPaise(8750), expectedTotal: rupeesToPaise(23750) },
    { revenue: rupeesToPaise(100000), expectedCommission: rupeesToPaise(12500), expectedTotal: rupeesToPaise(27500) },
    { revenue: rupeesToPaise(150000), expectedCommission: rupeesToPaise(22500), expectedTotal: rupeesToPaise(37500) },
    { revenue: rupeesToPaise(300000), expectedCommission: rupeesToPaise(52500), expectedTotal: rupeesToPaise(60000) }, // Capped at 60k
  ];

  for (const testCase of testCases) {
    const salary = calculateSalary(testCase.revenue);
    
    results.push({
      testName: `Commission for revenue ₹${paiseToRupees(testCase.revenue).toLocaleString()}`,
      passed: salary.commission === testCase.expectedCommission,
      expected: testCase.expectedCommission,
      actual: salary.commission
    });

    results.push({
      testName: `Total salary for revenue ₹${paiseToRupees(testCase.revenue).toLocaleString()}`,
      passed: salary.total === testCase.expectedTotal,
      expected: testCase.expectedTotal,
      actual: salary.total
    });
  }

  const passed = results.filter(r => r.passed).length;
  return {
    suiteName: 'Salary Calculation Tests',
    results,
    passed,
    failed: results.length - passed,
    total: results.length
  };
};

/**
 * Test input validation
 */
export const testInputValidation = (): TestSuite => {
  const results: TestResult[] = [];

  const validationTests = [
    { input: '1000', expectedValid: true },
    { input: '0.01', expectedValid: true },
    { input: '999999', expectedValid: true },
    { input: '0', expectedValid: false },
    { input: '-100', expectedValid: false },
    { input: 'abc', expectedValid: false },
    { input: '', expectedValid: false },
    { input: '10000001', expectedValid: false }, // Above 1 crore limit
  ];

  for (const test of validationTests) {
    const result = validateInvoiceAmount(test.input);
    results.push({
      testName: `Validate input: "${test.input}"`,
      passed: result.isValid === test.expectedValid,
      expected: test.expectedValid,
      actual: result.isValid,
      error: result.error
    });
  }

  const passed = results.filter(r => r.passed).length;
  return {
    suiteName: 'Input Validation Tests',
    results,
    passed,
    failed: results.length - passed,
    total: results.length
  };
};

/**
 * Test currency formatting
 */
export const testCurrencyFormatting = (): TestSuite => {
  const results: TestResult[] = [];

  const formattingTests = [
    { input: rupeesToPaise(1000), expected: '₹1,000.00' },
    { input: rupeesToPaise(50000), expected: '₹50,000.00' },
    { input: rupeesToPaise(123456.78), expected: '₹1,23,456.78' },
    { input: 0, expected: '₹0.00' },
  ];

  for (const test of formattingTests) {
    const formatted = formatCurrency(test.input);
    results.push({
      testName: `Format ${paiseToRupees(test.input)} rupees`,
      passed: formatted === test.expected,
      expected: test.expected,
      actual: formatted
    });
  }

  const passed = results.filter(r => r.passed).length;
  return {
    suiteName: 'Currency Formatting Tests',
    results,
    passed,
    failed: results.length - passed,
    total: results.length
  };
};

/**
 * Test database operations (requires actual database)
 */
export const testDatabaseOperations = async (): Promise<TestSuite> => {
  const results: TestResult[] = [];

  try {
    // Test client operations
    const testClient = {
      name: 'Test Client',
      type: 'Mid' as const,
      startDate: new Date().toISOString().split('T')[0],
      notes: 'Test client for validation'
    };

    const clientId = await ClientService.create(testClient);
    results.push({
      testName: 'Create test client',
      passed: !!clientId,
      expected: 'truthy',
      actual: clientId
    });

    // Test invoice operations
    if (clientId) {
      const testInvoice = {
        clientId,
        amount: rupeesToPaise(25000),
        date: new Date().toISOString().split('T')[0]
      };

      const invoiceId = await InvoiceService.create(testInvoice);
      results.push({
        testName: 'Create test invoice',
        passed: !!invoiceId,
        expected: 'truthy',
        actual: invoiceId
      });

      // Test salary calculation
      const currentMonth = new Date().toISOString().slice(0, 7);
      const calculatedSalary = SalaryService.getCalculatedSalary(currentMonth);
      results.push({
        testName: 'Calculate salary for current month',
        passed: calculatedSalary.total > 0,
        expected: '> 0',
        actual: calculatedSalary.total
      });

      // Cleanup
      if (invoiceId) {
        try {
          await InvoiceService.delete(invoiceId);
        } catch (error) {
          console.warn('Failed to cleanup test invoice:', error);
        }
      }
    }

    // Cleanup client
    if (clientId) {
      try {
        await ClientService.delete(clientId);
      } catch (error) {
        console.warn('Failed to cleanup test client:', error);
      }
    }

  } catch (error) {
    results.push({
      testName: 'Database operations',
      passed: false,
      expected: 'no errors',
      actual: error,
      error: String(error)
    });
  }

  const passed = results.filter(r => r.passed).length;
  return {
    suiteName: 'Database Operations Tests',
    results,
    passed,
    failed: results.length - passed,
    total: results.length
  };
};

/**
 * Run all test suites
 */
export const runAllTests = async (): Promise<{
  suites: TestSuite[];
  totalPassed: number;
  totalFailed: number;
  totalTests: number;
  overallPassed: boolean;
}> => {
  console.log('🧪 Running EagerInvoice Test Suite...\n');

  const suites: TestSuite[] = [
    testCurrencyConversion(),
    testSalaryCalculations(),
    testInputValidation(),
    testCurrencyFormatting(),
    await testDatabaseOperations()
  ];

  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;

  for (const suite of suites) {
    totalPassed += suite.passed;
    totalFailed += suite.failed;
    totalTests += suite.total;

    console.log(`📋 ${suite.suiteName}: ${suite.passed}/${suite.total} passed`);
    
    // Log failed tests
    const failedTests = suite.results.filter(r => !r.passed);
    if (failedTests.length > 0) {
      console.log('   ❌ Failed tests:');
      for (const test of failedTests) {
        console.log(`      - ${test.testName}`);
        console.log(`        Expected: ${test.expected}, Got: ${test.actual}`);
        if (test.error) {
          console.log(`        Error: ${test.error}`);
        }
      }
    }
    console.log('');
  }

  const overallPassed = totalFailed === 0;
  console.log(`🎯 Overall Results: ${totalPassed}/${totalTests} tests passed`);
  console.log(`${overallPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`);

  return {
    suites,
    totalPassed,
    totalFailed,
    totalTests,
    overallPassed
  };
};

/**
 * Quick validation function for production use
 */
export const validateSystemIntegrity = async (): Promise<{
  isHealthy: boolean;
  issues: string[];
  warnings: string[];
}> => {
  const issues: string[] = [];
  const warnings: string[] = [];

  try {
    // Test basic calculations
    const testSalary = calculateSalary(rupeesToPaise(50000));
    if (testSalary.total !== rupeesToPaise(20000)) {
      issues.push('Salary calculation logic is incorrect');
    }

    // Test currency conversion
    if (paiseToRupees(rupeesToPaise(100)) !== 100) {
      issues.push('Currency conversion is not working correctly');
    }

    // Test database connectivity
    try {
      const clients = await ClientService.getAll();
      if (!Array.isArray(clients)) {
        issues.push('Database client operations are not working');
      }
    } catch (error) {
      issues.push(`Database connectivity issue: ${error}`);
    }

    // Test validation
    const validation = validateInvoiceAmount('1000');
    if (!validation.isValid) {
      issues.push('Input validation is not working correctly');
    }

  } catch (error) {
    issues.push(`System validation error: ${error}`);
  }

  return {
    isHealthy: issues.length === 0,
    issues,
    warnings
  };
};

export default {
  runAllTests,
  validateSystemIntegrity,
  testCurrencyConversion,
  testSalaryCalculations,
  testInputValidation,
  testCurrencyFormatting,
  testDatabaseOperations
};
