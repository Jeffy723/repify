import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <View style={{ flex:1,justifyContent:"center",alignItems:"center" }}>
      <Text style={{ fontSize:26, marginBottom:20 }}>Profile</Text>
      <TouchableOpacity onPress={logout} style={{ backgroundColor:"red", padding:14, borderRadius:8 }}>
        <Text style={{ color:"white", fontSize:18 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
