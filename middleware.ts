import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is not authenticated and trying to access admin routes
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If user is authenticated and trying to access login page
    if (req.nextauth.token && req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (!req.nextUrl.pathname.startsWith("/admin")) {
          return true;
        }
        
        // Require authentication for admin routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
  ],
};