// lib/supabase/updateSession.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Public routes (never require auth)
const PUBLIC_EXACT = ["/", "/login", "/signup", "/auth/callback", "/robots.txt", "/sitemap.xml"];
const PUBLIC_PREFIX = ["/auth", "/api", "/_next"];

// Admin-only groups
const ADMIN_PREFIX = ["/admin"];

const startsWithAny = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname.startsWith(p));

const isPublicPath = (pathname: string) =>
  PUBLIC_EXACT.includes(pathname) || startsWithAny(pathname, PUBLIC_PREFIX);

/** Append all Set-Cookie headers from one response to another */
function carrySupabaseCookies(from: NextResponse, to: NextResponse) {
  const header = from.headers.get("set-cookie");
  // If multiple cookies are present, Next will serialize them into a single header with commas.
  // Append instead of set to avoid clobbering any existing Set-Cookie on `to`.
  if (header) to.headers.append("set-cookie", header);
  return to;
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // ⚡ Skip any work for public paths (no Supabase client, zero network)
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Base response; Supabase will attach refreshed cookies to this
  let supaRes = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
        setAll: (cookiesToSet) => {
          // Re-create response and set cookies that Supabase wants to refresh
          supaRes = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supaRes.cookies.set(name, value, options ?? {});
          }
        },
      },
    }
  );

  // Read claims AND trigger session refresh if needed
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { roles?: unknown } | null | undefined;

  // Guests on non-public → redirect to /login?returnTo=<path>
  if (!claims) {
    const login = new URL("/login", request.url);
    // only allow internal paths for returnTo (avoid open redirects)
    const safeReturnTo = pathname.startsWith("/") ? pathname : "/";
    login.searchParams.set("returnTo", safeReturnTo);
    return carrySupabaseCookies(supaRes, NextResponse.redirect(login));
  }

  // Admin-only stealth for /admin/**
  if (startsWithAny(pathname, ADMIN_PREFIX)) {
    const roles = Array.isArray(claims.roles) ? (claims.roles as string[]) : [];
    if (!roles.includes("admin")) {
      // middleware can't call notFound(); rewrite to your own 404 route
      const r404 = NextResponse.rewrite(new URL("/404", request.url));
      return carrySupabaseCookies(supaRes, r404);
    }
  }

  // Auth OK → continue
  return supaRes;
}
