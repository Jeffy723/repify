import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function AddSemester() {
  const [name, setName] = useState("");

  const saveSem = async () => {
    if (!name) return Alert.alert("Error", "Enter semester name");

    // deactivate old semesters
    await supabase.from("semesters").update({ is_active: false }).eq("is_active", true);

    // insert new semester
    const { error } = await supabase.from("semesters").insert([
      { name, is_active: true }
    ]);

    if (error) return Alert.alert("Error", error.message);

    Alert.alert("Success!", "Semester added");
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Semester 📘</Text>
      <TextInput
        placeholder="Eg: S6 CSE"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={saveSem}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", padding:25 },
  title:{ fontSize:28, fontWeight:"bold", textAlign:"center", marginBottom:20 },
  input:{ borderWidth:1, borderColor:"#ccc", padding:14, borderRadius:8, marginBottom:16 },
  button:{ backgroundColor:"#007AFF", padding:16, borderRadius:8 },
  buttonText:{ color:"white", textAlign:"center", fontSize:18, fontWeight:"600" }
});
