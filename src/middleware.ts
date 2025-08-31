import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/settings", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session cookie
  const sessionCookie = request.cookies.get("session")?.value;

  // If the user is logged in (has a session)
  if (sessionCookie) {
    // And they try to access a public-only route like /auth, redirect them to the app
    if (pathname === "/auth") {
      console.log(
        "[Middleware] User is logged in, redirecting from /auth to /app"
      );
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  // If the user is NOT logged in (no session)
  if (!sessionCookie) {
    // And they try to access a protected route, redirect them to /auth
    if (protectedRoutes.some((prefix) => pathname.startsWith(prefix))) {
      console.log(
        `[Middleware] User is not logged in, redirecting from protected route ${pathname} to /auth`
      );
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
