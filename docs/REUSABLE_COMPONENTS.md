# Reusable Components System

This document describes the reusable components system implemented in EagerInvoice using React Native Reusables patterns without Tailwind CSS.

## 🎯 Overview

The app now uses a comprehensive set of reusable components built with:
- **class-variance-authority (CVA)** for variant management
- **clsx** for conditional class names
- **React Native Reusables patterns** for consistency
- **Your existing design system** (Colors, Typography, etc.)

## 📦 Available Components

### 1. Button Component

A flexible button component with multiple variants and sizes.

```tsx
import { Button } from '../components/ui';

// Basic usage
<Button title="Click me" onPress={handlePress} />

// With variants
<Button 
  title="Primary Button" 
  variant="primary" 
  size="lg" 
  onPress={handlePress} 
/>

// With children
<Button variant="outline" onPress={handlePress}>
  <IconSymbol name="plus" size={16} color="#000" />
  <Text>Add Item</Text>
</Button>
```

**Variants:**
- `default` - Primary button style
- `primary` - Main action button
- `secondary` - Secondary action
- `outline` - Bordered button
- `ghost` - Transparent background
- `destructive` - Error/danger actions
- `warning` - Warning actions
- `link` - Text link style

**Sizes:**
- `sm` - Small button
- `default` - Standard size
- `lg` - Large button
- `icon` - Square icon button

### 2. Input Component

A comprehensive input component with validation and styling.

```tsx
import { Input } from '../components/ui';

// Basic input
<Input 
  label="Email" 
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

// With validation
<Input 
  label="Password" 
  placeholder="Enter password"
  secureTextEntry
  error={passwordError}
  helperText="Must be at least 8 characters"
/>

// With icons
<Input 
  label="Search"
  placeholder="Search..."
  leftIcon={<IconSymbol name="magnifyingglass" size={20} />}
  rightIcon={<IconSymbol name="xmark" size={20} />}
/>
```

**Variants:**
- `default` - Standard input
- `outline` - Bordered style
- `filled` - Filled background

**Sizes:**
- `sm` - Small input
- `default` - Standard size
- `lg` - Large input

### 3. Card Component

A flexible card component with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui';

<Card variant="elevated" size="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Main content of the card</Text>
  </CardContent>
  <CardFooter>
    <Button title="Action" onPress={handleAction} />
  </CardFooter>
</Card>
```

**Variants:**
- `default` - Standard card
- `outline` - Bordered card
- `elevated` - With shadow
- `filled` - Filled background

**Sizes:**
- `sm` - Small padding
- `default` - Standard padding
- `lg` - Large padding

### 4. Badge Component

A badge component for status indicators and labels.

```tsx
import { Badge } from '../components/ui';

// Status badges
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Overdue</Badge>

// Size variants
<Badge variant="info" size="sm">Small</Badge>
<Badge variant="primary" size="lg">Large</Badge>
```

**Variants:**
- `default` - Default badge
- `secondary` - Secondary style
- `destructive` - Error/danger
- `outline` - Bordered style
- `success` - Success state
- `warning` - Warning state
- `info` - Information

**Sizes:**
- `sm` - Small badge
- `default` - Standard size
- `lg` - Large badge

## 🎨 Design System Integration

All components integrate with your existing design system:

### Colors
```tsx
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'light'];
```

### Typography
```tsx
import { Typography } from '../constants/Typography';

// Components automatically use Typography constants
```

### Platform-Specific Styling
Components automatically adapt to iOS and Android with:
- Platform-specific padding and sizing
- iOS-specific features (clear buttons, haptic feedback)
- Android-specific optimizations

## 🔧 Component Variants with CVA

All components use `class-variance-authority` for variant management:

```tsx
const buttonVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        primary: "primary-styles",
        secondary: "secondary-styles",
        // ... more variants
      },
      size: {
        sm: "small-styles",
        default: "default-styles",
        lg: "large-styles",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## 📱 iOS-Specific Features

Components include iOS-specific optimizations:

### Button
- Proper touch targets (44pt minimum)
- iOS-native haptic feedback
- Platform-specific styling

### Input
- iOS clear button mode
- Proper keyboard handling
- iOS-specific text input properties

### Card
- iOS-native shadows and blur effects
- Proper safe area handling
- iOS-specific animations

## 🎯 Usage Examples

### Form with Validation
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Button } from '../components/ui';

<Card>
  <CardHeader>
    <CardTitle>Add New Client</CardTitle>
  </CardHeader>
  <CardContent>
    <Input 
      label="Client Name" 
      placeholder="Enter client name"
      value={name}
      onChangeText={setName}
      error={nameError}
    />
    <Input 
      label="Email" 
      placeholder="Enter email"
      value={email}
      onChangeText={setEmail}
      error={emailError}
      keyboardType="email-address"
    />
  </CardContent>
  <CardFooter>
    <Button title="Save" variant="primary" onPress={handleSave} />
    <Button title="Cancel" variant="ghost" onPress={handleCancel} />
  </CardFooter>
</Card>
```

### Status Display
```tsx
import { Card, CardHeader, CardTitle, Badge } from '../components/ui';

<Card>
  <CardHeader>
    <CardTitle>Invoice Status</CardTitle>
  </CardHeader>
  <CardContent>
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Badge variant="success">Paid</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Overdue</Badge>
    </View>
  </CardContent>
</Card>
```

### Search Interface
```tsx
import { Input, Button, Card } from '../components/ui';

<Card>
  <Input 
    label="Search"
    placeholder="Search invoices..."
    leftIcon={<IconSymbol name="magnifyingglass" size={20} />}
    value={searchQuery}
    onChangeText={setSearchQuery}
    returnKeyType="search"
  />
  <Button 
    title="Clear" 
    variant="ghost" 
    size="sm" 
    onPress={clearSearch}
  />
</Card>
```

## 🚀 Benefits

### 1. Consistency
- All components follow the same design patterns
- Consistent spacing, typography, and colors
- Unified component API

### 2. Reusability
- Components can be used across the entire app
- Variant system allows for flexible styling
- Easy to extend and customize

### 3. Maintainability
- Centralized component definitions
- Easy to update design system
- Type-safe component props

### 4. Performance
- Optimized for React Native
- Platform-specific optimizations
- Efficient re-rendering

### 5. Developer Experience
- IntelliSense support with TypeScript
- Clear component APIs
- Comprehensive documentation

## 🔄 Migration Guide

### From Local Components
Replace local component usage with reusable components:

```tsx
// Before
import { CustomButton } from './CustomButton';
<CustomButton title="Save" onPress={handleSave} />

// After
import { Button } from '../components/ui';
<Button title="Save" variant="primary" onPress={handleSave} />
```

### Component Mapping
- `CustomButton` → `Button`
- `CustomInput` → `Input`
- `CustomCard` → `Card`
- `StatusBadge` → `Badge`

## 📚 Additional Resources

- [React Native Reusables Documentation](https://www.reactnativereusables.com/)
- [class-variance-authority](https://cva.style/docs)
- [clsx Documentation](https://github.com/lukeed/clsx)

---

This reusable component system provides a solid foundation for building consistent, maintainable, and performant React Native applications. 