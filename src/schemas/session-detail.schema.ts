import { z } from "zod";
import {
  SESSION_TYPES,
  CEFR_LEVELS,
  ACTION_TYPE_VALUES,
} from "@/types/action.types";

export const SessionDetailZodSchema = z.object({
  sessionGroupId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(SESSION_TYPES),
  cefrLevel: z.enum(CEFR_LEVELS),
  screens: z
    .array(
      z.object({
        sequence: z.number(),
        templateId: z.string().optional(),
        actions: z.array(
          z.object({
            type: z.enum(ACTION_TYPE_VALUES as [string, ...string[]]),
            content: z.any(),
            sequence: z.number(),
          }),
        ),
      }),
    )
    .default([]),
  isActive: z.boolean().default(true),
});

export type SessionDetailInput = z.infer<typeof SessionDetailZodSchema>;
