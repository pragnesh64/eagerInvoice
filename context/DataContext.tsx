import React, { ReactNode, createContext, useContext, useState } from 'react';
import {
    Client,
    Invoice,
    ReportData,
    calculateSalary,
    dummyClients,
    dummyInvoices,
    dummyReportData,
    generateClientId,
    generateReportData
} from '../data/dummyData';

interface DataContextType {
  clients: Client[];
  invoices: Invoice[];
  reportData: ReportData;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByClientId: (clientId: string) => Invoice[];
  filteredClients: Client[];
  filteredInvoices: Invoice[];
  setClientFilter: (filter: ClientFilter) => void;
  setInvoiceFilter: (filter: InvoiceFilter) => void;
  getTotalRevenue: () => number;
  getTotalInvoices: () => number;
  getSalary: () => any;
  getNetProfit: () => number;
  getActiveClients: () => number;
}

interface ClientFilter {
  search?: string;
  type?: Client['type'];
}

interface InvoiceFilter {
  search?: string;
  clientId?: string;
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
  const [reportData, setReportData] = useState<ReportData>(dummyReportData);
  
  const [clientFilter, setClientFilterState] = useState<ClientFilter>({});
  const [invoiceFilter, setInvoiceFilterState] = useState<InvoiceFilter>({});

  // Filtered data
  const filteredClients = clients.filter(client => {
    if (clientFilter.search) {
      const searchLower = clientFilter.search.toLowerCase();
      if (!client.name.toLowerCase().includes(searchLower) &&
          !client.notes?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (clientFilter.type && client.type !== clientFilter.type) {
      return false;
    }
    return true;
  });

  const filteredInvoices = invoices.filter(invoice => {
    if (invoiceFilter.search) {
      const searchLower = invoiceFilter.search.toLowerCase();
      if (!invoice.invoiceNo.toLowerCase().includes(searchLower) &&
          !invoice.clientName.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (invoiceFilter.clientId && invoice.clientId !== invoiceFilter.clientId) {
      return false;
    }
    return true;
  });

  // Client operations
  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateClientId(),
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    updateReportData(updatedClients, invoices);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...updates } : client
    );
    setClients(updatedClients);
    updateReportData(updatedClients, invoices);
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    const updatedInvoices = invoices.filter(invoice => invoice.clientId !== id);
    setClients(updatedClients);
    setInvoices(updatedInvoices);
    updateReportData(updatedClients, updatedInvoices);
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  // Invoice operations
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
    };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    updateReportData(clients, updatedInvoices);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...updates } : invoice
    );
    setInvoices(updatedInvoices);
    updateReportData(clients, updatedInvoices);
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(updatedInvoices);
    updateReportData(clients, updatedInvoices);
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const getInvoicesByClientId = (clientId: string) => {
    return invoices.filter(invoice => invoice.clientId === clientId);
  };

  // Filter operations
  const setClientFilter = (filter: ClientFilter) => {
    setClientFilterState(filter);
  };

  const setInvoiceFilter = (filter: InvoiceFilter) => {
    setInvoiceFilterState(filter);
  };

  // Calculations
  const getTotalRevenue = () => {
    return invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getTotalInvoices = () => {
    return invoices.length;
  };

  const getSalary = () => {
    const monthlyRevenue = getTotalRevenue();
    return calculateSalary(monthlyRevenue);
  };

  const getNetProfit = () => {
    const monthlyRevenue = getTotalRevenue();
    const salary = calculateSalary(monthlyRevenue);
    return monthlyRevenue - salary.total;
  };

  const getActiveClients = () => {
    return clients.length;
  };

  // Update report data when data changes
  const updateReportData = (updatedClients: Client[], updatedInvoices: Invoice[]) => {
    const newReportData = generateReportData();
    setReportData(newReportData);
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
    filteredClients,
    filteredInvoices,
    setClientFilter,
    setInvoiceFilter,
    getTotalRevenue,
    getTotalInvoices,
    getSalary,
    getNetProfit,
    getActiveClients,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 