import mongoose from "mongoose";
import { z } from "zod";
import { ACTION_TYPE_VALUES, SESSION_TYPES } from "@/types/action.types";

const TemplateScreenSchema = new mongoose.Schema({
  sequence: {
    type: Number,
    required: true,
  },
  actionTypes: [
    {
      type: String,
      enum: ACTION_TYPE_VALUES,
    },
  ],
});

const SessionTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this template."],
    },
    type: {
      type: String,
      enum: SESSION_TYPES,
      required: true,
    },
    screens: [TemplateScreenSchema],
    isActive: {
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
    timestamps: true,
  },
);

export const SessionTemplateZodSchema = z.object({
  name: z.string().min(1),
  type: z.enum(SESSION_TYPES),
  screens: z
    .array(
      z.object({
        sequence: z.number(),
        actionTypes: z.array(
          z.enum(ACTION_TYPE_VALUES as [string, ...string[]]),
        ),
      }),
    )
    .default([]),
  isActive: z.boolean().default(true),
});

export type SessionTemplateInput = z.infer<typeof SessionTemplateZodSchema>;

export default mongoose.models.SessionTemplate ||
  mongoose.model("SessionTemplate", SessionTemplateSchema);
