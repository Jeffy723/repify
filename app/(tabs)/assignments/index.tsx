import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../lib/supabase";

export default function AssignmentsScreen() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSemester, setActiveSemester] = useState<any>(null);

  // Function to pull data from Supabase
  const loadData = async () => {
    setLoading(true);
    const { data: sem } = await supabase
      .from("semesters")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    setActiveSemester(sem);

    if (!sem) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("semester_id", sem.id)
      .order("due_date", { ascending: true });

    if (!error) setAssignments(data ?? []);
    setLoading(false);
  };

  // 🔁 THIS IS THE CRITICAL PART: 
  // It triggers every time the user clicks the "Assignments" tab
  // or navigates back from the "Details" screen.
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderItem = ({ item }: any) => {
    const today = new Date();
    const due = new Date(item.due_date);
    const isOverdue = due < today;

    return (
      <TouchableOpacity
        style={[styles.card, isOverdue && styles.overdueBorder]}
        onPress={() => router.push(`/assignments/assignment-details?id=${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          {isOverdue && <Text style={styles.overdueBadge}>OVERDUE</Text>}
        </View>
        <Text style={styles.sub}>📘 {item.subject}</Text>
        <Text style={styles.date}>
          <Ionicons name="calendar-outline" size={14} color="#6366f1" /> Due: {moment(item.due_date).format("DD MMM, YYYY")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Assignments</Text>
        <TouchableOpacity onPress={() => router.push("/add-assignment")} style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
      ) : assignments.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No assignments yet 📭</Text>
        </View>
      ) : (
        <FlatList
          data={assignments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          refreshing={loading}
          onRefresh={loadData}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20 },
  header: { fontSize: 28, fontWeight: "bold", color: "#1e293b" },
  addBtn: { backgroundColor: "#4F46E5", flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "bold", marginLeft: 4 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overdueBorder: { borderLeftWidth: 5, borderLeftColor: "#ef4444" },
  overdueBadge: { color: "#ef4444", fontSize: 10, fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  sub: { fontSize: 14, color: "#64748b", marginTop: 4 },
  date: { marginTop: 10, fontWeight: "600", color: "#6366f1" },
  empty: { textAlign: "center", fontSize: 16, color: "#94a3b8", marginTop: 40 },
});