// app/components/layouts/MainLayout.tsx
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function MainLayout({ children, user }: { children: ReactNode; user?: { id: string; email?: string | null } }) {
  return (
    <SidebarProvider
      style={
        {
          // these match the shadcn block; tweak as you like
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {/* Your pages will render here inside the shell */}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
