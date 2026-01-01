import React, { createContext, useContext, useState, useRef } from "react";
import { Animated } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);
  const anim = useRef(new Animated.Value(1)).current;

  const toggleTheme = () => {
    Animated.timing(anim, {
      toValue: dark ? 0 : 1, // 0 for Light, 1 for Dark
      duration: 300,
      useNativeDriver: false,
    }).start();
    setDark(!dark);
  };

  // Global Color Palette
  const COLORS = {
    bg: dark ? "#020617" : "#F8FAFC",
    card: dark ? "#0F172A" : "#FFFFFF",
    primary: dark ? "#38BDF8" : "#0284C7",
    accent: dark ? "#22C55E" : "#16A34A",
    text: dark ? "#F8FAFC" : "#0F172A",
    muted: dark ? "#94A3B8" : "#64748B",
    border: dark ? "#1E293B" : "#E2E8F0"
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, anim, COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);