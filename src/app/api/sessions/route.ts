import { NextRequest, NextResponse } from "next/server";
import { sessionDetailService } from "@/services/session-detail.service";
import { SessionDetailZodSchema } from "@/models/SessionDetail";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionGroupId = searchParams.get("sessionGroupId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = searchParams.get("search") || "";

    if (sessionGroupId) {
      const sessions =
        await sessionDetailService.getSessionsByGroupId(sessionGroupId);
      return NextResponse.json(sessions);
    }

    const isActive = searchParams.has("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined;
    const type = searchParams.getAll("type"); // Supports ?type=A&type=B
    const cefrLevel = searchParams.getAll("cefrLevel");

    const result = await sessionDetailService.getAllSessions({
      page,
      limit,
      search,
      isActive,
      type: type.length > 0 ? type : undefined,
      cefrLevel: cefrLevel.length > 0 ? cefrLevel : undefined,
    });
    return NextResponse.json(result);
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
