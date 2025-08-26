import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { DatabaseProvider } from "../context/DatabaseContext";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerBackground: () => (
              <View style={styles.headerBackground}>
                <BlurView
                  tint="light"
                  intensity={Platform.OS === 'ios' ? 80 : 0}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.gradientContainer}>
                  <LinearGradient
                    colors={[
                      "#2F6BFF",
                      "#2F6BFF55",
                      "hsla(0, 0.00%, 100.00%, 0.00)",
                    ]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradient}
                  />
                </View>

                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.75)",
                    "rgba(255, 255, 255, 0.35)",
                    "rgba(255, 255, 255, 0)",
                  ]}
                  style={StyleSheet.absoluteFill}
                />
              </View>
            ),
            headerTransparent: true,
            headerTintColor: "#fff",
            headerTitle: "",
            headerStyle: {
              backgroundColor: 'transparent',
            },
          }}
        />
      </SafeAreaView>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerBackground: {
    flex: 0.4,
  },
  gradientContainer: {
    position: "absolute",
    top: Platform.OS === 'ios' ? -24 : -20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  gradient: {
    width: "100%",
    height: 18,
    shadowColor: "#2F6BFF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 10,
  },
});
