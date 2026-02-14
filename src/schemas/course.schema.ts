import { z } from "zod";

export const CourseZodSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be at least 0"),
  isActive: z.boolean(),
  purchaseable: z.boolean(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type CourseInput = z.infer<typeof CourseZodSchema>;
