import mongoose from "mongoose";
import { z } from "zod";

const TemplateScreenSchema = new mongoose.Schema({
  sequence: {
    type: Number,
    required: true,
  },
  actionTypes: [
    {
      type: String,
      enum: [
        "Reading",
        "Writing",
        "Listening",
        "Speaking",
        "Gamification",
        "Grammar",
        "Vocabulary",
        "ActionSelection",
      ],
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
      enum: ["ActionSelection", "Reading", "Writing", "Listening", "Speaking"],
      required: true,
    },
    screens: [TemplateScreenSchema],
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
  type: z.enum([
    "ActionSelection",
    "Reading",
    "Writing",
    "Listening",
    "Speaking",
  ]),
  screens: z
    .array(
      z.object({
        sequence: z.number(),
        actionTypes: z.array(z.string()),
      }),
    )
    .default([]),
});

export type SessionTemplateInput = z.infer<typeof SessionTemplateZodSchema>;

export default mongoose.models.SessionTemplate ||
  mongoose.model("SessionTemplate", SessionTemplateSchema);
