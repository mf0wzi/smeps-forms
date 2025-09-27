// app/components/ui/NavbarClient.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { ThemeSwitcher } from "@/components/features/theme-switcher";

export default function NavbarClient() {
  const { user, loading, signOut } = useAuth();
  return (
    <header className="h-14 border-b bg-white dark:bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="font-semibold">SMEPS</Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {loading ? null : user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button onClick={() => signOut()} className="px-3 py-1 rounded bg-rose-500 text-white">Sign out</button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
