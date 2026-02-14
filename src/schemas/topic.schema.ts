import { z } from "zod";

export const TopicZodSchema = z.object({
  unitId: z.string().min(1, "Unit ID is required"),
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  sequence: z.number().int().min(0),
  isActive: z.boolean(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type TopicInput = z.infer<typeof TopicZodSchema>;
