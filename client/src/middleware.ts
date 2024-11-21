import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const roleBasedAccess = [
  {
    path: "/dashboard/admin",
    allowedRoles: ["admin"],
  },
  {
    path: "/dashboard/teacher",
    allowedRoles: ["teacher"],
  },
  {
    path: "/dashboard",
    allowedRoles: ["admin", "teacher"],
  },
];

const privatePaths = ["/dashboard"];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("role")?.value;

  // Kiểm tra các đường dẫn riêng tư
  if (privatePaths.some((path) => pathname.startsWith(path))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Kiểm tra phân quyền dựa trên vai trò
    for (const route of roleBasedAccess) {
      if (pathname.startsWith(route.path)) {
        if (!route.allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL("/404", request.url));
        }
      }
    }
  }

  // Kiểm tra các đường dẫn dành cho auth
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
