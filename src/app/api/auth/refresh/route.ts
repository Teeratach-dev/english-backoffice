import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createAccessToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const payload = await verifyToken(refreshToken);

    const newAccessToken = await createAccessToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    const response = NextResponse.json({ message: "Token refreshed" });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
  }
}
