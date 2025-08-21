# EagerInvoice - Client Invoice & Salary Management

## 1. Project Overview

A minimal mobile app built with **React Native (Expo)** to help track:

* Clients
* Invoices
* Mohit's salary (Retainer + Commission)
* Net Profit

Focus is on **simplicity, clarity, and automation**.

## 2. Core Features

### 🔹 Client Management

* Add client (Name, Type, Start Date, Notes)
* Categorize by project type:
  * Micro
  * Mid
  * Core
  * Large Retainer

### 🔹 Invoice Management

* Add invoices (Client, Invoice Number, Amount, Date)
* Link invoices to clients
* Track revenue automatically

### 🔹 Salary Calculator

* Fixed monthly retainer: **₹15,000**
* Commission: **Tiered system**
  * 10% up to ₹50,000
  * 15% for ₹50,000–₹100,000
  * 20% above ₹100,000
* Salary cap: **₹60,000/month**

### 🔹 Dashboard

* Monthly summary:
  * Revenue
  * Salary
  * Net Profit
* Recent invoices
* Top clients

### 🔹 Reports

* Client-wise breakdown
* Export to PDF/CSV
* Monthly revenue analysis
* Salary breakdown

## 3. UI/UX Design

### 📱 Navigation

Bottom Tabs:
* Dashboard
* Clients
* Invoices
* Reports

### 📊 Dashboard Layout

```
Monthly Overview
---------------
Revenue (This Month): ₹2,40,000
Mohit's Salary: ₹38,000
Net Profit: ₹2,02,000

Recent Activity
--------------
[Last 3 invoices]
[Top 2 clients]
```

### 📋 Client View

```
Client List
----------
[Client Card]
- Name
- Type Badge
- Total Revenue
- Invoice Count
- Last Invoice Date
```

### 📝 Invoice View

```
Invoice List
-----------
[Invoice Card]
- Invoice Number
- Client Name
- Amount
- Date
```

### 📈 Reports View

```
Export Options
-------------
[PDF] [CSV]

Monthly Overview
--------------
Revenue: ₹XXX
Salary: ₹XXX
Net Profit: ₹XXX

Client Performance
----------------
[Top clients by revenue]
```

## 4. Data Model

### Client
```typescript
{
  id: string,
  name: string,
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer',
  startDate: string,
  notes?: string
}
```

### Invoice
```typescript
{
  id: string,
  clientId: string,
  invoiceNo: string,
  amount: number,
  date: string
}
```

### Salary
```typescript
{
  month: string,
  retainer: 15000,
  commission: number,  // Based on revenue tiers
  total: number       // Capped at 60000
}
```

### Report
```typescript
{
  monthlyRevenue: number,
  totalInvoices: number,
  totalClients: number,
  salary: Salary,
  netProfit: number,
  topClients: Array<{
    clientId: string,
    clientName: string,
    revenue: number,
    percentage: number
  }>
}
```

## 4. Data Storage

### SQLite Database

The app uses SQLite for local data storage with the following features:

1. **Offline-First**: All data is stored locally on the device
2. **Data Models**:
   - Clients (name, type, start date)
   - Invoices (number, amount, date)
   - Salary Records (monthly retainer + commission)

3. **Automatic Calculations**:
   - Monthly revenue tracking
   - Commission calculation based on tiers
   - Salary capping at ₹60,000

4. **Data Export**:
   - CSV export for clients and invoices
   - PDF reports with monthly analysis
   - Database backup and restore

### Database Schema

```sql
-- Clients table
CREATE TABLE clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('Micro', 'Mid', 'Core', 'Large Retainer')) NOT NULL,
    start_date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    invoice_no TEXT NOT NULL UNIQUE,
    client_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Salary records table
CREATE TABLE salary_records (
    id TEXT PRIMARY KEY,
    month TEXT NOT NULL UNIQUE,
    retainer INTEGER NOT NULL,
    commission INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Data Security

1. **Local Storage**: All data is stored securely on the device
2. **Backup**: Regular automatic backups
3. **Data Validation**: Input validation and sanitization
4. **Error Handling**: Comprehensive error handling and logging

## 5. Technical Details

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on mobile device

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/pragnesh64/eagerInvoice.git
   cd eagerInvoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan QR code with Expo Go app

### Project Structure
```
eagerinvoice/
├── app/                    # Screens
│   └── (tabs)/            # Tab navigation
├── components/            # UI components
├── context/              # Data management
├── data/                 # Dummy data
└── utils/               # Helper functions
```

### Technology Stack
- **Frontend**: React Native (Expo)
- **State**: React Context API
- **Storage**: Local (Phase 1)

## 6. Current Status

✅ **Completed**:
- Basic app structure
- Client management
- Invoice tracking
- Salary calculator
- PDF/CSV export

⏳ **Future Plans**:
- Cloud sync
- Push notifications
- Multi-currency support

---

For technical documentation and contribution guidelines, please visit the [Project Wiki](https://github.com/pragnesh64/eagerInvoice/wiki).
