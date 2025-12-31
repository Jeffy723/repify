import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CR Login</Text>

      <TextInput 
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput 
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>LOGIN</Text>
      </TouchableOpacity>

      <Text onPress={() => router.push("/signup")} style={styles.link}>
        New user? Create Account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1,justifyContent:"center",padding:20,backgroundColor:"white" },
  title:{ fontSize:32,fontWeight:"bold",textAlign:"center",marginBottom:40 },
  input:{ borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:14,marginBottom:14,fontSize:16 },
  btn:{ backgroundColor:"#007BFF",padding:16,borderRadius:8,alignItems:"center" },
  btnText:{ color:"white",fontSize:18,fontWeight:"600" },
  link:{ color:"blue",marginTop:16,textAlign:"center" }
});
