import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import CommonDialog from "../../../components/CommonDialog";

export default function EditAssignment() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    onClose?: () => void;
  } | null>(null);

  useEffect(() => {
    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    const { data } = await supabase
      .from("assignments")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setTitle(data.title);
      setSubject(data.subject);
      setDueDate(data.due_date);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title || !subject || !dueDate) {
      setDialog({
        title: "Error",
        message: "Please fill all fields",
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("assignments")
      .update({ title, subject, due_date: dueDate })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setDialog({
        title: "Update failed",
        message: error.message,
      });
      return;
    }

    setDialog({
      title: "Updated 🎉",
      message: "Assignment has been updated",
      onClose: () => router.replace("/(tabs)/assignments"),
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✏ Edit Assignment</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? "Saving..." : "💾 Save"}
        </Text>
      </TouchableOpacity>

      <CommonDialog
        visible={!!dialog}
        title={dialog?.title ?? ""}
        message={dialog?.message ?? ""}
        onClose={() => {
          dialog?.onClose?.();
          setDialog(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
  },
  saveText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
