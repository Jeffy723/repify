import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ tabBarLabel:"Home", tabBarIcon:({color,size}) => (<Ionicons name="home" color={color} size={size}/>) }}/>
      <Tabs.Screen name="assignments" options={{ tabBarLabel:"Assignments", tabBarIcon:({color,size}) => (<Ionicons name="book" color={color} size={size}/>) }}/>
      <Tabs.Screen name="profile" options={{ tabBarLabel:"Profile", tabBarIcon:({color,size}) => (<Ionicons name="person" color={color} size={size}/>) }}/>
    </Tabs>
  );
}
