import { z } from "zod";
import { ActionType } from "@/types/action.types";

export const WordSchema = z.object({
  text: z.string().default(""),
  translation: z.array(z.string()).default([]),
  isBlank: z.boolean().default(false),
  audioUrl: z.string().nullable().default(null),
  bold: z.boolean().default(false),
  italic: z.boolean().default(false),
  italian: z.boolean().default(false),
  underline: z.boolean().default(false),
  highlight: z.boolean().default(false),
});

const BaseActionSchema = z.object({
  id: z.string().optional(),
  sequence: z.number(),
});

export const ExplainActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Explain),
  text: z.array(WordSchema),
  alignment: z.enum(["left", "center", "right"]).default("left"),
  size: z.number().default(16),
});

export const ReadingActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Reading),
  text: z.array(WordSchema),
  audioUrl: z.string().optional(),
  isHide: z.boolean(),
  isReadable: z.boolean(),
});

export const AudioActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Audio),
  audio: z.string(),
});

export const ChatActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Chat),
  sender: z.object({
    name: z.string(),
    imageUrl: z.string(),
  }),
  position: z.enum(["left", "right"]),
  text: z.array(WordSchema),
  audioUrl: z.string().optional(), // In requirement it says string (required?), in type string. schema can be string.
  isDisplay: z.boolean(),
  isReadable: z.boolean(),
});

export const ImageActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Image),
  url: z.string(),
});

// Recursive schema for ColumnAction might be tricky in Zod.
// Use z.lazy if needed, or simplified version for now since it's an array of specific actions.
// ColumnAction actions: Array<ImageAction | ReadingAction | AudioAction>
export const ColumnActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Column),
  actions: z.array(
    z.union([ImageActionSchema, ReadingActionSchema, AudioActionSchema]),
  ),
});

export const ChoiceActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Choice),
  items: z.array(
    z.object({
      text: WordSchema,
      isCorrect: z.boolean(),
    }),
  ),
});

export const ReorderActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.Reorder),
  items: z.array(
    z.object({
      text: WordSchema,
      sequence: z.number(),
    }),
  ),
});

export const MatchCardActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.MatchCard),
  items: z.array(
    z.object({
      left: z.object({
        text: z.string().optional(),
        audioUrl: z.string().optional(),
      }),
      right: z.object({
        text: z.string().optional(),
        audioUrl: z.string().optional(),
      }),
    }),
  ),
});

export const FillSentenceByTypingActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.FillSentenceByTyping),
  sentence: z.array(
    z.object({
      text: z.string(),
      isBlank: z.boolean(),
    }),
  ),
});

export const FillSentenceWithChoiceActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.FillSentenceWithChoice),
  sentence: z.array(
    z.object({
      text: z.string(),
      isBlank: z.boolean(),
      choice: z.array(WordSchema).optional(),
    }),
  ),
});

export const WriteSentenceActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.WriteSentence),
  sentence: z.array(z.string()),
});

export const WriteSentenceInChatActionSchema = BaseActionSchema.extend({
  type: z.literal(ActionType.WriteSentenceInChat),
  sentence: z.array(z.string()),
  position: z.enum(["left", "right"]),
});

export const ActionZodSchema = z.discriminatedUnion("type", [
  ExplainActionSchema,
  ReadingActionSchema,
  AudioActionSchema,
  ChatActionSchema,
  ImageActionSchema,
  ColumnActionSchema,
  ChoiceActionSchema,
  ReorderActionSchema,
  MatchCardActionSchema,
  FillSentenceByTypingActionSchema,
  FillSentenceWithChoiceActionSchema,
  WriteSentenceActionSchema,
  WriteSentenceInChatActionSchema,
]);
