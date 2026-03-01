import { NextRequest, NextResponse } from "next/server";
import SessionTemplate, {
  SessionTemplateZodSchema,
} from "@/models/SessionTemplate";
import dbConnect from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { params } = context;
  try {
    const { id } = await params;
    await dbConnect();
    const template = await SessionTemplate.findById(id);
    if (!template) {
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(template);
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
    const validatedData = SessionTemplateZodSchema.partial().parse(body);

    await dbConnect();
    const template = await SessionTemplate.findByIdAndUpdate(
      id,
      { ...validatedData, updatedBy: userId },
      { new: true, runValidators: true },
    );

    if (!template) {
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(template);
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

    await dbConnect();
    const template = await SessionTemplate.findByIdAndDelete(id);
    if (!template) {
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
