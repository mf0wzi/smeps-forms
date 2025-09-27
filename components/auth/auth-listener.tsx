"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

export default function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getBrowserSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "SIGNED_OUT") {
        router.replace("/login");
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
