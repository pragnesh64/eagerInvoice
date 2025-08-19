// Types for our data structures
export interface Client {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'company' | 'startup' | 'enterprise';
  phone?: string;
  address?: string;
  totalRevenue: number;
  invoiceCount: number;
  lastInvoiceDate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  tax: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  description: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ReportData {
  monthlyRevenue: MonthlyData[];
  topClients: TopClientData[];
  paymentStatus: PaymentStatusData;
  invoiceStats: InvoiceStats;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface TopClientData {
  clientId: string;
  clientName: string;
  revenue: number;
  invoiceCount: number;
  percentage: number;
}

export interface PaymentStatusData {
  paid: { amount: number; count: number; percentage: number };
  pending: { amount: number; count: number; percentage: number };
  overdue: { amount: number; count: number; percentage: number };
  draft: { amount: number; count: number; percentage: number };
}

export interface InvoiceStats {
  total: number;
  thisMonth: number;
  thisYear: number;
  outstanding: number;
}

// Dummy Clients Data
export const dummyClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    type: 'enterprise',
    totalRevenue: 45000,
    invoiceCount: 12,
    lastInvoiceDate: '2024-01-15',
    status: 'active',
    createdAt: '2023-06-15',
  },
  {
    id: '2',
    name: 'TechStart Inc',
    email: 'hello@techstart.com',
    phone: '+1 (555) 234-5678',
    address: '456 Innovation St, San Francisco, CA 94102',
    type: 'startup',
    totalRevenue: 28000,
    invoiceCount: 8,
    lastInvoiceDate: '2024-01-14',
    status: 'active',
    createdAt: '2023-08-20',
  },
  {
    id: '3',
    name: 'Design Studio Pro',
    email: 'info@designstudio.com',
    phone: '+1 (555) 345-6789',
    address: '789 Creative Blvd, Los Angeles, CA 90210',
    type: 'company',
    totalRevenue: 32000,
    invoiceCount: 15,
    lastInvoiceDate: '2024-01-13',
    status: 'active',
    createdAt: '2023-07-10',
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@smith.com',
    phone: '+1 (555) 456-7890',
    address: '321 Personal Dr, Austin, TX 73301',
    type: 'individual',
    totalRevenue: 8500,
    invoiceCount: 3,
    lastInvoiceDate: '2024-01-12',
    status: 'active',
    createdAt: '2023-11-05',
  },
  {
    id: '5',
    name: 'Global Solutions',
    email: 'contact@globalsolutions.com',
    phone: '+1 (555) 567-8901',
    address: '654 Corporate Way, Chicago, IL 60601',
    type: 'enterprise',
    totalRevenue: 67000,
    invoiceCount: 20,
    lastInvoiceDate: '2024-01-11',
    status: 'active',
    createdAt: '2023-05-12',
  },
  {
    id: '6',
    name: 'Sarah Johnson',
    email: 'sarah@johnson.com',
    phone: '+1 (555) 678-9012',
    address: '987 Freelance Ln, Portland, OR 97201',
    type: 'individual',
    totalRevenue: 12000,
    invoiceCount: 5,
    lastInvoiceDate: '2024-01-10',
    status: 'active',
    createdAt: '2023-09-15',
  },
  {
    id: '7',
    name: 'Innovation Labs',
    email: 'hello@innovationlabs.com',
    phone: '+1 (555) 789-0123',
    address: '147 Tech Park, Seattle, WA 98101',
    type: 'startup',
    totalRevenue: 18000,
    invoiceCount: 7,
    lastInvoiceDate: '2024-01-09',
    status: 'active',
    createdAt: '2023-10-08',
  },
  {
    id: '8',
    name: 'Marketing Masters',
    email: 'info@marketingmasters.com',
    phone: '+1 (555) 890-1234',
    address: '258 Marketing Ave, Miami, FL 33101',
    type: 'company',
    totalRevenue: 25000,
    invoiceCount: 10,
    lastInvoiceDate: '2024-01-08',
    status: 'inactive',
    createdAt: '2023-04-22',
  },
];

// Dummy Invoices Data
export const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientId: '1',
    clientName: 'Acme Corporation',
    amount: 2500,
    tax: 250,
    totalAmount: 2750,
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'pending',
    description: 'Website Development Services',
    items: [
      {
        id: '1',
        description: 'Frontend Development',
        quantity: 40,
        unitPrice: 50,
        total: 2000,
      },
      {
        id: '2',
        description: 'UI/UX Design',
        quantity: 10,
        unitPrice: 50,
        total: 500,
      },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    clientId: '2',
    clientName: 'TechStart Inc',
    amount: 1800,
    tax: 180,
    totalAmount: 1980,
    issueDate: '2024-01-14',
    dueDate: '2024-02-14',
    status: 'paid',
    description: 'Mobile App Development',
    items: [
      {
        id: '3',
        description: 'iOS Development',
        quantity: 30,
        unitPrice: 60,
        total: 1800,
      },
    ],
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    clientId: '3',
    clientName: 'Design Studio Pro',
    amount: 3200,
    tax: 320,
    totalAmount: 3520,
    issueDate: '2024-01-13',
    dueDate: '2024-02-13',
    status: 'overdue',
    description: 'Brand Identity Design',
    items: [
      {
        id: '4',
        description: 'Logo Design',
        quantity: 1,
        unitPrice: 800,
        total: 800,
      },
      {
        id: '5',
        description: 'Brand Guidelines',
        quantity: 1,
        unitPrice: 1200,
        total: 1200,
      },
      {
        id: '6',
        description: 'Marketing Materials',
        quantity: 20,
        unitPrice: 60,
        total: 1200,
      },
    ],
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    clientId: '5',
    clientName: 'Global Solutions',
    amount: 4500,
    tax: 450,
    totalAmount: 4950,
    issueDate: '2024-01-12',
    dueDate: '2024-02-12',
    status: 'paid',
    description: 'Enterprise Software Development',
    items: [
      {
        id: '7',
        description: 'Backend Development',
        quantity: 60,
        unitPrice: 75,
        total: 4500,
      },
    ],
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    clientId: '4',
    clientName: 'John Smith',
    amount: 1200,
    tax: 120,
    totalAmount: 1320,
    issueDate: '2024-01-11',
    dueDate: '2024-02-11',
    status: 'draft',
    description: 'Consulting Services',
    items: [
      {
        id: '8',
        description: 'Business Strategy Consulting',
        quantity: 8,
        unitPrice: 150,
        total: 1200,
      },
    ],
    createdAt: '2024-01-11',
  },
  {
    id: '6',
    invoiceNumber: 'INV-006',
    clientId: '6',
    clientName: 'Sarah Johnson',
    amount: 800,
    tax: 80,
    totalAmount: 880,
    issueDate: '2024-01-10',
    dueDate: '2024-02-10',
    status: 'paid',
    description: 'Content Writing Services',
    items: [
      {
        id: '9',
        description: 'Blog Posts (4 articles)',
        quantity: 4,
        unitPrice: 200,
        total: 800,
      },
    ],
    createdAt: '2024-01-10',
  },
  {
    id: '7',
    invoiceNumber: 'INV-007',
    clientId: '7',
    clientName: 'Innovation Labs',
    amount: 2200,
    tax: 220,
    totalAmount: 2420,
    issueDate: '2024-01-09',
    dueDate: '2024-02-09',
    status: 'pending',
    description: 'AI Integration Services',
    items: [
      {
        id: '10',
        description: 'AI Model Development',
        quantity: 25,
        unitPrice: 88,
        total: 2200,
      },
    ],
    createdAt: '2024-01-09',
  },
  {
    id: '8',
    invoiceNumber: 'INV-008',
    clientId: '1',
    clientName: 'Acme Corporation',
    amount: 3000,
    tax: 300,
    totalAmount: 3300,
    issueDate: '2024-01-08',
    dueDate: '2024-02-08',
    status: 'paid',
    description: 'E-commerce Platform Development',
    items: [
      {
        id: '11',
        description: 'Platform Development',
        quantity: 50,
        unitPrice: 60,
        total: 3000,
      },
    ],
    createdAt: '2024-01-08',
  },
];

// Reports Data
export const dummyReportData: ReportData = {
  monthlyRevenue: [
    { month: 'Jan', revenue: 125000, expenses: 37500, profit: 87500 },
    { month: 'Feb', revenue: 118000, expenses: 35000, profit: 83000 },
    { month: 'Mar', revenue: 132000, expenses: 40000, profit: 92000 },
    { month: 'Apr', revenue: 145000, expenses: 42000, profit: 103000 },
    { month: 'May', revenue: 138000, expenses: 41000, profit: 97000 },
    { month: 'Jun', revenue: 152000, expenses: 45000, profit: 107000 },
  ],
  topClients: [
    { clientId: '1', clientName: 'Acme Corporation', revenue: 45000, invoiceCount: 12, percentage: 36 },
    { clientId: '5', clientName: 'Global Solutions', revenue: 32000, invoiceCount: 8, percentage: 26 },
    { clientId: '2', clientName: 'TechStart Inc', revenue: 28000, invoiceCount: 6, percentage: 22 },
    { clientId: '3', clientName: 'Design Studio Pro', revenue: 20000, invoiceCount: 5, percentage: 16 },
  ],
  paymentStatus: {
    paid: { amount: 87500, count: 12, percentage: 70 },
    pending: { amount: 25000, count: 4, percentage: 20 },
    overdue: { amount: 12500, count: 2, percentage: 10 },
    draft: { amount: 0, count: 0, percentage: 0 },
  },
  invoiceStats: {
    total: 156,
    thisMonth: 18,
    thisYear: 156,
    outstanding: 42000,
  },
};

// Helper functions
export const getClientById = (id: string): Client | undefined => {
  return dummyClients.find(client => client.id === id);
};

export const getInvoicesByClientId = (clientId: string): Invoice[] => {
  return dummyInvoices.filter(invoice => invoice.clientId === clientId);
};

export const getInvoicesByStatus = (status: Invoice['status']): Invoice[] => {
  return dummyInvoices.filter(invoice => invoice.status === status);
};

export const getTotalRevenue = (): number => {
  return dummyClients.reduce((total, client) => total + client.totalRevenue, 0);
};

export const getTotalInvoices = (): number => {
  return dummyInvoices.length;
};

export const getOutstandingAmount = (): number => {
  return dummyInvoices
    .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
    .reduce((total, invoice) => total + invoice.totalAmount, 0);
};

export const generateInvoiceNumber = (): string => {
  const nextNumber = dummyInvoices.length + 1;
  return `INV-${nextNumber.toString().padStart(3, '0')}`;
};

export const generateClientId = (): string => {
  const nextNumber = dummyClients.length + 1;
  return nextNumber.toString();
}; 