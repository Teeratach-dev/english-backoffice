import { NextRequest, NextResponse } from "next/server";
import { topicService } from "@/services/topic.service";
import { TopicZodSchema } from "@/models/Topic";
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = TopicZodSchema.partial().parse(body);

    const topic = await topicService.updateTopic(id, validatedData, userId);
    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }
    return NextResponse.json(topic);
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const topic = await topicService.deleteTopic(id);
    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
