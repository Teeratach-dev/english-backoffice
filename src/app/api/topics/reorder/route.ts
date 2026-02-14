import { NextRequest, NextResponse } from "next/server";
import { topicService } from "@/services/topic.service";
import { verifyToken } from "@/lib/jwt";

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

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { unitId, topicIds } = await req.json();

    if (!unitId || !topicIds || !Array.isArray(topicIds)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await topicService.reorderTopics(unitId, topicIds, userId);
    return NextResponse.json({ message: "Topics reordered successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
