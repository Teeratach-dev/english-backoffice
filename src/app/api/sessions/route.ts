import { NextRequest, NextResponse } from "next/server";
import { sessionDetailService } from "@/services/session-detail.service";
import { SessionDetailZodSchema } from "@/models/SessionDetail";
import { verifyToken } from "@/lib/jwt";
import { z } from "zod";

async function getUserIdFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload.id as string;
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionGroupId = searchParams.get("sessionGroupId");

    const sessions = sessionGroupId
      ? await sessionDetailService.getSessionsByGroupId(sessionGroupId)
      : await sessionDetailService.getAllSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = SessionDetailZodSchema.parse(body);

    const session = await sessionDetailService.createSession(
      validatedData,
      userId,
    );
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
