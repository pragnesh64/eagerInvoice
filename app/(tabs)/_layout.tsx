import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { IconSymbol } from "../../components/ui/IconSymbol";

export default function TabLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#537bff",
          tabBarInactiveTintColor: "#e7e7e7",
          tabBarStyle: {
            backgroundColor: Platform.OS === 'ios' ? 'rgba(30, 41, 59, 0.95)' : "#1e293b",
            borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
            borderTopColor: "#e5e7eb",
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: Platform.OS === 'ios' ? 8 : 0,
            height: Platform.OS === 'ios' ? 88 : 56,
            marginBottom: Platform.OS === 'ios' ? 0 : 40,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
            shadowRadius: Platform.OS === 'ios' ? 8 : 0,
            elevation: Platform.OS === 'ios' ? 0 : 8,
          },
          tabBarBackground: () => (
            Platform.OS === 'ios' ? (
              <BlurView
                tint="dark"
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            ) : null
          ),
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
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginTop: Platform.OS === 'ios' ? 4 : 0,
          },
          tabBarIconStyle: {
            marginTop: Platform.OS === 'ios' ? 4 : 0,
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
