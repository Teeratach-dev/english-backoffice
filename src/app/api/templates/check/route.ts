import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SessionTemplate from "@/models/SessionTemplate";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const screensQuery = searchParams.get("screens");

    if (!type || !screensQuery) {
      return NextResponse.json(
        { message: "Missing query parameters" },
        { status: 400 },
      );
    }

    const actionTypesInScreens = JSON.parse(screensQuery);

    await dbConnect();

    // Find templates of the same type
    const templates = await SessionTemplate.find({ type });

    // Check if any template has the same action types sequence across screens
    const exists = templates.some((template) => {
      if (template.screens.length !== actionTypesInScreens.length) return false;

      return template.screens.every((screen: any, idx: number) => {
        const reqActionTypes = actionTypesInScreens[idx];
        if (screen.actionTypes.length !== reqActionTypes.length) return false;

        return screen.actionTypes.every(
          (actionType: string, aIdx: number) =>
            actionType === reqActionTypes[aIdx],
        );
      });
    });

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking template existence:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
