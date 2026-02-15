import { z } from "zod";
import { SESSION_TYPES, CEFR_LEVELS } from "@/types/action.types";
import { ActionZodSchema } from "@/schemas/action.schema";

export const SessionDetailZodSchema = z.object({
  sessionGroupId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(SESSION_TYPES),
  cefrLevel: z.enum(CEFR_LEVELS),
  screens: z
    .array(
      z.object({
        id: z.string().optional(),
        sequence: z.number(),
        templateId: z.string().optional(),
        actions: z.array(ActionZodSchema),
      }),
    )
    .default([]),
  sequence: z.number().optional(),
  isActive: z.boolean(),
});

export type SessionDetailInput = z.infer<typeof SessionDetailZodSchema>;
