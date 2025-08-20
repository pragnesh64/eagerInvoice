import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#3e8aad", "#273b44ff"]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>📊</Text>
        <Text style={styles.title}>EagerInvoice</Text>
        <Text style={styles.subtitle}>Smart Billing • Simplified</Text>
      </View>

      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
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
  },
  logo: {
    fontSize: 64,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    marginTop: 6,
  },
});
