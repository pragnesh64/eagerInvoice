import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#f6fcf4", "#dff3f9"]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image 
          source={require("../../assets/images/companylogo.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>EagerInvoice</Text>
        <Text style={styles.subtitle}>Smart Billing • Simplified</Text>
      </View>

      <ActivityIndicator size="large" color="#3e8aad" style={{ marginTop: 50 }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#295162",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 8,
  },
});
