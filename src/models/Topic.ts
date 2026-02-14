import mongoose from "mongoose";

// Re-export Zod schema for server-side use
export { TopicZodSchema, type TopicInput } from "@/schemas/topic.schema";

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
