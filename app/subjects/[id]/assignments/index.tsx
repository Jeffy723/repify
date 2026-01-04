import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../../lib/supabase";
import { useTheme } from "../../../context/ThemeContext";
import CommonDialog from "../../../../components/CommonDialog";

export default function SubjectPage() {
  const router = useRouter();
  const { id: subjectId } = useLocalSearchParams<{ id: string }>();
  const { COLORS } = useTheme();

  const [subject, setSubject] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (subjectId) load();
    }, [subjectId])
  );

  const load = async () => {
    try {
      const { data: sub } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      setSubject(sub);

      const { data: list } = await supabase
        .from("assignments")
        .select("*")
        .eq("subject_id", subjectId)
        .order("due_date", { ascending: true });

      setAssignments(list ?? []);
    } catch (e) {
      console.error("Load subject error:", e);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await supabase.from("assignments").delete().eq("id", deleteId);
    setDeleteId(null);
    load();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.bg }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: COLORS.text }]}>
          {subject?.name ?? "Subject"}
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/add-assignment",
              params: { subjectId },
            })
          }
        >
          <Ionicons name="add" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Assignments */}
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text
            style={{
              color: COLORS.muted,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No assignments added yet
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: COLORS.card, borderColor: COLORS.border },
            ]}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/assignments/assignment-details",
                params: { assignmentId: item.id },
              })
            }
          >
            <View>
              <Text style={[styles.title, { color: COLORS.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.due, { color: COLORS.muted }]}>
                Due: {item.due_date ?? "No date"}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setDeleteId(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* DELETE CONFIRMATION */}
      <CommonDialog
        visible={!!deleteId}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment?"
        onClose={() => {
          confirmDelete();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 50,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  due: {
    fontSize: 13,
    marginTop: 4,
  },
});
