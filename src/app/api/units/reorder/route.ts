import { NextRequest, NextResponse } from "next/server";
import { unitService } from "@/services/unit.service";
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

    const { courseId, unitIds } = await req.json();

    if (!courseId || !unitIds || !Array.isArray(unitIds)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await unitService.reorderUnits(courseId, unitIds, userId);
    return NextResponse.json({ message: "Units reordered successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
