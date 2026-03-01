import { NextRequest, NextResponse } from "next/server";
import { unitService } from "@/services/unit.service";
import { getUserIdFromRequest } from "@/lib/auth-utils";

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
