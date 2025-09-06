import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface SimpleBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  imageSource?: any;
}

export function SimpleBackground({ 
  children, 
  style,
  imageSource = require('../../assets/images/bgimage.jpg')
}: SimpleBackgroundProps) {
  const [imageError, setImageError] = useState(false);
  
  console.log('SimpleBackground: Loading image source:', imageSource);
  
  if (imageError) {
    // Fallback to gradient background if image fails to load
    return (
      <LinearGradient
        colors={[Colors.light.background, Colors.light.backgroundSecondary]}
        style={[styles.container, style]}
      >
        {children}
      </LinearGradient>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={imageSource}
        style={styles.background}
        resizeMode="cover"
        onLoad={() => console.log('SimpleBackground: Image loaded successfully')}
        onError={(error) => {
          console.log('SimpleBackground: Image load error:', error);
          setImageError(true);
        }}
      >
        {/* Blur effect for background */}
        <BlurView
          intensity={20}
          tint="light"
          style={styles.blurOverlay}
        />
        
        {/* Dark overlay for better text readability */}
        <View style={styles.darkOverlay} />
        
        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});
