import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { supabase } from "../lib/supabase";

export default function AddAssignment() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState<any>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    fetchActiveSemester();
  }, []);

  const fetchActiveSemester = async () => {
    const { data } = await supabase.from("semesters").select("*").eq("is_active", true).maybeSingle();
    setSemester(data);
  };

  const handleDateConfirm = (date: Date) => {
    setDueDate(moment(date).format("YYYY-MM-DD"));
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!title || !subject || !dueDate) return Alert.alert("Error", "Fill all fields");
    if (!semester) return Alert.alert("Error", "No active semester found");

    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
        setLoading(false);
        return Alert.alert("Error", "User session not found. Please log in again.");
    }

    const { error } = await supabase.from("assignments").insert([{
        title,
        subject,
        due_date: dueDate,
        semester_id: semester.id,
        created_by: userId, // Ensure this ID exists in your users table
    }]);

    setLoading(false);
    if (error) return Alert.alert("Database Error", error.message);

    Alert.alert("Success 🎉", "Assignment Added!");
    router.replace("/(tabs)/assignments");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>

        <Text style={styles.titleText}>New Assignment 📚</Text>
        <Text style={styles.subtitle}>Adding to: <Text style={{color: '#6366f1'}}>{semester?.name || "Loading..."}</Text></Text>

        <View style={styles.form}>
          <Text style={styles.label}>Assignment Title</Text>
          <TextInput style={styles.input} placeholder="e.g. Unit Test 1" value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} placeholder="e.g. Mathematics" value={subject} onChangeText={setSubject} />

          <Text style={styles.label}>Deadline</Text>
          <TouchableOpacity style={styles.dateBox} onPress={() => setDatePickerVisible(true)}>
            <Ionicons name="calendar" size={20} color="#6366f1" style={{marginRight: 10}} />
            <Text style={styles.dateText}>{dueDate ? moment(dueDate).format("DD MMM, YYYY") : "Select Date"}</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal isVisible={datePickerVisible} mode="date" onConfirm={handleDateConfirm} onCancel={() => setDatePickerVisible(false)} />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Save Assignment</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 24 },
  backBtn: { marginBottom: 20 },
  titleText: { fontSize: 28, fontWeight: "bold", color: "#1e293b" },
  subtitle: { fontSize: 16, color: "#64748b", marginBottom: 30 },
  form: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: "white", borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: "#e2e8f0" },
  dateBox: { backgroundColor: "white", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#e2e8f0", flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 16, color: "#1e293b" },
  submitBtn: { backgroundColor: "#6366f1", padding: 18, borderRadius: 16, alignItems: 'center', elevation: 4, shadowColor: "#6366f1", shadowOpacity: 0.3, shadowRadius: 8 },
  submitText: { color: "white", fontWeight: "bold", fontSize: 18 }
});