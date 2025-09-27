// lib/auth-guards.ts
// Server-only utilities to gate routes. Do not import in Client Components.
import { notFound, redirect } from "next/navigation";
import {
  getUserCached as getServerUser,
  getClaimsCached as getServerClaims,
} from "@/lib/supabase/auth.server.cached";

const ROUTES = {
  app: "/app",
  login: "/login",
  unauthorized: "/unauthorized",
} as const;

export type Claims = {
  roles?: string[];
  permissions?: string[];
  [k: string]: unknown;
};

// Only allow internal paths for returnTo (avoid open redirects)
function safeReturnTo(path?: string) {
  if (!path) return undefined;
  return path.startsWith("/") && !path.startsWith("//") ? path : undefined;
}

/** Build /login?returnTo=/where/user/was so you can bounce back after auth */
function withReturnTo(to: string, returnTo?: string) {
  const safe = safeReturnTo(returnTo);
  if (!safe) return to;
  const u = new URL(to, "http://x"); // base ignored by Next redirect
  u.searchParams.set("returnTo", safe);
  return `${u.pathname}?${u.searchParams.toString()}`;
}

/** For /login or /signup: if logged in, push them away */
export async function redirectIfAuthenticated(to: string = ROUTES.app) {
  const user = await getServerUser();
  if (user) redirect(to);
}

/** Require a logged-in user: choose redirect or 404 on failure */
export async function requireUser(opts?: {
  onFail?: "redirect" | "404";
  to?: string;               // redirect target (default /login)
  returnTo?: string;         // optional path to send back to after login
}) {
  const user = await getServerUser();
  if (!user) {
    const onFail = opts?.onFail ?? "redirect";
    if (onFail === "404") notFound();
    redirect(withReturnTo(opts?.to ?? ROUTES.login, opts?.returnTo));
  }
  return user!;
}

/** Get claims (null-safe), or fail (redirect/404) */
export async function requireClaims(opts?: { onFail?: "redirect" | "404"; to?: string }) {
  const claims = (await getServerClaims()) as Claims | null;
  if (!claims) {
    (opts?.onFail ?? "redirect") === "404" ? notFound() : redirect(opts?.to ?? ROUTES.login);
  }
  return claims!;
}

/**
 * Require roles (ANY match). Distinguish:
 * - no claims (guest): treat as not logged in
 * - has claims but lacks role: treat as unauthorized
 * Each branch can be 404 or redirect independently.
 */
export async function requireRolesOrFail(
  allowed: string[],
  opts?: {
    guest?: { onFail?: "redirect" | "404"; to?: string; returnTo?: string }; // default redirect -> /login
    unauthorized?: { onFail?: "redirect" | "404"; to?: string };             // default 404
  }
) {
  const claims = (await getServerClaims()) as Claims | null;
  if (!claims) {
    const onFail = opts?.guest?.onFail ?? "redirect";
    if (onFail === "404") notFound();
    redirect(withReturnTo(opts?.guest?.to ?? ROUTES.login, opts?.guest?.returnTo));
  }

  const roles = (claims!.roles ?? []) as string[];
  const ok = roles.some((r) => allowed.includes(r));
  if (!ok) {
    const onFail = opts?.unauthorized?.onFail ?? "404";
    if (onFail === "404") notFound();
    redirect(opts?.unauthorized?.to ?? ROUTES.unauthorized);
  }
  return claims!;
}

/** Require ALL permissions */
export async function requirePermissionsOrFail(
  required: string[],
  opts?: {
    guest?: { onFail?: "redirect" | "404"; to?: string; returnTo?: string };
    unauthorized?: { onFail?: "redirect" | "404"; to?: string };
  }
) {
  const claims = (await getServerClaims()) as Claims | null;
  if (!claims) {
    const onFail = opts?.guest?.onFail ?? "redirect";
    if (onFail === "404") notFound();
    redirect(withReturnTo(opts?.guest?.to ?? ROUTES.login, opts?.guest?.returnTo));
  }

  const permSet = new Set<string>((claims!.permissions ?? []) as string[]);
  const ok = required.every((p) => permSet.has(p));
  if (!ok) {
    const onFail = opts?.unauthorized?.onFail ?? "404";
    if (onFail === "404") notFound();
    redirect(opts?.unauthorized?.to ?? ROUTES.unauthorized);
  }
  return claims!;
}

/** Convenience aliases */
export async function requireUserOr404() {
  return requireUser({ onFail: "404" });
}
export async function requireAdminOr404() {
  return requireRolesOrFail(["admin"], { unauthorized: { onFail: "404" } });
}

/**
 * Wrapper to keep pages/layouts tidy.
 * Examples:
 *   export default withAuthGuard(Page, { require: "user", onFail: "404" })
 *   export default withAuthGuard(Page, { require: "roles", roles: ["admin"] })
 *   export default withAuthGuard(Page, { require: "perms", perms: ["users.read"] })
 */
export function withAuthGuard<T extends (...args: any[]) => any>(
  handler: T,
  opts:
    | { require: "user"; onFail?: "redirect" | "404"; to?: string; returnTo?: string }
    | {
        require: "roles";
        roles: string[];
        guest?: { onFail?: "redirect" | "404"; to?: string; returnTo?: string };
        unauthorized?: { onFail?: "redirect" | "404"; to?: string };
      }
    | {
        require: "perms";
        perms: string[];
        guest?: { onFail?: "redirect" | "404"; to?: string; returnTo?: string };
        unauthorized?: { onFail?: "redirect" | "404"; to?: string };
      }
) {
  return (async (...args: Parameters<T>) => {
    if (opts.require === "user") {
      await requireUser({ onFail: opts.onFail, to: opts.to, returnTo: opts.returnTo });
    } else if (opts.require === "roles") {
      await requireRolesOrFail(opts.roles, { guest: opts.guest, unauthorized: opts.unauthorized });
    } else {
      await requirePermissionsOrFail(opts.perms, { guest: opts.guest, unauthorized: opts.unauthorized });
    }
    return handler(...args);
  }) as T;
}
