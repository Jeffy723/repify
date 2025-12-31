// app/index.tsx
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setLoading(false);

      if (data.session) {
        router.replace("/(tabs)/home");   // user already logged in
      } else {
        router.replace("/login");          // send user to login screen
      }
    };

    checkSession();
  }, []);

  // just a loading screen
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
}
