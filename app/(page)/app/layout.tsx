
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";

export default function AppLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>{children}</>
  );
}
