// In Next.js 16 this server-side gate is named Proxy.
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_BAKERY_PATHS = ["/bakery/login", "/bakery/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasTokenCookie = Boolean(request.cookies.get("token")?.value);
  const isPublicAuthPage = PUBLIC_BAKERY_PATHS.includes(pathname);

  // This only checks that a cookie exists; the backend verifies the JWT on every request.
  if (isPublicAuthPage && hasTokenCookie) {
    return NextResponse.redirect(new URL("/bakery/dashboard", request.url));
  }

  if ((pathname === "/bakery" || pathname.startsWith("/bakery/")) &&
      !isPublicAuthPage && !hasTokenCookie) {
    return NextResponse.redirect(new URL("/bakery/login", request.url));
  }

  return NextResponse.next();
}

// Only run for the bakery area (skips everything else for speed)
export const config = {
  matcher: ["/bakery/:path*"],
};
