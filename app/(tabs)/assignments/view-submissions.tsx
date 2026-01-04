import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { useTheme } from "../../context/ThemeContext";

export default function ViewSubmissions() {
  const router = useRouter();
  const { assignmentId } = useLocalSearchParams<{ assignmentId: string }>();
  const { COLORS } = useTheme();

  const [submitted, setSubmitted] = useState<any[]>([]);
  const [notSubmitted, setNotSubmitted] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"submitted" | "pending">("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assignmentId) load();
  }, [assignmentId]);

  const load = async () => {
    try {
      const { data: students } = await supabase
        .from("students")
        .select("*")
        .order("roll_no");

      const { data: submissions } = await supabase
        .from("submissions")
        .select("student_id, submitted")
        .eq("assignment_id", assignmentId);

      const submittedSet = new Set(
        submissions?.filter((s) => s.submitted).map((s) => s.student_id)
      );

      const submittedList: any[] = [];
      const notSubmittedList: any[] = [];

      students?.forEach((student) => {
        if (submittedSet.has(student.id)) {
          submittedList.push(student);
        } else {
          notSubmittedList.push(student);
        }
      });

      setSubmitted(submittedList);
      setNotSubmitted(notSubmittedList);
    } catch (e) {
      console.error("View submissions error:", e);
    } finally {
      setLoading(false);
    }
  };

  const data = activeTab === "submitted" ? submitted : notSubmitted;

  const renderStudent = ({ item }: any) => (
    <View
      style={[
        styles.card,
        { backgroundColor: COLORS.card, borderColor: COLORS.border },
      ]}
    >
      <Text style={[styles.name, { color: COLORS.text }]}>{item.name}</Text>
      <Text style={[styles.roll, { color: COLORS.muted }]}>
        Roll No: {item.roll_no}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.bg }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: COLORS.text }]}>
          View Submissions
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* SEGMENTED CONTROL */}
      <View style={styles.segment}>
        <TouchableOpacity
          style={[
            styles.segmentItem,
            activeTab === "submitted" && styles.segmentActive,
          ]}
          onPress={() => setActiveTab("submitted")}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "submitted" && styles.segmentTextActive,
            ]}
          >
            Submitted ({submitted.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentItem,
            activeTab === "pending" && styles.segmentActive,
          ]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "pending" && styles.segmentTextActive,
            ]}
          >
            Not Submitted ({notSubmitted.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: COLORS.muted }]}>
            {activeTab === "submitted"
              ? "No submissions yet"
              : "Everyone has submitted 🎉"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER FIX: stays below Wi-Fi / status bar */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,     // 👈 fixes overlap
    paddingBottom: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  /* SEGMENT */
  segment: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#0b1022",
    borderRadius: 14,
    padding: 4,
  },

  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  segmentActive: {
    backgroundColor: "#0ea5e9", // blue for BOTH tabs
  },

  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
  },

  segmentTextActive: {
    color: "#ffffff",
  },

  /* LIST */
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  roll: {
    fontSize: 13,
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
  },
});
