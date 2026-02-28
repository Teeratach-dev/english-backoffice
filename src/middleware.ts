import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, createAccessToken } from "@/lib/jwt";

const PUBLIC_PATHS = [
  "/_next",
  "/api/auth/login",
  "/api/auth/refresh",
  "/login",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // --- Try access token first ---
  if (accessToken) {
    try {
      await verifyToken(accessToken);
      return NextResponse.next();
    } catch {
      // Access token expired or invalid — fall through to refresh
    }
  }

  // --- Try refresh token ---
  if (refreshToken) {
    try {
      const payload = await verifyToken(refreshToken);

      const newAccessToken = await createAccessToken({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });

      const response = pathname.startsWith("/api")
        ? NextResponse.next()
        : NextResponse.next();

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return response;
    } catch {
      // Refresh token also invalid — fall through to unauthorized
    }
  }

  // --- No valid token ---
  if (pathname.startsWith("/api")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
