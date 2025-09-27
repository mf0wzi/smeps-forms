// lib/supabase/auth.server.ts
import { createServerSupabase } from "./server";

export async function getServerSession() {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  } catch (err) {
    // if envs missing or other errors, return null so UI can handle gracefully
    // optionally log server-side for debugging
    // console.error("getServerSession failed:", err);
    return null;
  }
}

export async function getServerUser() {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  } catch (err) {
    // console.error("getServerUser failed:", err);
    return null;
  }
}

export async function getServerClaims() {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getClaims();
    return data?.claims ?? null;
  } catch (err) {
    // console.error("getServerClaims failed:", err);
    return null;
  }
}
