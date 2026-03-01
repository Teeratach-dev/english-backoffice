import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookieToken = req.cookies.get("token")?.value;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

export async function getUserIdFromRequest(
  req: NextRequest,
): Promise<string | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload.id as string;
  } catch {
    return null;
  }
}
