import { NextRequest, NextResponse } from "next/server";
import { courseService } from "@/services/course.service";
import { CourseZodSchema } from "@/models/Course";
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
    const courses = await courseService.getAllCourses();
    return NextResponse.json(courses);
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
