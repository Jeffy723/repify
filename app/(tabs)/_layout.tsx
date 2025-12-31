import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#6366f1', // Matches your Indigo theme
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
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

      {/* 2. ASSIGNMENTS TAB - This points to the assignments folder/index.tsx */}
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

      {/* HIDE UNWANTED SCREENS FROM BOTTOM BAR */}
      {/* These will still work as routes, but won't show icons */}
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