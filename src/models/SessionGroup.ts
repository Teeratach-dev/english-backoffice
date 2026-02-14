import mongoose from "mongoose";

// Re-export Zod schema for server-side use
export {
  SessionGroupZodSchema,
  type SessionGroupInput,
} from "@/schemas/session-group.schema";

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
  mongoose.model("SessionGroup", SessionGroupSchema, "session-groups");
