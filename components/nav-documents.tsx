// components/nav-documents.tsx
"use client";

import Link from "next/link";
import { NavIcon } from "@/components/nav-icon";
// If you have a shared type:
// import type { NavItem } from "@/lib/nav/types";

type NavItem = {
  id?: string;
  title: string;         // ← use title, not name
  url: string;
  iconId?: string;
};

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavDocuments({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, idx) => (
            <SidebarMenuItem
              key={item.id ?? item.url ?? `${item.title}-${idx}`}
            >
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <NavIcon id={item.iconId as any} />
                  <span>{item.title}</span> {/* ← title */}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
