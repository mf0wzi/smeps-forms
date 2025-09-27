// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

declare global {
  // reuse client across HMR in dev
  // eslint-disable-next-line no-var
  var __supabase_browser_client__: SupabaseClient<Database> | undefined;
}

/**
 * Returns a browser-only Supabase client. Must be called on the client.
 * Throws if called on the server.
 */
export function getBrowserSupabase(): SupabaseClient<Database> {
  if (typeof window === "undefined") {
    throw new Error("getBrowserSupabase() must be called in the browser");
  }

  const g = globalThis as unknown as { __supabase_browser_client__?: SupabaseClient<Database> };

  if (!g.__supabase_browser_client__) {
    g.__supabase_browser_client__ = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
  }

  return g.__supabase_browser_client__;
}
