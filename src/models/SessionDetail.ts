import mongoose from "mongoose";
import { z } from "zod";

// Action Schema
const ActionSchema = new mongoose.Schema({
  type: {
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
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // flexible content based on type
  },
  sequence: {
    type: Number,
    required: true,
  },
});

// Screen Schema
const ScreenSchema = new mongoose.Schema({
  sequence: {
    type: Number,
    required: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SessionTemplate",
  },
  actions: [ActionSchema],
});

// Session Detail Schema
const SessionDetailSchema = new mongoose.Schema(
  {
    sessionGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SessionGroup",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name for this session."],
    },
    type: {
      type: String,
      enum: ["ActionSelection", "Reading", "Writing", "Listening", "Speaking"],
      default: "ActionSelection",
    },
    cefrLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      default: "A1",
    },
    screens: [ScreenSchema],
    sequence: {
      type: Number,
      default: 0,
    },
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

// Zod Schema for Validation
export const SessionDetailZodSchema = z.object({
  sessionGroupId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    "ActionSelection",
    "Reading",
    "Writing",
    "Listening",
    "Speaking",
  ]),
  cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  screens: z
    .array(
      z.object({
        sequence: z.number(),
        templateId: z.string().optional(),
        actions: z.array(
          z.object({
            type: z.string(),
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

export default mongoose.models.SessionDetail ||
  mongoose.model("SessionDetail", SessionDetailSchema);
