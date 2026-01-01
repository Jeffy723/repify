import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../context/ThemeContext"; // Import Global Theme

export default function Profile() {
  const router = useRouter();
  const { COLORS, dark } = useTheme(); // Access global theme and dark mode state
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

  // Define dynamic styles based on global COLORS
  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
    content: { padding: 24, alignItems: 'center' },
    avatarSection: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
    avatarCircle: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        backgroundColor: COLORS.primary, // Uses dynamic accent green/blue
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        marginBottom: 15
    },
    avatarLetter: { color: 'white', fontSize: 40, fontWeight: 'bold' },
    userName: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
    userRole: { fontSize: 14, color: COLORS.muted, marginTop: 4, fontWeight: '500' },
    infoContainer: { width: '100%', marginBottom: 30 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12, marginLeft: 4 },
    infoCard: { 
        backgroundColor: COLORS.card, 
        borderRadius: 20, 
        padding: 20, 
        width: '100%',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    textContainer: { marginLeft: 15 },
    label: { fontSize: 12, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase' },
    value: { fontSize: 16, color: COLORS.text, fontWeight: '500', marginTop: 2 },
    actionContainer: { width: '100%' },
    settingsBtn: { 
        backgroundColor: COLORS.card, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 18, 
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    settingsText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: COLORS.text },
    logoutBtn: { 
        backgroundColor: dark ? "#450a0a" : "#fee2e2", // Darker red background for dark mode
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 18, 
        borderRadius: 16,
        marginTop: 10
    },
    logoutText: { marginLeft: 10, fontSize: 16, fontWeight: '700', color: "#ef4444" },
    versionText: { marginTop: 40, color: COLORS.muted, fontSize: 12, fontWeight: '600' }
  });

  if (loading) {
    return (
      <View style={dynamicStyles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        
        {/* Header/Avatar Section */}
        <View style={dynamicStyles.avatarSection}>
          <View style={dynamicStyles.avatarCircle}>
            <Text style={dynamicStyles.avatarLetter}>
              {profile?.name ? profile.name[0].toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={dynamicStyles.userName}>{profile?.name ?? "User"}</Text>
          <Text style={dynamicStyles.userRole}>Class Representative</Text>
        </View>

        {/* Info Section */}
        <View style={dynamicStyles.infoContainer}>
          <Text style={dynamicStyles.sectionTitle}>Account Information</Text>
          
          <View style={dynamicStyles.infoCard}>
            <View style={dynamicStyles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <View style={dynamicStyles.textContainer}>
                <Text style={dynamicStyles.label}>Email Address</Text>
                <Text style={dynamicStyles.value}>{email}</Text>
              </View>
            </View>

            <View style={[dynamicStyles.infoRow, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 15 }]}>
              <Ionicons name="school-outline" size={20} color={COLORS.primary} />
              <View style={dynamicStyles.textContainer}>
                <Text style={dynamicStyles.label}>Member Status</Text>
                <Text style={dynamicStyles.value}>Verified CR</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={dynamicStyles.actionContainer}>
          <TouchableOpacity 
            style={dynamicStyles.settingsBtn}
            onPress={() => router.push("/semesters")}
          >
            <Ionicons name="options-outline" size={20} color={COLORS.text} />
            <Text style={dynamicStyles.settingsText}>Manage Semesters</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={dynamicStyles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={dynamicStyles.versionText}>Repify v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}