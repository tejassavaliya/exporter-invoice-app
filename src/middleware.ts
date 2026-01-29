import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // specific handling if needed
    // e.g. admin routes check
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
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
