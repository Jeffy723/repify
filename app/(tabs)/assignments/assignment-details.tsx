import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../lib/supabase";

export default function AssignmentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadAssignment();
  }, [id]);

  const loadAssignment = async () => {
    const { data } = await supabase.from("assignments").select("*").eq("id", id).single();
    if (data) setAssignment(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this assignment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          const { error } = await supabase.from("assignments").delete().eq("id", id);
          
          if (error) {
            Alert.alert("Error", "Could not delete assignment");
            setLoading(false);
          } else {
            // Navigate back. useFocusEffect in the index file will auto-refresh the list.
            router.back();
          }
        },
      },
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (!assignment) return <View style={styles.center}><Text>Assignment not found.</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity onPress={() => router.push(`/assignments/edit?id=${id}`)}>
          <Ionicons name="create-outline" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{assignment.title}</Text>
        <View style={styles.row}>
          <Ionicons name="book-outline" size={20} color="#64748b" />
          <Text style={styles.infoText}>{assignment.subject}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={20} color="#64748b" />
          <Text style={styles.infoText}>Due: {moment(assignment.due_date).format("DD MMMM, YYYY")}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteBtnText}>Delete Assignment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 20, elevation: 3, shadowOpacity: 0.1 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b", marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 16, color: "#475569", marginLeft: 10 },
  deleteBtn: { 
    marginTop: "auto", 
    backgroundColor: "#ef4444", 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 15 
  },
  deleteBtnText: { color: "#fff", fontWeight: "bold", marginLeft: 8, fontSize: 16 }
});