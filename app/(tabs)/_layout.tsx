import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "../context/ThemeContext"; // Import global theme

export default function TabsLayout() {
  const { COLORS } = useTheme(); // Access global colors

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        // Use global primary color for active tab
        tabBarActiveTintColor: COLORS.primary, 
        // Use global muted color for inactive tab
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          // Use global card color for the bar background
          backgroundColor: COLORS.card,
          // Add a subtle border that matches the theme
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        }
      }}
    >
      {/* 1. HOME TAB */}
      <Tabs.Screen 
        name="home" 
        options={{ 
          tabBarLabel: "Home", 
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> 
        }} 
      />

      {/* 2. ASSIGNMENTS TAB */}
      <Tabs.Screen 
        name="assignments" 
        options={{ 
          tabBarLabel: "Tasks", 
          tabBarIcon: ({ color, size }) => <Ionicons name="library" color={color} size={size} /> 
        }} 
      />

      {/* 3. PROFILE TAB */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          tabBarLabel: "Profile", 
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> 
        }} 
      />

      {/* HIDE UNWANTED SCREENS */}
      <Tabs.Screen 
        name="index" 
        options={{ href: null }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{ href: null }} 
      />
    </Tabs>
  );
}