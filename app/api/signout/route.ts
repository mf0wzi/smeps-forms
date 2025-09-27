import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST() {
  const jar = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll().map(c => ({ name: c.name, value: c.value })),
        setAll: (arr) => arr.forEach(({ name, value, options }) => jar.set(name, value, options ?? {})),
      },
    }
  );

  await supabase.auth.signOut(); // clears HttpOnly cookies on the server
  return NextResponse.json({ ok: true });
}
