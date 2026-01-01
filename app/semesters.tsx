import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Semesters() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("semesters").select("*").order("created_at", { ascending: false });
    setData(data ?? []);
    setLoading(false);
  };

 const activateSem = async (id: string, name: string) => {
  setLoading(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("semesters").update({ is_active: false }).neq("id", id);
    await supabase.from("semesters").update({ is_active: true }).eq("id", id);
    await supabase.from("profiles").update({ semester_id: id }).eq("id", user.id);

    Alert.alert("Activated! 🎓", `${name} is now active`);

    router.push("/subjects" as any);
  } catch (err: any) {
    Alert.alert("Error", err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1e293b" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Semesters</Text>
        <TouchableOpacity onPress={() => router.push("/add-semester")}><Ionicons name="add" size={26} color="#6366f1" /></TouchableOpacity>
      </View>

      <FlatList
        data={data}
        contentContainerStyle={{ padding: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, item.is_active && styles.activeCard]} 
            onPress={() => activateSem(item.id, item.name)}
          >
            <View style={styles.cardInfo}>
              <Text style={[styles.semName, item.is_active && styles.activeText]}>{item.name}</Text>
              {item.is_active && <Text style={styles.badge}>ACTIVE</Text>}
            </View>
            <Ionicons 
              name={item.is_active ? "radio-button-on" : "radio-button-off"} 
              size={24} 
              color={item.is_active ? "#6366f1" : "#cbd5e1"} 
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  card: { backgroundColor: "white", padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  activeCard: { borderColor: '#6366f1', backgroundColor: '#eef2ff' },
  cardInfo: { flex: 1 },
  semName: { fontSize: 18, fontWeight: "600", color: "#334155" },
  activeText: { color: "#6366f1" },
  badge: { fontSize: 10, color: "#6366f1", fontWeight: "bold", marginTop: 4 },
});