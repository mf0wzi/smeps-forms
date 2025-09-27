// app/providers/client-providers.tsx
"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./auth-provider";
import ThemeCookieSync from "./theme-cookie-sync";
import AuthListener from "@/components/auth/auth-listener";

export default function ClientProviders({
  children,
  initialUser,
  initialTheme,
}: {
  children: React.ReactNode;
  initialUser?: any;
  initialTheme?: "dark" | "light" | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem
      storageKey="theme"
      // defaultTheme MUST be set to server's initialTheme so the first render matches SSR
      defaultTheme={initialTheme ?? "system"}
    >
      <ThemeCookieSync />
      <AuthProvider initialUser={initialUser}>
        <AuthListener />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
