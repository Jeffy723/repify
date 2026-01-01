import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Animated,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import { useTheme } from "./context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Pulling global state and colors
  const { dark, toggleTheme, anim, COLORS } = useTheme();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    router.replace("/(tabs)/home");
  };

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    container: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 28
    },
    header: {
      fontSize: 34,
      color: COLORS.text,
      fontWeight: "800",
      letterSpacing: -1,
    },
    sub: {
      color: COLORS.muted,
      fontSize: 16,
      marginBottom: 28
    },
    input: {
      backgroundColor: COLORS.card,
      color: COLORS.text,
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border
    },
    btn: {
      backgroundColor: COLORS.accent,
      padding: 18,
      borderRadius: 14,
      marginTop: 6,
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4
    },
    btnText: {
      color: dark ? "#052E16" : "#FFFFFF",
      textAlign: "center",
      fontSize: 16,
      fontWeight: "700"
    },
    link: { marginTop: 20 },
    linkText: {
      color: COLORS.primary,
      textAlign: "center",
      fontWeight: "700"
    },
    toggleBox: {
      position: "absolute",
      top: 60,
      right: 28,
      zIndex: 10
    },
    toggleTrack: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: dark ? "#1E293B" : "#E2E8F0",
      padding: 4,
      justifyContent: "center"
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: dark ? "#22C55E" : "#F59E0B",
      alignItems: "center",
      justifyContent: "center"
    }
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Global Theme Toggle */}
          <View style={styles.toggleBox}>
            <Pressable onPress={toggleTheme}>
              <View style={styles.toggleTrack}>
                <Animated.View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [{
                        translateX: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 22]
                        })
                      }]
                    }
                  ]}
                >
                  {dark ? 
                    <Moon size={12} color="#052E16" fill="#052E16" /> : 
                    <Sun size={12} color="#FFFFFF" />
                  }
                </Animated.View>
              </View>
            </Pressable>
          </View>

          <Text style={styles.header}>Login</Text>
          <Text style={styles.sub}>Please sign in to continue</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.btn} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={() => router.push("/signup")}>
            <Text style={styles.linkText}>New user? Create Account</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}