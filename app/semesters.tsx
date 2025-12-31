import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";

export default function Semesters() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("semesters")
      .select("*")
      .order("created_at", { ascending: false });
    setData(data ?? []);
  };

  const activateSem = async (id: string) => {
    await supabase.from("semesters").update({ is_active: false }).eq("is_active", true);
    await supabase.from("semesters").update({ is_active: true }).eq("id", id);

    Alert.alert("Updated", "Semester switched");
    router.replace("/(tabs)/home");
  };

  return (
    <FlatList
      contentContainerStyle={{ padding: 20 }}
      data={data}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            padding: 18,
            borderRadius: 10,
            backgroundColor: item.is_active ? "#4CAF50" : "#ddd",
            marginBottom: 12
          }}
          onPress={() => activateSem(item.id)}
        >
          <Text style={{ fontSize: 18 }}>
            {item.name} {item.is_active ? "⭐" : ""}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
