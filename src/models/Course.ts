import mongoose from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const CourseZodSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be at least 0"),
  isActive: z.boolean().default(true),
  purchaseable: z.boolean().default(true),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type CourseInput = z.infer<typeof CourseZodSchema>;

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
