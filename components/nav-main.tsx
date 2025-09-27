// components/nav-main.tsx (CLIENT)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/nav-icon";
import type { NavItem } from "@/lib/nav/types";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const active =
              pathname === item.url || pathname.startsWith(item.url + "/");
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  aria-current={active ? "page" : undefined}
                  data-active={active}
                  className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Link href={item.url}>
                    <NavIcon id={item.iconId} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
