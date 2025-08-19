# EagerInvoice UI Components

A modern, fintech-inspired component library for the EagerInvoice mobile application. Built with React Native and Expo, featuring a clean, professional design system.

## 🎨 Design System

### Colors
- **Primary**: Deep blue (#2563eb) for trust & finance
- **Secondary**: Purple (#8b5cf6) for accents
- **Success**: Green (#10b981) for positive states
- **Warning**: Amber (#f59e0b) for caution states
- **Error**: Red (#ef4444) for error states

### Typography
- **Headings**: H1-H4 with proper hierarchy
- **Body**: Regular, large, and small variants
- **Caption**: Small text for labels and metadata
- **Display**: Large text for hero sections

## 📦 Core Components

### Card
A versatile card component with multiple variants and states.

```tsx
import { Card } from './components/ui';

<Card variant="elevated" padding="lg" onPress={handlePress}>
  <Text>Card content</Text>
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined'
- `padding`: 'sm' | 'md' | 'lg'
- `margin`: 'sm' | 'md' | 'lg'
- `onPress`: Optional press handler
- `disabled`: Disable interactions

### Button
Modern button component with multiple variants and sizes.

```tsx
import { Button } from './components/ui';

<Button 
  title="Click me" 
  variant="primary" 
  size="md" 
  onPress={handlePress}
  leftIcon={<IconSymbol name="house.fill" />}
/>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: Show loading state
- `fullWidth`: Full width button
- `leftIcon` / `rightIcon`: Optional icons

### Text
Typography components with consistent styling.

```tsx
import { Heading1, BodyText, Caption } from './components/ui';

<Heading1>Main Title</Heading1>
<BodyText>Regular body text</BodyText>
<Caption color="textSecondary">Small caption</Caption>
```

**Available components:**
- `Heading1`, `Heading2`, `Heading3`, `Heading4`
- `BodyText`, `BodyLarge`, `BodySmall`
- `Caption`, `Label`
- `Display`, `Monospace`

### Badge
Status and type indicators.

```tsx
import { Badge, StatusBadge, ClientTypeBadge } from './components/ui';

<Badge variant="success">Success</Badge>
<StatusBadge status="paid" />
<ClientTypeBadge type="enterprise" />
```

### Input
Form input component with validation states.

```tsx
import { Input } from './components/ui';

<Input
  label="Email"
  placeholder="Enter your email"
  error="Invalid email"
  leftIcon={<IconSymbol name="house.fill" />}
/>
```

### FloatingActionButton
Floating action button for primary actions.

```tsx
import { FloatingActionButton } from './components/ui';

<FloatingActionButton
  icon="house.fill"
  variant="primary"
  onPress={handleAdd}
/>
```

## 🏢 Business Components

### StatCard
Financial statistics display for dashboard.

```tsx
import { StatCard } from './components';

<StatCard
  title="Total Revenue"
  value={50000}
  subtitle="This month"
  icon="house.fill"
  trend={{ value: 12, isPositive: true }}
  variant="primary"
/>
```

### InvoiceCard
Invoice information display.

```tsx
import { InvoiceCard } from './components';

<InvoiceCard
  invoiceNumber="INV-001"
  clientName="Acme Corp"
  amount={2500}
  date="2024-01-15"
  dueDate="2024-02-15"
  status="pending"
  onPress={handleInvoicePress}
/>
```

### ClientCard
Client information display.

```tsx
import { ClientCard } from './components';

<ClientCard
  name="John Doe"
  type="individual"
  email="john@example.com"
  totalRevenue={15000}
  invoiceCount={5}
  lastInvoiceDate="2024-01-10"
  onPress={handleClientPress}
/>
```

## 🎯 Usage Examples

### Dashboard Layout
```tsx
import { View, ScrollView } from 'react-native';
import { StatCard, Card, Heading2, BodyText } from './components';

export function Dashboard() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ padding: 16 }}>
        <Heading2>Dashboard</Heading2>
        
        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 12, marginVertical: 16 }}>
          <StatCard
            title="Revenue"
            value={50000}
            variant="primary"
            icon="house.fill"
          />
          <StatCard
            title="Profit"
            value={35000}
            variant="success"
            icon="chevron.right"
          />
        </View>

        {/* Recent Activity */}
        <Card variant="elevated" padding="lg">
          <Heading2>Recent Invoices</Heading2>
          <BodyText>Your recent invoice activity will appear here.</BodyText>
        </Card>
      </View>
    </ScrollView>
  );
}
```

### Form Layout
```tsx
import { View } from 'react-native';
import { Input, Button, Card, Heading3 } from './components';

export function AddInvoiceForm() {
  return (
    <View style={{ padding: 16 }}>
      <Card variant="elevated" padding="lg">
        <Heading3>Add New Invoice</Heading3>
        
        <Input
          label="Client Name"
          placeholder="Enter client name"
        />
        
        <Input
          label="Amount"
          placeholder="0.00"
          keyboardType="numeric"
        />
        
        <Button
          title="Create Invoice"
          variant="primary"
          fullWidth
          onPress={handleSubmit}
        />
      </Card>
    </View>
  );
}
```

## 🎨 Styling

### Custom Styles
All components accept a `style` prop for custom styling:

```tsx
<Card style={{ backgroundColor: 'red' }}>
  Custom styled card
</Card>
```

### Theme Colors
Access theme colors in your custom components:

```tsx
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

function MyComponent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <View style={{ backgroundColor: colors.primary }}>
      {/* Your component */}
    </View>
  );
}
```

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web (Expo)
- ✅ Dark mode support
- ✅ Responsive design

## 🚀 Getting Started

1. Import components from the UI library:
```tsx
import { Card, Button, Text } from './components/ui';
```

2. Use business components for specific features:
```tsx
import { StatCard, InvoiceCard, ClientCard } from './components';
```

3. Customize with your own styles and themes as needed.

## 🎯 Best Practices

1. **Consistent Spacing**: Use the `Spacer` component for consistent spacing
2. **Color Usage**: Stick to the design system colors for consistency
3. **Typography**: Use the appropriate text components for hierarchy
4. **Accessibility**: All components support accessibility features
5. **Performance**: Components are optimized for React Native performance

## 🔧 Development

To add new components:

1. Create the component in `components/ui/`
2. Add proper TypeScript interfaces
3. Include theme support
4. Add to the index file
5. Update this documentation

---

Built with ❤️ for EagerInvoice 