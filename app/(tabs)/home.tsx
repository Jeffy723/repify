import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const router = useRouter();
  const { dark, COLORS } = useTheme();

  const [profile, setProfile] = useState<any>(null);
  const [semester, setSemester] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: sem } = await supabase
        .from("semesters")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      const { data: subs } = await supabase
        .from("subjects")
        .select("id,name,semester_id")
        .eq("semester_id", sem?.id);

      setProfile(prof);
      setSemester(sem);
      setSubjects(subs ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
    scrollContent: { padding: 20 },

    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 30 },
    greeting: { fontSize: 16, color: COLORS.muted },
    userName: { fontSize: 28, fontWeight: "bold", color: COLORS.text },

    profileCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.border
    },

    statCard: {
      backgroundColor: COLORS.card,
      padding: 20,
      borderRadius: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
      borderWidth: 1,
      borderColor: COLORS.border
    },

    statLabel: { fontSize: 14, color: COLORS.muted },
    statValue: { fontSize: 20, fontWeight: "bold", color: COLORS.text },

    sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 15 },

    actionGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

    actionCard: {
      width: "47%",
      height: 120,
      backgroundColor: COLORS.card,
      borderRadius: 20,
      padding: 15,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: COLORS.border
    },

    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8
    },

    actionText: { color: COLORS.text, fontWeight: "600", fontSize: 14 }
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{profile?.name ?? "CR"}</Text>
          </View>

          <TouchableOpacity style={styles.profileCircle} onPress={() => router.push("/profile")}>
            <Ionicons name="person" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statCard}>
          <View>
            <Text style={styles.statLabel}>Current Semester</Text>
            <Text style={styles.statValue}>{semester?.name ?? "None Active"}</Text>
          </View>
          <Ionicons name="school-outline" size={28} color={COLORS.primary} />
        </View>

        <Text style={styles.sectionTitle}>Subjects</Text>

        <View style={styles.actionGrid}>
          {subjects.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={styles.actionCard}
              onPress={() => router.push(`/subject/${sub.id}`)}
            >
              <View style={[styles.iconCircle, { backgroundColor: "rgba(56,189,248,0.15)" }]}>
                <Ionicons name="book-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>{sub.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
