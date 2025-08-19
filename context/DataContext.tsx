import React, { ReactNode, createContext, useContext, useState } from 'react';
import {
    Client,
    Invoice,
    ReportData,
    dummyClients,
    dummyInvoices,
    dummyReportData,
    generateClientId
} from '../data/dummyData';

interface DataContextType {
  // Data
  clients: Client[];
  invoices: Invoice[];
  reportData: ReportData;
  
  // Client operations
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  
  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByClientId: (clientId: string) => Invoice[];
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
  
  // Filtering
  filteredClients: Client[];
  filteredInvoices: Invoice[];
  setClientFilter: (filter: ClientFilter) => void;
  setInvoiceFilter: (filter: InvoiceFilter) => void;
  
  // Statistics
  getTotalRevenue: () => number;
  getTotalInvoices: () => number;
  getOutstandingAmount: () => number;
  getActiveClients: () => number;
}

interface ClientFilter {
  type?: Client['type'];
  status?: Client['status'];
  search?: string;
}

interface InvoiceFilter {
  status?: Invoice['status'];
  clientId?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(dummyClients);
  const [invoices, setInvoices] = useState<Invoice[]>(dummyInvoices);
  const [reportData] = useState<ReportData>(dummyReportData);
  
  const [clientFilter, setClientFilter] = useState<ClientFilter>({});
  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>({});

  // Client operations
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateClientId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    // Also delete related invoices
    setInvoices(prev => prev.filter(invoice => invoice.clientId !== id));
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  // Invoice operations
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: (invoices.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [...prev, newInvoice]);
    
    // Update client's invoice count and revenue
    const client = getClientById(invoiceData.clientId);
    if (client) {
      updateClient(client.id, {
        invoiceCount: client.invoiceCount + 1,
        totalRevenue: client.totalRevenue + invoiceData.totalAmount,
        lastInvoiceDate: invoiceData.issueDate,
      });
    }
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id ? { ...invoice, ...updates } : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    const invoice = getInvoiceById(id);
    if (invoice) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      
      // Update client's invoice count and revenue
      const client = getClientById(invoice.clientId);
      if (client) {
        updateClient(client.id, {
          invoiceCount: Math.max(0, client.invoiceCount - 1),
          totalRevenue: Math.max(0, client.totalRevenue - invoice.totalAmount),
        });
      }
    }
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const getInvoicesByClientId = (clientId: string) => {
    return invoices.filter(invoice => invoice.clientId === clientId);
  };

  const getInvoicesByStatus = (status: Invoice['status']) => {
    return invoices.filter(invoice => invoice.status === status);
  };

  // Filtering
  const filteredClients = clients.filter(client => {
    if (clientFilter.type && client.type !== clientFilter.type) return false;
    if (clientFilter.status && client.status !== clientFilter.status) return false;
    if (clientFilter.search) {
      const search = clientFilter.search.toLowerCase();
      return (
        client.name.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const filteredInvoices = invoices.filter(invoice => {
    if (invoiceFilter.status && invoice.status !== invoiceFilter.status) return false;
    if (invoiceFilter.clientId && invoice.clientId !== invoiceFilter.clientId) return false;
    if (invoiceFilter.search) {
      const search = invoiceFilter.search.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(search) ||
        invoice.clientName.toLowerCase().includes(search) ||
        invoice.description.toLowerCase().includes(search)
      );
    }
    if (invoiceFilter.dateRange) {
      const issueDate = new Date(invoice.issueDate);
      const startDate = new Date(invoiceFilter.dateRange.start);
      const endDate = new Date(invoiceFilter.dateRange.end);
      return issueDate >= startDate && issueDate <= endDate;
    }
    return true;
  });

  // Statistics
  const getTotalRevenue = () => {
    return clients.reduce((total, client) => total + client.totalRevenue, 0);
  };

  const getTotalInvoices = () => {
    return invoices.length;
  };

  const getOutstandingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((total, invoice) => total + invoice.totalAmount, 0);
  };

  const getActiveClients = () => {
    return clients.filter(client => client.status === 'active').length;
  };

  const value: DataContextType = {
    clients,
    invoices,
    reportData,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    getInvoicesByClientId,
    getInvoicesByStatus,
    filteredClients,
    filteredInvoices,
    setClientFilter,
    setInvoiceFilter,
    getTotalRevenue,
    getTotalInvoices,
    getOutstandingAmount,
    getActiveClients,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 