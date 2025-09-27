// lib/nav/types.ts
import type { IconId } from "./icon-ids";

export type NavItem = {
  id?: string;
  title: string;
  url: string;
  iconId?: IconId;
  minRole?: "user" | "manager" | "admin";
};

export type NavData = {
  user: { name: string; email: string; avatar?: string | null };
  navMain: NavItem[];
  navDocuments: NavItem[];
  navSecondary: NavItem[];
};

// (optional aliases if you like separate names)
export type SecondaryItem = NavItem;
export type DocItem = NavItem;
