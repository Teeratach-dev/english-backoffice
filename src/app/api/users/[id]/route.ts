import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { verifyToken } from "@/lib/jwt";
import { getTokenFromRequest } from "@/lib/auth-utils";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["admin", "superadmin"]).optional(),
});

async function getUserFromRequest(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    await dbConnect();
    return User.findById(payload.id).select("-password");
  } catch {
    return null;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUser = await getUserFromRequest(req);

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "superadmin") {
      return NextResponse.json(
        { message: "Only superadmin can edit users" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);

    await dbConnect();

    // Check if email is taken by another user
    if (validatedData.email) {
      const existingUser = await User.findOne({
        email: validatedData.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 409 },
        );
      }
    }

    // Hash password if provided
    const updateData: any = { ...validatedData };
    if (validatedData.password) {
      updateData.password = await hashPassword(validatedData.password);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
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
    const currentUser = await getUserFromRequest(req);

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "superadmin") {
      return NextResponse.json(
        { message: "Only superadmin can delete users" },
        { status: 403 },
      );
    }

    // Prevent self-deletion
    if (currentUser._id.toString() === id) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
