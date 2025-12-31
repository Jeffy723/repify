import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { supabase } from "../lib/supabase";

export default function AddAssignment() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [semesterId, setSemesterId] = useState<string | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Fetch CR semester id
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      const userId = user?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("semester_id")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setSemesterId(data.semester_id);
      }
    };

    fetchProfile();
  }, []);

  const handleDateConfirm = (date: Date) => {
    const formatted = moment(date).format("DD-MM-YYYY");
    setDueDate(formatted);
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!title || !subject || !dueDate)
      return Alert.alert("Error", "Please fill all fields");

    if (!semesterId)
      return Alert.alert("Error", "Semester not found for this CR");

    setLoading(true);

    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;

    const { error } = await supabase.from("assignments").insert([
      {
        title,
        subject,
        due_date: dueDate,
        active: true,
        semester_id: semesterId,   // correct UUID
        created_by: userId,
      }
    ]);

    setLoading(false);

    if (error) return Alert.alert("Error", error.message);

    Alert.alert("Success", "Assignment Added!");
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Assignment 📚</Text>

      <TextInput
        placeholder="Assignment Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Subject Name"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />

      <TouchableOpacity style={styles.dateBox} onPress={() => setDatePickerVisible(true)}>
        <Text style={styles.dateText}>
          {dueDate ? dueDate : "Select Due Date (DD-MM-YYYY)"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Saving..." : "Save Assignment"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:"center", backgroundColor:"white" },
  title:{ fontSize:28, fontWeight:"bold", textAlign:"center", marginBottom:20 },
  input:{ borderWidth:1, borderColor:"#ccc", borderRadius:8, padding:14, marginBottom:12, fontSize:16 },
  dateBox:{ borderWidth:1, borderColor:"#aaa", padding:14, borderRadius:8, marginBottom:12 },
  dateText:{ fontSize:16, color:"#555" },
  btn:{ backgroundColor:"#007AFF", padding:18, borderRadius:10, marginTop:10 },
  btnText:{ color:"white", textAlign:"center", fontWeight:"bold", fontSize:18 }
});
