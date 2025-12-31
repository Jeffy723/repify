import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
    }
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header/Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {profile?.name ? profile.name[0].toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{profile?.name ?? "User"}</Text>
          <Text style={styles.userRole}>Class Representative</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#6366f1" />
              <View style={styles.textContainer}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.value}>{email}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 }]}>
              <Ionicons name="school-outline" size={20} color="#6366f1" />
              <View style={styles.textContainer}>
                <Text style={styles.label}>Member Status</Text>
                <Text style={styles.value}>Verified CR</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.settingsBtn}
            onPress={() => router.push("/semesters")}
          >
            <Ionicons name="options-outline" size={20} color="#1e293b" />
            <Text style={styles.settingsText}>Manage Semesters</Text>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Repify v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 24, alignItems: 'center' },
  avatarSection: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  avatarCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: "#6366f1", 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 15
  },
  avatarLetter: { color: 'white', fontSize: 40, fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  userRole: { fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: '500' },
  infoContainer: { width: '100%', marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12, marginLeft: 4 },
  infoCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  textContainer: { marginLeft: 15 },
  label: { fontSize: 12, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  value: { fontSize: 16, color: '#1e293b', fontWeight: '500', marginTop: 2 },
  actionContainer: { width: '100%' },
  settingsBtn: { 
    backgroundColor: 'white', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2
  },
  settingsText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#1e293b' },
  logoutBtn: { 
    backgroundColor: '#fee2e2', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 18, 
    borderRadius: 16,
    marginTop: 10
  },
  logoutText: { marginLeft: 10, fontSize: 16, fontWeight: '700', color: '#ef4444' },
  versionText: { marginTop: 40, color: '#cbd5e1', fontSize: 12, fontWeight: '600' }
});