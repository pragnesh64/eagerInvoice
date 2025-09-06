import { Animated } from 'react-native';

// Animation timing configurations
export const ANIMATION_CONFIG = {
  fast: {
    duration: 150,
    useNativeDriver: true,
  },
  medium: {
    duration: 250,
    useNativeDriver: true,
  },
  slow: {
    duration: 400,
    useNativeDriver: true,
  },
  // For non-transform properties (borderWidth, backgroundColor, etc.)
  layout: {
    duration: 250,
    useNativeDriver: false,
  },
};

// Note: Using default React Native easing for cross-platform compatibility

// Common animation values
export const ANIMATION_VALUES = {
  scale: {
    pressed: 0.95,
    focused: 1.02,
    hover: 1.05,
    normal: 1,
  },
  opacity: {
    pressed: 0.8,
    focused: 0.9,
    normal: 1,
  },
  borderWidth: {
    normal: 1,
    focused: 2,
  },
};

// Predefined animation functions
export const createPressAnimation = (scaleAnim: Animated.Value, opacityAnim: Animated.Value) => ({
  pressIn: () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: ANIMATION_VALUES.scale.pressed,
        duration: ANIMATION_CONFIG.fast.duration,
        useNativeDriver: ANIMATION_CONFIG.fast.useNativeDriver,
      }),
      Animated.timing(opacityAnim, {
        toValue: ANIMATION_VALUES.opacity.pressed,
        duration: ANIMATION_CONFIG.fast.duration,
        useNativeDriver: ANIMATION_CONFIG.fast.useNativeDriver,
      }),
    ]).start();
  },
  pressOut: () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: ANIMATION_VALUES.scale.normal,
        duration: ANIMATION_CONFIG.medium.duration,
        useNativeDriver: ANIMATION_CONFIG.medium.useNativeDriver,
      }),
      Animated.timing(opacityAnim, {
        toValue: ANIMATION_VALUES.opacity.normal,
        duration: ANIMATION_CONFIG.medium.duration,
        useNativeDriver: ANIMATION_CONFIG.medium.useNativeDriver,
      }),
    ]).start();
  },
});

export const createFocusAnimation = (
  scaleAnim: Animated.Value, 
  borderAnim?: Animated.Value,
  labelAnim?: Animated.Value
) => ({
  focus: () => {
    const animations = [
      Animated.timing(scaleAnim, {
        toValue: ANIMATION_VALUES.scale.focused,
        duration: ANIMATION_CONFIG.medium.duration,
        useNativeDriver: ANIMATION_CONFIG.medium.useNativeDriver,
      }),
    ];

    if (labelAnim) {
      animations.push(
        Animated.timing(labelAnim, {
          toValue: 1,
          duration: ANIMATION_CONFIG.layout.duration,
          useNativeDriver: ANIMATION_CONFIG.layout.useNativeDriver,
        })
      );
    }

    Animated.parallel(animations).start();
  },
  blur: () => {
    const animations = [
      Animated.timing(scaleAnim, {
        toValue: ANIMATION_VALUES.scale.normal,
        duration: ANIMATION_CONFIG.medium.duration,
        useNativeDriver: ANIMATION_CONFIG.medium.useNativeDriver,
      }),
    ];

    if (labelAnim) {
      animations.push(
        Animated.timing(labelAnim, {
          toValue: 0,
          duration: ANIMATION_CONFIG.layout.duration,
          useNativeDriver: ANIMATION_CONFIG.layout.useNativeDriver,
        })
      );
    }

    Animated.parallel(animations).start();
  },
});

// Haptic feedback simulation (for future use)
export const hapticFeedback = {
  light: () => {
    // Implement haptic feedback here when available
    console.log('Light haptic feedback');
  },
  medium: () => {
    console.log('Medium haptic feedback');
  },
  heavy: () => {
    console.log('Heavy haptic feedback');
  },
};
