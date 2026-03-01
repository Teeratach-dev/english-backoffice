import { NextRequest, NextResponse } from "next/server";
import { sessionDetailService } from "@/services/session-detail.service";
import { SessionDetailZodSchema } from "@/models/SessionDetail";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { params } = context;
  try {
    const { id } = await params;
    const include = req.nextUrl.searchParams.get("include");

    let session;
    if (include === "breadcrumbs") {
      session = await sessionDetailService.getSessionWithBreadcrumbs(id);
    } else {
      session = await sessionDetailService.getSessionById(id);
    }

    if (!session) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { params } = context;
  try {
    const { id } = await params;
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = SessionDetailZodSchema.partial().parse(body);

    const session = await sessionDetailService.updateSession(
      id,
      validatedData,
      userId,
    );
    if (!session) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(session);
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { params } = context;
  try {
    const { id } = await params;
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = await sessionDetailService.deleteSession(id);
    if (!session) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
