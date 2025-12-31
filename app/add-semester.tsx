import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function AddSemester() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const saveSem = async () => {
    if (!name) return Alert.alert("Error", "Please enter a semester name");

    setLoading(true);
    // 1. Deactivate old semesters
    await supabase.from("semesters").update({ is_active: false }).eq("is_active", true);

    // 2. Insert new semester as active
    const { error } = await supabase.from("semesters").insert([
      { name, is_active: true }
    ]);

    setLoading(false);

    if (error) return Alert.alert("Error", error.message);

    Alert.alert("Success! 🎉", "New semester is now active.");
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>

        <Text style={styles.title}>New Semester</Text>
        <Text style={styles.subtitle}>Create a new academic period</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Semester Name</Text>
          <TextInput
            placeholder="e.g. S6 CSE"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={saveSem} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Start Semester</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 24, flex: 1, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 24 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1e293b", textAlign: 'center' },
  subtitle: { fontSize: 16, color: "#64748b", textAlign: 'center', marginBottom: 40 },
  form: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8, marginLeft: 4 },
  input: { 
    backgroundColor: "white", 
    borderRadius: 16, 
    padding: 18, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: "#e2e8f0" 
  },
  button: { 
    backgroundColor: "#6366f1", 
    padding: 18, 
    borderRadius: 16, 
    shadowColor: "#6366f1", 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5 
  },
  buttonText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: "bold" }
});