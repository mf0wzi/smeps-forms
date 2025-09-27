// app/providers/ThemeCookieSync.tsx
"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeCookieSync() {
  const { theme } = useTheme();

  useEffect(() => {
    try {
      document.cookie = `theme=${theme ?? ""}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {}
  }, [theme]);

  return null;
}
