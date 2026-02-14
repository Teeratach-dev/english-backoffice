import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Public paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/login") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Check for token
  let tokenToVerify = token;

  // Requirement 3 & 5: APIs must check Bearer Token
  if (pathname.startsWith("/api") && !tokenToVerify) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      tokenToVerify = authHeader.substring(7);
    }
  }

  if (!tokenToVerify) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await verifyToken(tokenToVerify);
    return NextResponse.next();
  } catch (error) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
