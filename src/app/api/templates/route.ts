import { NextRequest, NextResponse } from "next/server";
import SessionTemplate, {
  SessionTemplateZodSchema,
} from "@/models/SessionTemplate";
import dbConnect from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const isActive = searchParams.has("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined;
    const types = searchParams.getAll("type");

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    if (types.length > 0) {
      query.type = { $in: types };
    }

    const templates = await SessionTemplate.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await SessionTemplate.countDocuments(query);

    return NextResponse.json({
      data: templates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
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
    const validatedData = SessionTemplateZodSchema.parse(body);

    await dbConnect();
    const template = await SessionTemplate.create({
      ...validatedData,
      createdBy: userId,
      updatedBy: userId,
    });

    return NextResponse.json(template, { status: 201 });
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
