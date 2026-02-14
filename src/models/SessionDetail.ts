import mongoose from "mongoose";
import { ACTION_TYPE_VALUES } from "@/types/action.types";

// Re-export Zod schema for server-side use
export {
  SessionDetailZodSchema,
  type SessionDetailInput,
} from "@/schemas/session-detail.schema";

// Action Schema — strict: false เพื่อเก็บ dynamic content ของแต่ละ action type
const ActionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ACTION_TYPE_VALUES,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
  },
  { strict: false },
);

// Screen Schema
const ScreenSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
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
      enum: ["reading", "vocab", "listening", "grammar", "example", "test"],
      default: "reading",
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

export default mongoose.models.SessionDetail ||
  mongoose.model("SessionDetail", SessionDetailSchema, "session-details");
