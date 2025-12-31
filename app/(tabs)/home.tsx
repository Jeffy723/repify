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

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [semester, setSemester] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
      setProfile(prof);

      const { data: sem } = await supabase.from("semesters").select("*").eq("is_active", true).maybeSingle();
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{profile?.name ?? "CR"}</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle} onPress={() => router.push("/profile")}>
            <Ionicons name="person" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Current Semester</Text>
            <Text style={styles.statValue}>
              {semester ? semester.name : "None Active"}
            </Text>
          </View>
          <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
            <Ionicons name="school-outline" size={28} color="#6366f1" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#6366f1' }]} 
            onPress={() => router.push("/add-assignment")}
          >
            <Ionicons name="add-circle" size={32} color="white" />
            <Text style={styles.actionText}>Add Assignment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#10b981' }]} 
            onPress={() => router.push("/assignments")}
          >
            <Ionicons name="library" size={32} color="white" />
            <Text style={styles.actionText}>View Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#f59e0b' }]} 
            onPress={() => router.push("/semesters")}
          >
            <Ionicons name="repeat" size={32} color="white" />
            <Text style={styles.actionText}>Manage Sem</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#ef4444' }]} 
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="settings" size={32} color="white" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  greeting: { fontSize: 16, color: "#64748b", fontWeight: "500" },
  userName: { fontSize: 28, fontWeight: "bold", color: "#1e293b" },
  profileCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "white", justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statCard: { backgroundColor: "white", padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 10 },
  statInfo: { flex: 1, marginRight: 12 },
  statLabel: { fontSize: 14, color: "#94a3b8", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  iconBox: { padding: 12, borderRadius: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 15 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '47%', height: 120, borderRadius: 20, padding: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  actionText: { color: "white", marginTop: 10, fontWeight: "600", fontSize: 14 }
});