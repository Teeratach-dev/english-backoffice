import { NextRequest, NextResponse } from "next/server";
import { courseService } from "@/services/course.service";
import { CourseZodSchema } from "@/models/Course";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = searchParams.get("search") || "";

    const isActive = searchParams.has("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined;
    const purchaseable = searchParams.has("purchaseable")
      ? searchParams.get("purchaseable") === "true"
      : undefined;

    const result = await courseService.getAllCourses({
      page,
      limit,
      search,
      isActive,
      purchaseable,
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
    const validatedData = CourseZodSchema.parse(body);

    const course = await courseService.createCourse(validatedData, userId);
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("POST /api/courses error:", error);
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
