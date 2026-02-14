import { z } from "zod";
import { ACTION_TYPE_VALUES, SESSION_TYPES } from "@/types/action.types";

export const SessionTemplateZodSchema = z.object({
  name: z.string().min(1),
  type: z.enum(SESSION_TYPES),
  screens: z
    .array(
      z.object({
        sequence: z.number().optional(),
        actionTypes: z.array(
          z.enum(ACTION_TYPE_VALUES as [string, ...string[]]),
        ),
      }),
    )
    .default([]),
  isActive: z.boolean().default(true),
});

export type SessionTemplateInput = z.infer<typeof SessionTemplateZodSchema>;
