import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function SelectSemester() {
  const [semesters, setSemesters] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => { loadSemesters(); }, []);

  const loadSemesters = async () => {
    const { data } = await supabase.from("semesters").select("id, name");
    setSemesters(data || []);
  };

  const select = async (id:string) => {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .update({ semester_id:id })
      .eq("id", userId);

    if (error) return Alert.alert("Error", error.message);

    Alert.alert("Saved", "Semester set successfully");
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Semester</Text>

      {semesters.map(s => (
        <TouchableOpacity key={s.id} style={styles.semBtn} onPress={() => select(s.id)}>
          <Text style={styles.txt}>{s.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:"center" },
  title:{ fontSize:26, fontWeight:"bold", textAlign:"center", marginBottom:30 },
  semBtn:{ padding:18, backgroundColor:"#007AFF", borderRadius:10, marginBottom:15 },
  txt:{ color:"white", fontSize:18, textAlign:"center" }
});
