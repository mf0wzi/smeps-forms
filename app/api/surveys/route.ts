// app/api/surveys/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  // insert into 'surveys' table
  const payload = {
    title: body.title,
    json: body.json,
    is_public: !!body.is_public,
    active: body.active ?? true,
    start_date: body.start_date ?? null,
    end_date: body.end_date ?? null,
    created_by: data.user.id,
  };

  const { error: insertErr } = await supabase.from("surveys").insert([payload]);
  if (insertErr) return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });

  return new Response(JSON.stringify({ ok: true }), { status: 201 });
}
