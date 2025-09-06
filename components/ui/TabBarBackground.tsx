import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';

// Enhanced blur background for Android and Web
export default function BlurTabBarBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView
        tint="light"
        intensity={80}
        style={[StyleSheet.absoluteFill, {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        }]}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 0;
}
