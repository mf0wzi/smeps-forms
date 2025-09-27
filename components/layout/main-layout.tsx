// app/components/layouts/MainLayout.tsx
import type { ReactNode } from "react";
import NavbarClient from "@/components/section/navbar-client";
import Footer from "@/components/section/footer-client";

export default function MainLayout({ children, user }: { children: ReactNode; user?: { id: string; email?: string | null } }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <NavbarClient />
      <main className="max-w-6xl mx-auto p-6 md:p-8">{children}</main>
      <Footer />
    </div>
  );
}
