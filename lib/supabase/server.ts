// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Create a per-request Supabase client. This function awaits cookies() to
 * accommodate environments where cookies() may be a promise.
 *
 * Callers: await createServerSupabase()
 */
export async function createServerSupabase(): Promise<SupabaseClient<Database>> {
  const maybeCookies = cookies();
  const nextCookies = await Promise.resolve(maybeCookies);

  const cookieAdapter = {
    get: (name: string) => {
      const c = nextCookies.get(name);
      return c ? c.value : undefined;
    },
    getAll: () => nextCookies.getAll().map((c) => ({ name: c.name, value: c.value })),
    set: (name: string, value: string, options?: any) => {
      try {
        nextCookies.set(name, value, options);
      } catch {}
    },
    delete: (name: string, options?: any) => {
      try {
        // some runtimes might support delete
        // @ts-ignore
        nextCookies.delete?.(name, options);
      } catch {}
    },
  } as unknown as Parameters<typeof createServerClient>[2]["cookies"];

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { cookies: cookieAdapter }
  );
}
