import mongoose from "mongoose";
import { z } from "zod";

export const UnitZodSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  name: z.string().min(1, "Unit name is required"),
  description: z.string().optional(),
  sequence: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type UnitInput = z.infer<typeof UnitZodSchema>;

const UnitSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name for this unit."],
    },
    description: {
      type: String,
    },
    sequence: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Unit || mongoose.model("Unit", UnitSchema);
