import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { supabase } from "../lib/supabase";

export default function Semesters() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("semesters")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setData(data ?? []);
    }
    setLoading(false);
  };

 useEffect(() => {
  load();
}, []);



 const activateSem = async (id: string, name: string, isActive: boolean) => {
  if (isActive) return;

  // optimistic UI
  setData((prev) =>
    prev.map((s) => ({
      ...s,
      is_active: s.id === id,
    }))
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    await supabase.from("semesters").update({ is_active: false }).neq("id", id);
    await supabase.from("semesters").update({ is_active: true }).eq("id", id);

    await supabase
      .from("profiles")
      .update({ semester_id: id })
      .eq("id", user.id);

    Alert.alert("Activated 🎓", `${name} is now active`);
  } catch (err: any) {
    Alert.alert("Error", err.message);
    load(); // rollback only on error
  }
};


  const deleteSemester = async (id: string, isActive: boolean) => {
    if (isActive) {
      return Alert.alert(
        "Not allowed",
        "You cannot delete the active semester."
      );
    }

    // check if subjects exist
    const { data: subjects } = await supabase
      .from("subjects")
      .select("id")
      .eq("semester_id", id)
      .limit(1);

    if (subjects && subjects.length > 0) {
      return Alert.alert(
        "Cannot delete",
        "This semester has subjects. Delete subjects first."
      );
    }

    Alert.alert(
      "Delete Semester",
      "Are you sure you want to delete this semester?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await supabase.from("semesters").delete().eq("id", id);
            load();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Manage Semesters</Text>

        <TouchableOpacity onPress={() => router.push("/add-semester")}>
          <Ionicons name="add" size={26} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No semesters added yet</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, item.is_active && styles.activeCard]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.semName, item.is_active && styles.activeText]}>
                {item.name}
              </Text>
              {item.is_active && <Text style={styles.badge}>ACTIVE</Text>}
            </View>

            {/* Open */}
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() =>
                router.push({
                  pathname: "/subjects",
                  params: { semesterId: item.id }
                })
              }
            >
              <Text style={styles.openText}>Open</Text>
            </TouchableOpacity>

            {/* Activate */}
            {!item.is_active && (
              <TouchableOpacity
                style={styles.activateBtn}
                onPress={() =>
                  activateSem(item.id, item.name, item.is_active)
                }
              >
                <Text style={styles.activateText}>Activate</Text>
              </TouchableOpacity>
            )}

            {/* Delete */}
            <TouchableOpacity
              onPress={() => deleteSemester(item.id, item.is_active)}
              disabled={item.is_active}
              style={{ opacity: item.is_active ? 0.4 : 1 }}
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9"
  },

  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b"
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10
  },

  activeCard: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff"
  },

  semName: { fontSize: 18, fontWeight: "600", color: "#334155" },
  activeText: { color: "#6366f1" },

  badge: {
    fontSize: 10,
    color: "#6366f1",
    fontWeight: "bold",
    marginTop: 4
  },

  openBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6366f1"
  },
  openText: {
    color: "#6366f1",
    fontWeight: "600"
  },

  activateBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#6366f1"
  },
  activateText: {
    color: "white",
    fontWeight: "600"
  }
});
