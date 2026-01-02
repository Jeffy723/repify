import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Subjects() {
  const { semesterId } = useLocalSearchParams<{ semesterId?: string }>();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [semester, setSemester] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      let semId = semesterId;

      // 1️⃣ If no semesterId passed, use active semester
      if (!semId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("semester_id")
          .eq("id", user.id)
          .single();

        semId = profile?.semester_id ?? null;
      }

      if (!semId) {
        setSemester(null);
        setSubjects([]);
        return;
      }

      // 2️⃣ Get semester info
      const { data: sem } = await supabase
        .from("semesters")
        .select("*")
        .eq("id", semId)
        .single();

      setSemester(sem);

      // 3️⃣ Get subjects
      const { data: list } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester_id", semId)
        .order("name");

      setSubjects(list ?? []);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [semesterId])
  );

  const deleteSubject = async (id: string) => {
    Alert.alert(
      "Delete Subject",
      "Are you sure you want to delete this subject?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await supabase.from("subjects").delete().eq("id", id);
            load();
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {semester ? semester.name : "No Active Semester"}
        </Text>

        {semester && (
          <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/subjects/add",
      params: { sem_id: semester.id }
    })
  }
>

            <Ionicons name="add" size={26} color="#6366f1" />
          </TouchableOpacity>
        )}
      </View>

      {!semester ? (
        <Text style={styles.empty}>
          Activate a semester to see subjects
        </Text>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No subjects added yet
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/subjects/[id]/assignments",
                  params: { id: item.id }
                })
              }
            >
              <Text style={styles.subjectName}>{item.name}</Text>

              <TouchableOpacity onPress={() => deleteSubject(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  subjectName: { fontSize: 16, fontWeight: "600", color: "#334155" },

  empty: {
    textAlign: "center",
    marginTop: 60,
    color: "#64748b",
    fontSize: 16
  }
});
