import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["admin", "superadmin"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // In a real app, you'd extract the user from the token/session here to verify admin status.
    // For this MVP, we are assuming the middleware handles authentication.
    // We should add role-based authorization here.

    // For MVP init, we might skipped check role in this file, but requirement said: "Create admin yet need check admin permission to access pages"
    // Wait, requirement 2 said: "Create admin ยังไม่ต้องเชคสิทธิ admin ในการเข้าถึงหน้าต่างๆ" -> "Create admin, no need to check admin permission to access pages yet"
    // BUT requirement 5 said: "Every API after login must check Bearer Token"
    // So we just need to be authenticated (which middleware does).

    const body = await req.json();
    const { email, password, name, role } = createUserSchema.parse(body);

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || "admin", // Default to admin for now as per "Create admin" requirement
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );
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

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
