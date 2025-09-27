// components/nav-secondary.tsx
"use client";

import Link from "next/link";
import type { IconId } from "@/lib/nav/icon-ids";
import { NavIcon } from "@/components/nav-icon"; // ← import this
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type SecondaryItem = {
  id?: string;
  title: string;
  url: string;
  iconId?: IconId; // ← optional unless guaranteed
};

export function NavSecondary({
  items,
  className,
}: {
  items: SecondaryItem[];
  className?: string;
}) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, idx) => (
            <SidebarMenuItem
              key={item.id ?? item.url ?? `${item.title}-${idx}`}
            >
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <NavIcon id={item.iconId} className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
