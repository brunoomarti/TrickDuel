import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        router.replace("/home");
      } else {
        router.replace("/(auth)/login");
      }
    });
  }, []);

  return null;
}
