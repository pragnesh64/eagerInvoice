import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { IconSymbol } from "../../components/ui/IconSymbol";

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#537bff",
          tabBarInactiveTintColor: "#e7e7e7",
          tabBarStyle: {
            backgroundColor: "#1e293b",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            paddingBottom: 10,
            height: 56,
            marginBottom: 40,
          },

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
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <IconSymbol name="house.fill" size={24} color={color} />
            ),
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            tabBarIcon: ({ color }) => (
              <IconSymbol name="person.2.fill" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="invoices"
          options={{
            tabBarIcon: ({ color }) => (
              <IconSymbol name="doc.text.fill" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            tabBarIcon: ({ color }) => (
              <IconSymbol name="chart.bar.fill" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
