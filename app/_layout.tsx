import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { DatabaseProvider } from "../context/DatabaseContext";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerBackground: () => (
              <View style={{ flex: 0.4 }}>
                <BlurView
                  tint="light"
                  intensity={0}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  style={{
                    position: "absolute",
                    top: -24,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                  }}
                >
                  <LinearGradient
                    colors={[
                      "#2F6BFF",
                      "#2F6BFF55",
                      "hsla(0, 0.00%, 100.00%, 0.00)",
                    ]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                      width: "100%",
                      height: 18,
                      shadowColor: "#2F6BFF",
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: 0.35,
                      shadowRadius: 40,
                      elevation: 10,
                    }}
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
          }}
        />
      </SafeAreaView>
    </DatabaseProvider>
  );
}
