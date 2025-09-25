// lib/api/surveys.ts
import { createClient } from "@/lib/supabase/server";

export async function getMySurveys() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized");
  const { data, error } = await supabase.from("surveys").select("*").eq("created_by", userData.user.id);
  if (error) throw error;
  return data;
}
