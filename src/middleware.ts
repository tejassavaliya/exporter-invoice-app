import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // specific handling if needed
    // e.g. admin routes check
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Explicitly redirect root to login if no token (redundant with authorized callback but safe)
    if (req.nextUrl.pathname === "/" && !req.nextauth.token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
        authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)",
  ],
};
