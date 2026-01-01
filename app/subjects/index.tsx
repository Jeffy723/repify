import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, FlatList, View, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Subjects() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [semId, setSemId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prof } = await supabase.from("profiles").select("semester_id").eq("id", user.id).single();
    if (!prof || !prof.semester_id) {
      setSemId(null);
      setSubjects([]);
      setLoading(false);
      return;
    }
    setSemId(prof.semester_id);

    const { data } = await supabase
      .from("subjects")
      .select("*")
      .eq("semester_id", prof.semester_id)
      .order("created_at", { ascending: false });

    setSubjects(data ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subjects</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/subjects/add", params: { sem_id: semId ?? undefined } } as any)}
        >
          <Ionicons name="add" size={26} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={subjects}
        contentContainerStyle={{ padding: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/subjects/[id]/assignments", params: { id: item.id } } as any)}
          >
            <Text style={styles.subjectText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "white" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  card: { backgroundColor: "white", padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  subjectText: { fontSize: 18, color: "#1e293b" }
});
