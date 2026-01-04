import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { supabase } from "../lib/supabase";
import { useTheme } from "./context/ThemeContext";
import CommonDialog from "../components/CommonDialog";

export default function AddAssignment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subject_id = Array.isArray(params.subjectId)
    ? params.subjectId[0]
    : params.subjectId;

  const { COLORS } = useTheme();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    onClose?: () => void;
  } | null>(null);

  const handleDateConfirm = (date: Date) => {
    setDueDate(moment(date).format("YYYY-MM-DD"));
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!title || !dueDate) {
      setDialog({
        title: "Error",
        message: "Please fill all fields",
      });
      return;
    }

    if (!subject_id) {
      setDialog({
        title: "Error",
        message: "Subject not found",
      });
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      setLoading(false);
      setDialog({
        title: "Error",
        message: "User session not found",
      });
      return;
    }

    const { error } = await supabase.from("assignments").insert({
      title,
      due_date: dueDate,
      subject_id,
      created_by: userId,
    });

    setLoading(false);

    if (error) {
      setDialog({
        title: "Database Error",
        message: error.message,
      });
      return;
    }

    setDialog({
      title: "Success 🎉",
      message: "Assignment added",
      onClose: () => router.back(),
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={[styles.titleText, { color: COLORS.text }]}>
          New Assignment
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: COLORS.muted }]}>
            Assignment Title
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: COLORS.card,
                color: COLORS.text,
                borderColor: COLORS.border,
              },
            ]}
            placeholder="e.g. Unit Test 1"
            placeholderTextColor={COLORS.muted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: COLORS.muted }]}>
            Due Date
          </Text>
          <TouchableOpacity
            style={[
              styles.dateBox,
              {
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
              },
            ]}
            onPress={() => setDatePickerVisible(true)}
          >
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
            <Text style={[styles.dateText, { color: COLORS.text }]}>
              {dueDate
                ? moment(dueDate).format("DD MMM, YYYY")
                : "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />

        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: COLORS.primary,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitText}>Save Assignment</Text>
          )}
        </TouchableOpacity>
      </View>

      <CommonDialog
        visible={!!dialog}
        title={dialog?.title ?? ""}
        message={dialog?.message ?? ""}
        onClose={() => {
          dialog?.onClose?.();
          setDialog(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  backBtn: { marginBottom: 20 },

  titleText: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },

  form: { marginBottom: 30 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },

  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },

  dateBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dateText: { fontSize: 16 },

  submitBtn: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
  },

  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
