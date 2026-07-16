import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protected admin routes
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    // Check for admin token in cookie or header
    const token = req.cookies.get("adminToken")?.value;
    const headerToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token && !headerToken) {
      // Redirect to login if no token
      const url = req.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
