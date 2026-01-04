import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import CommonDialog from "../components/CommonDialog";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    onClose?: () => void;
  } | null>(null);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setDialog({
        title: "Error",
        message: "Please fill all fields",
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setDialog({
        title: "Signup Failed",
        message: error.message,
      });
      return;
    }

    const user = data.user;
    if (!user) return;

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email,
        name,
        semester_id: null,
      });

    if (profileError) {
      setDialog({
        title: "Database Error",
        message: profileError.message,
      });
      return;
    }

    setDialog({
      title: "Success 🎉",
      message: "Account created — now login",
      onClose: () => router.replace("/"),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btnText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.link}>
          Already have account? Login
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
  container: { flex: 1, justifyContent: "center", padding: 25, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 40 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 14, borderRadius: 8, marginBottom: 16 },
  btn: { backgroundColor: "#007BFF", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { textAlign: "center", marginTop: 10, color: "blue" },
});
