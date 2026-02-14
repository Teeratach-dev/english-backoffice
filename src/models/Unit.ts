import mongoose from "mongoose";

// Re-export Zod schema for server-side use
export { UnitZodSchema, type UnitInput } from "@/schemas/unit.schema";

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
