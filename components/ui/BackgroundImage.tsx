import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface BackgroundImageProps {
  children: React.ReactNode;
  style?: ViewStyle;
  overlayOpacity?: number;
  imageSource?: 'bgimage' | 'bglayoutimage' | any;
  customImageSource?: any;
}

/**
 * BackgroundImage Component
 * 
 * Usage examples:
 * 
 * // Use default bgimage.jpg
 * <BackgroundImage>
 *   {children}
 * </BackgroundImage>
 * 
 * // Use bglayoutimage.jpg
 * <BackgroundImage imageSource="bglayoutimage">
 *   {children}
 * </BackgroundImage>
 * 
 * // Use custom image with different overlay opacity
 * <BackgroundImage 
 *   imageSource="bglayoutimage" 
 *   overlayOpacity={0.1}
 * >
 *   {children}
 * </BackgroundImage>
 */
export function BackgroundImage({ 
  children, 
  style, 
  overlayOpacity = 0.1, // Reduced default opacity
  imageSource = 'bgimage',
  customImageSource
}: BackgroundImageProps) {
  const getImageSource = () => {
    if (customImageSource) {
      return customImageSource;
    }
    
    switch (imageSource) {
      case 'bglayoutimage':
        console.log('Loading bglayoutimage.jpg');
        return require('../../assets/images/bglayoutimage.jpg');
      case 'bgimage':
      default:
        console.log('Loading bgimage.jpg');
        return require('../../assets/images/bgimage.jpg');
    }
  };

  const imageSrc = getImageSource();
  console.log('BackgroundImage: Image source loaded:', imageSrc);

  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={imageSrc}
        style={styles.background}
        resizeMode="cover"
        onLoad={() => console.log('BackgroundImage: Image loaded successfully')}
        onError={(error) => console.log('BackgroundImage: Image load error:', error)}
      >
        {/* Overlay to ensure text readability */}
        <View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </ImageBackground>
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});
