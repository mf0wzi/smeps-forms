// lib/nav/get-nav.server.ts
import { cache } from "react";
import { getUserCached, getClaimsCached } from "@/lib/supabase/auth.server.cached";
import type { NavData, NavItem } from "./types";
import { ICON_IDS, type IconId } from "./icon-ids"; // adjust path if your file lives elsewhere

// ---------- RBAC helper ----------
const order = { user: 0, manager: 1, admin: 2 } as const;
function allow(item: NavItem, roles: string[]) {
  const need = item.minRole ?? "user";
  const has = roles.includes("admin")
    ? "admin"
    : roles.includes("manager")
    ? "manager"
    : "user";
  return order[has] >= order[need];
}

// ---------- Static config with literal types ----------
const NAV_MAIN = [
  { title: "Dashboard", url: "/app",           iconId: "dashboard", minRole: "user" },
  { title: "Forms", url: "/app/Forms", iconId: "forms", minRole: "user" },
  { title: "Analytics", url: "/app/analytics", iconId: "analytics", minRole: "user" },
  { title: "Projects",  url: "/app/projects",  iconId: "projects",  minRole: "user" },
  { title: "Users",      url: "/app/users",      iconId: "users",      minRole: "manager" },
] as const satisfies readonly NavItem[];

const NAV_DOCS = [
  { title: "Data Library",   url: "/app/data",    iconId: "database" },
  { title: "Reports",        url: "/app/reports", iconId: "report",   minRole: "manager" },
  { title: "Word Assistant", url: "/app/word",    iconId: "word" },
] as const satisfies readonly NavItem[];

const NAV_SECONDARY = [
  { title: "Settings", url: "/app/settings", iconId: "settings", minRole: "admin"},
  { title: "Get Help", url: "/app/help",     iconId: "help" },
  { title: "Search",   url: "/app/search",   iconId: "search" },
] as const satisfies readonly NavItem[];

// ---------- Config-driven builder ----------
type BuildNavInput = { roles: string[]; userName: string; email: string };

function configNav({ roles, userName, email }: BuildNavInput): NavData {
  return {
    user: { name: userName, email },
    navMain: [...NAV_MAIN.filter((i) => allow(i, roles))],
    navDocuments: [...NAV_DOCS.filter((i) => allow(i, roles))],
    navSecondary: [...NAV_SECONDARY],
  };
}

// ---------- (Optional) DB-driven example ----------
type DbRow = {
  id: string;
  title: string;
  url: string;
  icon_id?: string;
  min_role?: "user" | "manager" | "admin";
  section: "main" | "docs" | "secondary";
};

function toIconId(s?: string): IconId | undefined {
  return s && (ICON_IDS as readonly string[]).includes(s) ? (s as IconId) : undefined;
}

function toNavItem(r: DbRow): NavItem {
  return {
    id: r.id,
    title: r.title,
    url: r.url,
    iconId: toIconId(r.icon_id),   // validate to your union
    minRole: r.min_role,           // already a union
  };
}

// export to silence noUnusedLocals (or reference via flag below)
export async function dbNav(userId: string, roles: string[]): Promise<NavData> {
  // const supabase = await createServerSupabase();
  // const { data } = await supabase.from("nav_items").select("*");
  const data: DbRow[] = []; // replace with real fetch

  const by = (section: DbRow["section"]) =>
    data.filter((r) => r.section === section).map(toNavItem).filter((i) => allow(i, roles));

  return {
    user: { name: "User", email: "u@example.com" }, // fetch profile if needed
    navMain: by("main"),
    navDocuments: by("docs"),
    navSecondary: by("secondary"),
  };
}

// ---------- Public API ----------
const USE_DB_NAV = process.env.NAV_SOURCE === "db";

export const getNavData = cache(async (): Promise<NavData> => {
  const user = await getUserCached();
  const claims = await getClaimsCached();

  const roles = Array.isArray(claims?.roles) ? (claims!.roles as string[]) : ["user"];
  const email = user?.email ?? "user@example.com";
  const userName =
    (user?.user_metadata as any)?.full_name ??
    email.split("@")[0] ??
    "User";

  if (USE_DB_NAV && user) {
    return dbNav(user.id, roles);
  }
  return configNav({ roles, userName, email });
});
