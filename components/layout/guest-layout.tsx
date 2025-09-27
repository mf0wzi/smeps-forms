// app/components/layouts/GuestLayout.tsx
import type { ReactNode } from "react";
import NavbarGuest from "@/components/section/navbar-guest";
import Footer from "@/components/section/footer-guest";

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <NavbarGuest />
      <main className="w-full max-w-lg p-6">{children}</main>
      <Footer />
    </div>
  );
}
