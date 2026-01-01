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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

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

      setProfile(prof);
      setSemester(sem);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

    actionText: { color: COLORS.text, fontWeight: "600", fontSize: 14 },
    actionSubtext: { color: COLORS.muted, fontSize: 12 }
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
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

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/add-assignment")}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(34,197,94,0.15)" }]}>
              <Ionicons name="add" size={22} color="#22c55e" />
            </View>
            <Text style={styles.actionText}>Add Task</Text>
            <Text style={styles.actionSubtext}>Create new</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/assignments")}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(56,189,248,0.15)" }]}>
              <Ionicons name="list" size={22} color="#38bdf8" />
            </View>
            <Text style={styles.actionText}>View Tasks</Text>
            <Text style={styles.actionSubtext}>Check deadlines</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/semesters")}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(245,158,11,0.15)" }]}>
              <Ionicons name="layers" size={22} color="#f59e0b" />
            </View>
            <Text style={styles.actionText}>Semesters</Text>
            <Text style={styles.actionSubtext}>Edit periods</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/profile")}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(99,102,241,0.15)" }]}>
              <Ionicons name="settings-outline" size={22} color="#6366f1" />
            </View>
            <Text style={styles.actionText}>Settings</Text>
            <Text style={styles.actionSubtext}>Edit profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
