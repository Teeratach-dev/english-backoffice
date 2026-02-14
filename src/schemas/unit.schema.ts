import { z } from "zod";

export const UnitZodSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  name: z.string().min(1, "Unit name is required"),
  description: z.string().optional(),
  sequence: z.number().int().min(0).optional(),
  isActive: z.boolean(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type UnitInput = z.infer<typeof UnitZodSchema>;
