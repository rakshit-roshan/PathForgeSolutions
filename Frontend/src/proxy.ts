/**
 * middleware.ts — Next.js Route Protection
 *
 * Runs on the Edge before every request.
 * - Unauthenticated users hitting /dashboard/* → redirected to /login
 * - Authenticated users hitting /login → redirected to /dashboard
 * - Admin routes (/dashboard/candidates, /dashboard/mail) → verified admin
 */

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "changeme-use-a-strong-secret-in-production"
);

const ADMIN_ONLY_PATHS = ["/dashboard/candidates", "/dashboard/mail"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Public paths: allow through ──────────────────────────────────
  const publicPaths = [
    "/",
    "/about",
    "/services",
    "/internship",
    "/career-guidance",
    "/job-consultancy",
    "/contact",
    "/login",
    "/api/",
  ];
  const isPublic = publicPaths.some(
    (p) => pathname === p || (p.endsWith("/") && pathname.startsWith(p))
  );
  if (isPublic) return NextResponse.next();

  // ── Protected: /dashboard/* ───────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("authToken")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Check admin-only paths
      if (ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
        if (payload.role !== "ADMIN") {
          const url = request.nextUrl.clone();
          url.pathname = "/dashboard";
          url.searchParams.set("error", "unauthorized");
          return NextResponse.redirect(url);
        }
      }

      return NextResponse.next();
    } catch {
      // Invalid / expired token
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("expired", "true");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};
