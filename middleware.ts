// middleware.ts
import { updateSession } from "@/lib/supabase/updateSession";
import type { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest): Promise<NextResponse> {
  return updateSession(request);
}

/**
 * Adjust matcher to only protect the routes you want. This example excludes
 * static and _next assets and common image types.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
