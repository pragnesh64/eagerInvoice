import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/bgimage.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Blur effect for background */}
      <BlurView
        intensity={20}
        tint="light"
        style={styles.blurOverlay}
      />
      
      {/* Dark overlay for better text readability */}
      <View style={styles.darkOverlay} />
      
      <View style={styles.logoContainer}>
        <Image 
          source={require("../../assets/images/companylogo.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>EagerInvoice</Text>
        <Text style={styles.subtitle}>Smart Billing • Simplified</Text>
      </View>

      <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 50 }} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
  },
  logoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.dark.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
});
