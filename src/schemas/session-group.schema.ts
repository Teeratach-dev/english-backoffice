import { z } from "zod";

export const SessionGroupZodSchema = z.object({
  topicId: z.string().min(1, "Topic ID is required"),
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  sequence: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type SessionGroupInput = z.infer<typeof SessionGroupZodSchema>;
