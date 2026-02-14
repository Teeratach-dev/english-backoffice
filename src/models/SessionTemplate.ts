import mongoose from "mongoose";
import { ACTION_TYPE_VALUES, SESSION_TYPES } from "@/types/action.types";

// Re-export Zod schema for server-side use
export {
  SessionTemplateZodSchema,
  type SessionTemplateInput,
} from "@/schemas/session-template.schema";

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

export default mongoose.models.SessionTemplate ||
  mongoose.model("SessionTemplate", SessionTemplateSchema, "session-templates");
