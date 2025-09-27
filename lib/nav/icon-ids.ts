// lib/nav/icon-ids.ts
export const ICON_IDS = [
  "dashboard","forms","analytics","projects","users",
  "settings","help","search","database","report","word",
] as const;
export type IconId = typeof ICON_IDS[number];

export function isIconId(x: unknown): x is IconId {
  return typeof x === "string" && (ICON_IDS as readonly string[]).includes(x);
}
