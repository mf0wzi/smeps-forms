// app/components/ui/SidebarClient.tsx  ("use client")
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export default function SidebarClient({ user }: { user?: { id: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true); // allow toggle (desktop)
  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/forms", label: "Forms" },
    { href: "/responses", label: "Responses" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <div className={`flex flex-col h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <div className="text-sm font-semibold">Workspace</div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
          <Menu size={18} />
        </button>
      </div>

      <nav className="px-2 py-4 flex-1 overflow-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`block px-3 py-2 rounded-md text-sm my-1 ${active ? "bg-slate-100 dark:bg-slate-700 font-medium" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
        Signed in as <br />
        <span className="font-medium text-slate-800 dark:text-slate-200">{user?.id ?? "Unknown"}</span>
      </div>
    </div>
  );
}
