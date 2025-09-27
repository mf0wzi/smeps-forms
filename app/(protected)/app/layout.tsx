// app/(app)/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import MainLayout from "@/components/layout/main-layout"; // ensure this path matches your file
import { getServerUser } from "@/lib/supabase/auth.server";

export const dynamic = "force-dynamic";

export default async function AppGroupLayout({ children }: { children: ReactNode }) {
  try {
    const user = await getServerUser();

    // If unauthenticated, redirect to login (adjust path if your login is under /auth/login)
    if (!user) {
      redirect("/login");
    }

    // Build a minimal, safe user object (avoid passing tokens)
    const safeUser = {
      id: user!.id,
      // keep email optional because it might be null in Supabase
      email: user!.email ?? undefined,
    };

    return <MainLayout user={safeUser}>{children}</MainLayout>;
  } catch (err) {
    // Optional: log server-side for debugging
    // console.error("Error fetching server user in AppGroupLayout", err);
    // If something goes wrong, redirect to login (or render an error UI)
    redirect("/login");
  }
}
