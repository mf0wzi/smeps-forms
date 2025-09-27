"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export async function logout() {
  const jar = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll().map(c => ({ name: c.name, value: c.value })),
        setAll: (arr) => {
          for (const { name, value, options } of arr) {
            jar.set(name, value, options ?? {});
          }
        },
      },
    }
  );

  await supabase.auth.signOut();   // clears HttpOnly session cookies
  redirect("/login");              // hard server redirect
}
