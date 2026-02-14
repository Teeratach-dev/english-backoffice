import mongoose from "mongoose";
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

const SessionGroupSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name for this session group."],
    },
    description: {
      type: String,
    },
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

export default mongoose.models.SessionGroup ||
  mongoose.model("SessionGroup", SessionGroupSchema);
