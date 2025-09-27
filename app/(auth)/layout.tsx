// app/(auth)/layout.tsx
import type { ReactNode } from "react";
import GuestLayout from "@/components/layout/guest-layout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <GuestLayout>{children}</GuestLayout>;
}
