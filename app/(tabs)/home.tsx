import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [semester, setSemester] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    // Fetch profile (name + semester_id)
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(prof);

    // Fetch active semester
    const { data: sem } = await supabase
      .from("semesters")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    setSemester(sem);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome {profile?.name ?? "CR"} 🎓
      </Text>
      <Text style={styles.subtitle}>
        Manage class assignments below
      </Text>

      {/* NO SEMESTER YET */}
      {!semester && (
        <>
          <Text style={styles.warning}>⚠️ No active semester found</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF9800" }]}
            onPress={() => router.push("/add-semester")}
          >
            <Text style={styles.buttonText}>➕ Add Semester</Text>
          </TouchableOpacity>
        </>
      )}

      {/* WHEN SEMESTER EXISTS */}
      {semester && (
        <>
          <Text style={styles.semesterText}>
            📘 Active Semester: {semester.name}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/add-assignment")}
          >
            <Text style={styles.buttonText}>➕ Add Assignment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4CAF50" }]}
            onPress={() => router.push("/assignments")}
          >
            <Text style={styles.buttonText}>📚 View Assignments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#A020F0" }]}
            onPress={() => router.push("/semesters")}
          >
            <Text style={styles.buttonText}>🔁 Switch Semester</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.6, marginBottom: 30 },
  warning: { fontSize: 16, color: "red", marginBottom: 20 },
  semesterText: { fontSize: 18, marginBottom: 30 },
  button: {
    width: "80%",
    padding: 18,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    marginBottom: 15,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600", textAlign: "center" },
});
