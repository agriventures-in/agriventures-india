import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Admin routes require ADMIN role
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Investor routes require INVESTOR role
    if (pathname.startsWith("/investor") && token?.role !== "INVESTOR") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Startup submission requires FOUNDER or ADMIN
    if (
      pathname === "/startups/submit" &&
      token?.role !== "FOUNDER" &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes - always allowed
        const publicRoutes = [
          "/",
          "/discover",
          "/knowledge",
          "/jobs",
          "/login",
          "/register",
        ]

        // Check exact public routes
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // Public route patterns
        if (pathname.startsWith("/api/auth")) return true
        if (pathname.startsWith("/startups") && pathname !== "/startups/submit") return true
        if (pathname.startsWith("/knowledge/")) return true
        if (pathname.startsWith("/jobs/")) return true

        // All other routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
