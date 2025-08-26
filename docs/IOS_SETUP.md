# iOS Setup Guide for EagerInvoice

This guide covers the iOS-specific configurations and fixes implemented to ensure the app works properly on iOS devices.

## 🍎 iOS Configuration

### 1. App Configuration (`app.json`)

The app has been configured with proper iOS settings:

```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.eagerinvoice.app",
      "buildNumber": "1",
      "deploymentTarget": "13.0",
      "infoPlist": {
        "UIBackgroundModes": [],
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    }
  }
}
```

### 2. Safe Area Handling

All screens now properly handle iOS safe areas:

- **Status Bar**: Configured to work with iOS status bar
- **Tab Bar**: Properly positioned with iOS home indicator
- **Modals**: Use iOS-native presentation styles
- **Keyboard**: Proper keyboard handling and dismissal

### 3. Platform-Specific Components

#### Tab Bar
- Uses `BlurView` for iOS native appearance
- Proper height and padding for iOS devices
- Platform-specific styling

#### Modals
- iOS: `pageSheet` presentation style
- Android: `fullScreen` presentation style
- Proper keyboard handling

#### Input Components
- iOS-specific keyboard properties
- Clear button mode for iOS
- Proper text input styling

### 4. iOS-Specific Features

#### Haptic Feedback
- Light haptic feedback on tab press (iOS only)
- Uses `expo-haptics` for native feel

#### SF Symbols
- Native iOS icons using `expo-symbols`
- Fallback to Material Icons for other platforms

#### Date Picker
- iOS: Spinner-style picker in modal
- Android: Native date picker
- Proper date formatting

## 🔧 Key Fixes Implemented

### 1. Safe Area Issues
- Fixed SafeAreaView usage across all screens
- Proper padding for iOS status bar and home indicator
- Platform-specific spacing

### 2. Keyboard Handling
- `keyboardShouldPersistTaps="handled"`
- `keyboardDismissMode="interactive"` for iOS
- Proper input focus management

### 3. Modal Presentation
- iOS page sheet style for better UX
- Proper modal sizing and positioning
- Keyboard-aware modals

### 4. Tab Bar Styling
- Blur effect for iOS native appearance
- Proper height and padding
- Platform-specific shadows and borders

### 5. Input Components
- iOS-specific clear button
- Proper text input styling
- Platform-specific padding and sizing

## 🚀 Running on iOS

### Prerequisites
1. macOS with Xcode installed
2. iOS Simulator or physical device
3. Expo CLI installed

### Commands
```bash
# Start iOS development
npm run ios
# or
npx expo start --ios

# Build for iOS
npm run build:ios
```

### Testing Checklist
- [ ] App launches without crashes
- [ ] Tab bar appears correctly
- [ ] Modals open and close properly
- [ ] Keyboard appears and dismisses correctly
- [ ] Safe areas are respected
- [ ] Haptic feedback works
- [ ] Date picker functions properly
- [ ] All forms work correctly

## 🐛 Common iOS Issues & Solutions

### 1. Tab Bar Not Visible
**Issue**: Tab bar appears cut off or not visible
**Solution**: Check SafeAreaView implementation and tab bar height

### 2. Keyboard Covers Input
**Issue**: Keyboard covers text inputs
**Solution**: Use `keyboardShouldPersistTaps` and proper ScrollView configuration

### 3. Modal Not Dismissing
**Issue**: Modal doesn't close properly
**Solution**: Ensure proper `onRequestClose` and `presentationStyle`

### 4. Status Bar Issues
**Issue**: Status bar overlaps content
**Solution**: Use proper StatusBar component and SafeAreaView

### 5. Date Picker Not Working
**Issue**: Date picker doesn't show or work properly
**Solution**: Check platform-specific implementation and modal configuration

## 📱 iOS-Specific Dependencies

The following packages are configured for iOS:

- `expo-blur`: Native iOS blur effects
- `expo-haptics`: iOS haptic feedback
- `expo-symbols`: SF Symbols for iOS
- `@react-native-community/datetimepicker`: Native date picker
- `react-native-safe-area-context`: Safe area handling

## 🎨 Design Considerations

### iOS Design Guidelines
- Follow iOS Human Interface Guidelines
- Use native iOS components where possible
- Implement proper touch targets (44pt minimum)
- Use iOS-native animations and transitions

### Platform-Specific Styling
- iOS: Rounded corners, blur effects, subtle shadows
- Android: Material Design principles
- Web: Responsive design with web-specific interactions

## 🔄 Updates and Maintenance

### Regular Tasks
1. Test on latest iOS version
2. Update iOS deployment target if needed
3. Check for new iOS-specific features
4. Update dependencies regularly

### Version Compatibility
- iOS 13.0+ (deployment target)
- Latest Expo SDK
- React Native 0.79.5

---

For more information, refer to the [Expo iOS documentation](https://docs.expo.dev/versions/latest/distribution/building-standalone-apps/#ios) and [React Native iOS guide](https://reactnative.dev/docs/running-on-device#running-on-ios). 