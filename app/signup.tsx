import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !name)
      return Alert.alert("Error", "Please fill all fields");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return Alert.alert("Signup Failed", error.message);

    const user = data.user;
    if (!user) return;

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: email,
        name: name,
        semester_id: null,
      });

    if (profileError) {
      return Alert.alert("Database Error", profileError.message);
    }

    Alert.alert("Success 🎉", "Account created — now login");
    router.replace("/");
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
        <Text style={{ textAlign:"center", marginTop:10, color:"blue" }}>
          Already have account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", padding:25, backgroundColor:"#fff" },
  title:{ fontSize:32, fontWeight:"700", textAlign:"center", marginBottom:40 },
  input:{ borderWidth:1, borderColor:"#ccc", padding:14, borderRadius:8, marginBottom:16 },
  btn:{ backgroundColor:"#007BFF", padding:16, borderRadius:8, alignItems:"center", marginTop:10 },
  btnText:{ color:"#fff", fontSize:18, fontWeight:"600" }
});
