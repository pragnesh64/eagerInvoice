// Simplified data models for EagerInvoice based on client requirements

export interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  startDate: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNo: string;
  amount: number;
  date: string;
}

export interface Salary {
  month: string;
  retainer: number;     // always 15000
  commission: number;   // based on tier rules
  total: number;        // capped at 60000
}

export interface ReportData {
  monthlyRevenue: number;
  totalInvoices: number;
  totalClients: number;
  salary: Salary;
  netProfit: number;
  topClients: Array<{
    clientId: string;
    clientName: string;
    revenue: number;
    percentage: number;
  }>;
}

// Dummy data
export const dummyClients: Client[] = [
  {
    id: '1',
    name: 'TechStart Solutions',
    type: 'Core',
    startDate: '2024-01-15',
    notes: 'Web development project',
  },
  {
    id: '2',
    name: 'Design Studio Pro',
    type: 'Mid',
    startDate: '2024-02-01',
    notes: 'UI/UX design services',
  },
  {
    id: '3',
    name: 'Digital Marketing Co',
    type: 'Large Retainer',
    startDate: '2024-01-01',
    notes: 'Monthly marketing services',
  },
  {
    id: '4',
    name: 'Mobile App Dev',
    type: 'Micro',
    startDate: '2024-03-01',
    notes: 'iOS app development',
  },
  {
    id: '5',
    name: 'E-commerce Platform',
    type: 'Core',
    startDate: '2024-02-15',
    notes: 'Online store development',
  },
];

export const dummyInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'TechStart Solutions',
    invoiceNo: 'INV-001',
    amount: 25000,
    date: '2024-01-15',
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Design Studio Pro',
    invoiceNo: 'INV-002',
    amount: 15000,
    date: '2024-02-01',
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Digital Marketing Co',
    invoiceNo: 'INV-003',
    amount: 35000,
    date: '2024-01-01',
  },
  {
    id: '4',
    clientId: '1',
    clientName: 'TechStart Solutions',
    invoiceNo: 'INV-004',
    amount: 30000,
    date: '2024-02-15',
  },
  {
    id: '5',
    clientId: '4',
    clientName: 'Mobile App Dev',
    invoiceNo: 'INV-005',
    amount: 20000,
    date: '2024-03-01',
  },
  {
    id: '6',
    clientId: '5',
    clientName: 'E-commerce Platform',
    invoiceNo: 'INV-006',
    amount: 40000,
    date: '2024-02-15',
  },
  {
    id: '7',
    clientId: '3',
    clientName: 'Digital Marketing Co',
    invoiceNo: 'INV-007',
    amount: 35000,
    date: '2024-02-01',
  },
  {
    id: '8',
    clientId: '2',
    clientName: 'Design Studio Pro',
    invoiceNo: 'INV-008',
    amount: 18000,
    date: '2024-03-01',
  },
];

// Helper functions
export const getClientById = (id: string): Client | undefined => {
  return dummyClients.find(client => client.id === id);
};

export const getInvoicesByClientId = (clientId: string): Invoice[] => {
  return dummyInvoices.filter(invoice => invoice.clientId === clientId);
};

export const getTotalRevenue = (): number => {
  return dummyInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
};

export const getTotalInvoices = (): number => {
  return dummyInvoices.length;
};

export const generateInvoiceNumber = (): string => {
  const nextNumber = dummyInvoices.length + 1;
  return `INV-${nextNumber.toString().padStart(3, '0')}`;
};

export const generateClientId = (): string => {
  const nextNumber = dummyClients.length + 1;
  return nextNumber.toString();
};

// Salary calculation logic
export const calculateSalary = (monthlyRevenue: number): Salary => {
  const retainer = 15000; // Fixed retainer
  let commission = 0;
  
  // Commission calculation based on revenue tiers
  if (monthlyRevenue <= 50000) {
    commission = monthlyRevenue * 0.10; // 10% for first 50k
  } else if (monthlyRevenue <= 100000) {
    commission = 5000 + (monthlyRevenue - 50000) * 0.15; // 10% on first 50k + 15% on rest
  } else {
    commission = 12500 + (monthlyRevenue - 100000) * 0.20; // 10% on first 50k + 15% on next 50k + 20% on rest
  }
  
  const total = Math.min(retainer + commission, 60000); // Cap at 60k
  
  return {
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    retainer,
    commission: Math.min(commission, 45000), // Commission capped at 45k (60k - 15k retainer)
    total,
  };
};

// Generate report data
export const generateReportData = (): ReportData => {
  const monthlyRevenue = getTotalRevenue();
  const salary = calculateSalary(monthlyRevenue);
  const netProfit = monthlyRevenue - salary.total;
  
  // Calculate top clients
  const clientRevenue = dummyClients.map(client => {
    const clientInvoices = getInvoicesByClientId(client.id);
    const revenue = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    return {
      clientId: client.id,
      clientName: client.name,
      revenue,
      percentage: monthlyRevenue > 0 ? (revenue / monthlyRevenue) * 100 : 0,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  
  return {
    monthlyRevenue,
    totalInvoices: getTotalInvoices(),
    totalClients: dummyClients.length,
    salary,
    netProfit,
    topClients: clientRevenue,
  };
};

export const dummyReportData = generateReportData(); 