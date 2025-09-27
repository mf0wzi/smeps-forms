// app/providers/AuthProvider.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User, SupabaseClient } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/client";

type AuthContextType = {
  supabase: SupabaseClient | null;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithMagicLink: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
  initialSession,
}: {
  children: React.ReactNode;
  initialUser?: Partial<User> | null;
  initialSession?: Session | null;
}) {
  const router = useRouter();
  // supabase client instance (will be set on client)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const [user, setUser] = useState<User | null>((initialSession?.user as User) ?? (initialUser as User) ?? null);
  const [session, setSession] = useState<Session | null>(initialSession ?? null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // this effect only runs in the browser
    const sb = getBrowserSupabase();
    setSupabase(sb);

    let mounted = true;

    // hydrate session once
    sb.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? initialSession ?? null);
      setUser((data.session?.user as User) ?? (initialUser as User) ?? null);
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setLoading(false);
    });

    // subscribe to auth changes
    const { data: listener } = sb.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const signOut = async () => {
    if (!supabase) return;
    // 1) Clear client-side state
    await supabase.auth.signOut();
    // 2) Clear HttpOnly cookie on the server
    // 2) Clear HttpOnly cookie on server
    try {
      await fetch("/api/signout", {
        method: "POST",
        cache: "no-store",
        credentials: "same-origin",
        keepalive: true, // helps if the page unloads quickly
      });
    } catch (e) {
      // ignore—fallback nav below still gets user off protected pages
      console.error("signout api failed", e);
    }
    // 3) Navigate immediately so middleware/guards re-run
    router.replace("/login");
    router.refresh();
  };

  const signInWithPassword = (email: string, password: string) =>
    supabase ? supabase.auth.signInWithPassword({ email, password }) : Promise.reject(new Error("Supabase not initialized"));

  const signInWithMagicLink = (email: string) =>
    supabase ? supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/magic-callback` } }) : Promise.reject(new Error("Supabase not initialized"));

  const value: AuthContextType = {
    supabase,
    user,
    session,
    loading,
    signOut,
    signInWithPassword,
    signInWithMagicLink,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
