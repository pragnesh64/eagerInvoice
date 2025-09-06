import { BlurView } from 'expo-blur';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { DatabaseProvider } from './context/DatabaseContext';

export default function App() {
  return (
    <DatabaseProvider>
      <ImageBackground
        source={require('./assets/images/bgimage.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <BlurView intensity={20} tint="light" style={styles.blurOverlay} />
        <View style={styles.darkOverlay} />
        
        <View style={styles.container}>
          {/* Your app content */}
        </View>
      </ImageBackground>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
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
  container: {
    flex: 1,
    zIndex: 2,
  },
}); 