import mongoose from "mongoose";

// Re-export Zod schema for server-side use
export { CourseZodSchema, type CourseInput } from "@/schemas/course.schema";

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this course."],
    },
    description: {
      type: String, // Richtext content as string
    },
    price: {
      type: Number,
      required: [true, "Please provide a price."],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    purchaseable: {
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
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
