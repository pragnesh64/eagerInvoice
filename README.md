# EagerInvoice - Modern Invoice Management Mobile App

A professional, modern mobile application for managing clients, invoices, and business reports with a sleek UI design inspired by top fintech apps like CRED.

## 🚀 Features

### 📱 Core Functionality
- **Dashboard Overview**: Real-time revenue, outstanding amounts, and business metrics
- **Client Management**: Add, view, and manage client relationships
- **Invoice Management**: Create, track, and manage invoices with status tracking
- **Reports & Analytics**: Comprehensive business reports with export capabilities
- **Data Export**: Export data to CSV and generate PDF reports

### 🎨 Design Features
- **Modern UI/UX**: Clean, professional interface with neumorphic design elements
- **Responsive Design**: Optimized for mobile devices with smooth interactions
- **Dark/Light Theme Support**: Adaptive theming system
- **Smooth Animations**: Micro-interactions and transitions
- **Professional Typography**: Consistent text hierarchy and readability

### 🔧 Technical Features
- **Cross-Platform**: Built with React Native (Expo) for iOS and Android
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context API for global state
- **Component Architecture**: Reusable, modular component system
- **Data Persistence**: Local data management with dummy data structure

## 📋 Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Components](#components)
- [Data Management](#data-management)
- [UI Design System](#ui-design-system)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Contributing](#contributing)

## 🛠 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/pragnesh64/eagerInvoice.git
   cd eagerInvoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator

## 📁 Project Structure

```
eagerinvoice/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Dashboard screen
│   │   ├── clients.tsx          # Clients management screen
│   │   ├── invoices.tsx         # Invoices management screen
│   │   └── reports.tsx          # Reports and analytics screen
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 page
├── components/                   # Reusable components
│   ├── ui/                      # Core UI components
│   │   ├── Button.tsx           # Button component
│   │   ├── Card.tsx             # Card component
│   │   ├── Text.tsx             # Text component
│   │   ├── Input.tsx            # Input component
│   │   ├── Badge.tsx            # Badge component
│   │   ├── Dropdown.tsx         # Dropdown component
│   │   ├── FloatingActionButton.tsx # FAB component
│   │   ├── Divider.tsx          # Divider component
│   │   ├── Spacer.tsx           # Spacing component
│   │   └── IconSymbol.tsx       # Icon component
│   ├── modals/                  # Modal components
│   │   ├── AddClientModal.tsx   # Add client modal
│   │   └── AddInvoiceModal.tsx  # Add invoice modal
│   ├── StatCard.tsx             # Statistics card
│   ├── ClientCard.tsx           # Client display card
│   ├── InvoiceCard.tsx          # Invoice display card
│   └── index.ts                 # Component exports
├── constants/                   # App constants
│   ├── Colors.ts               # Color definitions
│   └── Typography.ts           # Typography system
├── context/                    # React Context
│   └── DataContext.tsx         # Global data management
├── data/                       # Data layer
│   └── dummyData.ts            # Dummy data and interfaces
├── utils/                      # Utility functions
│   └── exportUtils.ts          # Export functionality
├── assets/                     # Static assets
│   ├── fonts/                  # Custom fonts
│   └── images/                 # App images
├── hooks/                      # Custom hooks
├── package.json                # Dependencies and scripts
├── app.json                    # Expo configuration
└── tsconfig.json              # TypeScript configuration
```

## 🏗 Architecture

### Design Patterns
- **Component-Based Architecture**: Modular, reusable components
- **Context API**: Global state management for data
- **Custom Hooks**: Reusable logic encapsulation
- **TypeScript**: Type safety throughout the application

### State Management
```typescript
// DataContext provides global state for:
- Clients data and operations
- Invoices data and operations
- Filtering and search functionality
- Export operations
- Business metrics calculations
```

### Navigation
- **Expo Router**: File-based routing system
- **Tab Navigation**: Bottom tab navigation for main sections
- **Modal Navigation**: Overlay modals for data entry

## 🧩 Components

### Core UI Components

#### Button Component
```typescript
<Button 
  title="Click Me" 
  variant="primary" 
  size="md" 
  onPress={handlePress}
/>
```
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **Features**: Loading state, icons, disabled state

#### Card Component
```typescript
<Card variant="elevated" padding="md">
  <Text>Card content</Text>
</Card>
```
- **Variants**: default, elevated, outlined
- **Padding**: xs, sm, md, lg, xl

#### Dropdown Component
```typescript
<Dropdown
  label="Select Option"
  options={options}
  value={selectedValue}
  onValueChange={handleChange}
  searchable={true}
/>
```
- **Features**: Searchable options, custom styling, disabled state

### Business Components

#### StatCard
Displays business metrics with icons and trends
```typescript
<StatCard
  title="Revenue"
  value={10000}
  subtitle="This month"
  icon="house.fill"
  trend={{ value: 12, isPositive: true }}
  variant="primary"
/>
```

#### ClientCard
Displays client information with avatar and stats
```typescript
<ClientCard
  name="John Doe"
  type="individual"
  email="john@example.com"
  totalRevenue={5000}
  invoiceCount={5}
  onPress={handlePress}
/>
```

#### InvoiceCard
Displays invoice details with status indicators
```typescript
<InvoiceCard
  invoiceNumber="INV-001"
  clientName="John Doe"
  amount={1000}
  date="2024-01-15"
  status="paid"
  onPress={handlePress}
/>
```

## 📊 Data Management

### Data Structures

#### Client Interface
```typescript
interface Client {
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
```

#### Invoice Interface
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  description: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  createdAt: string;
}
```

### CRUD Operations
- **Create**: Add new clients and invoices
- **Read**: View and filter data
- **Update**: Modify existing records
- **Delete**: Remove records (implemented in context)

### Filtering & Search
- **Client Filters**: By type, status, search query
- **Invoice Filters**: By status, client, search query
- **Real-time Search**: Instant filtering as you type

## 🎨 UI Design System

### Color Palette
```typescript
// Primary Colors
primary: '#2563eb'        // Blue
secondary: '#7c3aed'      // Purple
accent: '#059669'         // Green

// Status Colors
success: '#059669'        // Green
warning: '#d97706'        // Orange
error: '#dc2626'          // Red

// Neutral Colors
neutral: {
  50: '#f9fafb',
  100: '#f3f4f6',
  500: '#6b7280',
  900: '#111827'
}
```

### Typography
```typescript
// Font Sizes
xs: 12, sm: 14, md: 16, lg: 18, xl: 20, 2xl: 24, 3xl: 30

// Font Weights
normal: '400', medium: '500', semibold: '600', bold: '700'
```

### Spacing System
```typescript
// Spacing Scale
xs: 4, sm: 8, md: 16, lg: 24, xl: 32, 2xl: 48
```

### Shadows
```typescript
// Shadow Presets
sm: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05 }
md: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 }
lg: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15 }
```

## 📖 Usage Guide

### Dashboard
- View key business metrics
- Quick access to recent invoices and top clients
- Floating action button for quick invoice creation

### Clients Management
- View all clients with filtering options
- Add new clients with detailed information
- Search and filter by type and status
- View client performance metrics

### Invoices Management
- Create new invoices with itemized details
- Track invoice status (draft, pending, paid, overdue)
- Filter invoices by status and client
- View payment status summary

### Reports
- Export data to CSV format
- Generate PDF reports
- View business analytics
- Share reports via email or other apps

## 🛠 Development

### Available Scripts
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Build for production
npm run build

# Eject from Expo
npm run eject
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks

### Testing
- Unit tests for utility functions
- Component testing with React Native Testing Library
- Integration tests for data flow

### Performance
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Optimized Re-renders**: Proper dependency arrays in hooks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update relevant documentation

## 📱 Platform Support

### iOS
- iOS 13.0 and later
- iPhone and iPad support
- Optimized for different screen sizes

### Android
- Android 6.0 (API level 23) and later
- Material Design components
- Adaptive layouts

### Web (Future)
- React Native Web support planned
- Responsive web design
- Progressive Web App features

## 🔮 Future Enhancements

### Planned Features
- **Real-time Sync**: Cloud database integration
- **Offline Support**: Local data persistence
- **Push Notifications**: Invoice reminders
- **Multi-currency**: International business support
- **Advanced Analytics**: Charts and graphs
- **Team Collaboration**: Multi-user support

### Technical Improvements
- **Performance Optimization**: Bundle size reduction
- **Accessibility**: Screen reader support
- **Internationalization**: Multi-language support
- **Security**: Data encryption and secure storage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Pragnesh
- **Design**: Modern UI/UX inspired by CRED and other fintech apps
- **Architecture**: React Native with Expo

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: pragnesh64@gmail.com
- Documentation: [Project Wiki](https://github.com/pragnesh64/eagerInvoice/wiki)

---

**EagerInvoice** - Modern invoice management for the digital age 💼✨
