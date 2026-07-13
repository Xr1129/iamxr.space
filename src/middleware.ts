import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/editor", "/api/posts", "/api/upload", "/api/preview"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only check protected routes
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Login/logout endpoints are unprotected
  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  // Lightweight check: cookie must exist and have correct format
  // Full cryptographic verification happens in API routes / page data fetches
  const token = request.cookies.get("editor_token")?.value;
  if (!token || !token.includes(".")) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/editor/:path*",
    "/api/posts/:path*",
    "/api/upload/:path*",
    "/api/preview/:path*",
  ],
};
