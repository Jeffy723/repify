import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function AddSubject() {
  const router = useRouter();
  const { sem_id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!name) return Alert.alert("Error", "Enter subject name");
    setLoading(true);
    try {
      const { error } = await supabase
        .from("subjects")
        .insert([{ name, semester_id: sem_id }]);
      if (error) throw error;

      router.replace("/subjects" as any);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>New Subject</Text>

      <TextInput
        placeholder="e.g. DBMS"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={save} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Save</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f8fafc" },
  backBtn: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, color: "#1e293b" },
  input: { backgroundColor: "white", padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  button: { marginTop: 20, backgroundColor: "#6366f1", padding: 18, borderRadius: 12 },
  btnText: { textAlign: "center", color: "white", fontWeight: "bold", fontSize: 18 }
});
