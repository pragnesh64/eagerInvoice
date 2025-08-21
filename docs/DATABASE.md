# SQLite Database Documentation

## Overview

This document outlines the SQLite database schema and requirements for the EagerInvoice mobile app. The database is designed to store client information, invoices, and salary records while supporting offline-first functionality.

## Database Requirements

### Technical Requirements

1. **SQLite Version**: 3.0 or higher
2. **Storage Location**: Local device storage using `expo-sqlite`
3. **Maximum Database Size**: 50MB (typical mobile app SQLite limit)
4. **Backup Format**: SQL dump file (.sql)

### Functional Requirements

1. **Data Persistence**
   - Store all data locally on the device
   - Support offline operations
   - Maintain data integrity across app restarts

2. **Performance**
   - Fast query response (< 100ms)
   - Efficient indexing for frequent queries
   - Support for at least 1000 clients and 10000 invoices

3. **Data Security**
   - Encrypted storage using SQLCipher
   - Secure backup and restore
   - Data validation before insertion

## Database Schema

### 1. Clients Table

```sql
CREATE TABLE clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('Micro', 'Mid', 'Core', 'Large Retainer')) NOT NULL,
    start_date TEXT NOT NULL,  -- ISO 8601 format: YYYY-MM-DD
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster client lookup
CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_start_date ON clients(start_date);
```

### 2. Invoices Table

```sql
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    invoice_no TEXT NOT NULL UNIQUE,
    client_id TEXT NOT NULL,
    amount INTEGER NOT NULL,  -- Store amount in paise (1 rupee = 100 paise)
    date TEXT NOT NULL,      -- ISO 8601 format: YYYY-MM-DD
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Indexes for faster invoice queries
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_date ON invoices(date);
CREATE INDEX idx_invoices_amount ON invoices(amount);
```

### 3. Salary Records Table

```sql
CREATE TABLE salary_records (
    id TEXT PRIMARY KEY,
    month TEXT NOT NULL UNIQUE,  -- Format: YYYY-MM
    retainer INTEGER NOT NULL,   -- Fixed amount in paise
    commission INTEGER NOT NULL, -- Commission amount in paise
    total INTEGER NOT NULL,     -- Total salary in paise
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster month-wise lookup
CREATE INDEX idx_salary_records_month ON salary_records(month);
```

## Database Operations

### 1. Common Queries

```sql
-- Get monthly revenue
SELECT strftime('%Y-%m', date) as month, 
       SUM(amount) as revenue
FROM invoices
GROUP BY month
ORDER BY month DESC;

-- Get client revenue
SELECT c.name, 
       COUNT(i.id) as invoice_count,
       SUM(i.amount) as total_revenue
FROM clients c
LEFT JOIN invoices i ON c.id = i.client_id
GROUP BY c.id;

-- Calculate monthly salary
SELECT month,
       retainer,
       commission,
       total
FROM salary_records
ORDER BY month DESC
LIMIT 1;
```

### 2. Data Integrity Triggers

```sql
-- Update timestamps on record modification
CREATE TRIGGER clients_update_trigger
AFTER UPDATE ON clients
BEGIN
    UPDATE clients 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

CREATE TRIGGER invoices_update_trigger
AFTER UPDATE ON invoices
BEGIN
    UPDATE invoices 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

CREATE TRIGGER salary_records_update_trigger
AFTER UPDATE ON salary_records
BEGIN
    UPDATE salary_records 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;
```

## Database Migration Strategy

### 1. Initial Setup

```sql
-- Version table for tracking migrations
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial version
INSERT INTO schema_version (version) VALUES (1);
```

### 2. Migration Process

1. **Check Current Version**
   ```sql
   SELECT MAX(version) FROM schema_version;
   ```

2. **Apply Migrations**
   - Run migrations in sequence
   - Each migration in a transaction
   - Update schema version after successful migration

### 3. Backup Strategy

1. **Regular Backups**
   - Daily automatic backups
   - Backup before migrations
   - Export to SQL dump file

2. **Restore Process**
   - Verify backup file integrity
   - Run in transaction
   - Validate data after restore

## Implementation Notes

### 1. Required Dependencies

```json
{
  "dependencies": {
    "expo-sqlite": "^11.0.0",
    "expo-file-system": "^11.0.0",
    "@react-native-async-storage/async-storage": "^1.17.0"
  }
}
```

### 2. Database Initialization

```typescript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('eagerinvoice.db');

// Initialize database
db.transaction(tx => {
  // Create tables
  tx.executeSql(CREATE_CLIENTS_TABLE);
  tx.executeSql(CREATE_INVOICES_TABLE);
  tx.executeSql(CREATE_SALARY_RECORDS_TABLE);
  
  // Create indexes
  tx.executeSql(CREATE_CLIENTS_INDEXES);
  tx.executeSql(CREATE_INVOICES_INDEXES);
  tx.executeSql(CREATE_SALARY_RECORDS_INDEXES);
  
  // Create triggers
  tx.executeSql(CREATE_UPDATE_TRIGGERS);
});
```

### 3. Error Handling

- Use try-catch blocks for all database operations
- Implement rollback for failed transactions
- Log errors with context for debugging
- Provide user-friendly error messages

### 4. Performance Optimization

1. **Indexing Strategy**
   - Index frequently queried columns
   - Avoid over-indexing (storage vs speed trade-off)
   - Use compound indexes for common query patterns

2. **Query Optimization**
   - Use prepared statements
   - Minimize joins in frequently used queries
   - Cache common query results

3. **Data Pruning**
   - Archive old records (> 1 year)
   - Implement data cleanup routines
   - Maintain optimal database size

## Security Considerations

1. **Data Encryption**
   - Use SQLCipher for database encryption
   - Secure key storage using Expo SecureStore
   - Encrypt backups before storage

2. **Input Validation**
   - Sanitize all user inputs
   - Use parameterized queries
   - Validate data types and ranges

3. **Access Control**
   - Implement user authentication
   - Role-based access control
   - Audit logging for sensitive operations

## Future Enhancements

1. **Cloud Sync**
   - Implement conflict resolution
   - Delta sync for efficient updates
   - Background sync service

2. **Analytics**
   - Add analytics tables
   - Performance metrics
   - Usage statistics

3. **Multi-device Support**
   - Data synchronization
   - Conflict resolution
   - Device management 