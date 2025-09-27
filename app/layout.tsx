// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import ClientProviders from "@/providers/client-providers";
import { getServerUser } from "@/lib/supabase/auth.server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getServerUser();
  const safeUser = user ? { id: user.id, email: user.email ?? undefined } : null;

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value ?? null;
  const initialTheme =
    themeCookie === "dark" ? "dark" : themeCookie === "light" ? "light" : null;

  // Only mutate <html> on the client if we KNOW the cookie, to mirror SSR.
  const preHydrateScript = `
    (function() {
      try {
        var theme = ${initialTheme ? JSON.stringify(initialTheme) : "null"};
        if (!theme) return;
        var html = document.documentElement;
        if (theme === "dark") {
          html.classList.add("dark");
          html.style.colorScheme = "dark";
        } else {
          html.classList.remove("dark");
          html.style.colorScheme = "light";
        }
      } catch(e) {}
    })();
  `;

  // Mirror those attrs on the server when we have a known theme.
  const htmlClass = initialTheme === "dark" ? "dark" : undefined;
  const htmlStyle =
    initialTheme === "dark"
      ? { colorScheme: "dark" as const }
      : initialTheme === "light"
      ? { colorScheme: "light" as const }
      : undefined;

  return (
    <html lang="en" className={htmlClass} style={htmlStyle} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preHydrateScript }} />
      </head>
      <body>
        <ClientProviders initialUser={safeUser} initialTheme={initialTheme}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
