// lib/supabase/auth.server.cached.ts
import { cache } from "react";
import { getServerUser, getServerClaims, getServerSession } from "@/lib/supabase/auth.server";

// These are memoized per request (no cross-user leakage)
export const getUserCached    = cache(getServerUser);
export const getClaimsCached  = cache(getServerClaims);
export const getSessionCached = cache(getServerSession);
