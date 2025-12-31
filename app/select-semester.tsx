import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";

export default function SelectSemester() {
  const [semesters, setSemesters] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => { loadSemesters(); }, []);

  const loadSemesters = async () => {
    const { data } = await supabase.from("semesters").select("id, name");
    setSemesters(data || []);
  };

  const select = async (id: string) => {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .update({ semester_id: id })
      .eq("id", userId);

    if (error) return Alert.alert("Error", error.message);

    Alert.alert("Saved", "Profile updated successfully!");
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome! 🎓</Text>
        <Text style={styles.subtitle}>Please select your current semester to continue.</Text>

        {semesters.map(s => (
          <TouchableOpacity key={s.id} style={styles.semBtn} onPress={() => select(s.id)}>
            <Text style={styles.txt}>{s.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 30, justifyContent: "center", flexGrow: 1 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#1e293b" },
  subtitle: { fontSize: 16, textAlign: "center", color: "#64748b", marginBottom: 40, marginTop: 10 },
  semBtn: { 
    padding: 20, 
    backgroundColor: "#6366f1", 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#6366f1",
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  txt: { color: "white", fontSize: 18, fontWeight: "600" }
});