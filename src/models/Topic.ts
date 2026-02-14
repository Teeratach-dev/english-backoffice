import mongoose from "mongoose";
import { z } from "zod";

export const TopicZodSchema = z.object({
  unitId: z.string().min(1, "Unit ID is required"),
  name: z.string().min(1, "Topic name is required"),
  description: z.string().optional(),
  sequence: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type TopicInput = z.infer<typeof TopicZodSchema>;

const TopicSchema = new mongoose.Schema(
  {
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name for this topic."],
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

export default mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
