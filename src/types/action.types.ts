// =============================================
// Session Detail Type Enum
// =============================================
export const SESSION_TYPES = [
  "reading",
  "vocab",
  "listening",
  "grammar",
  "example",
  "test",
] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  reading: "Reading",
  vocab: "Vocabulary",
  listening: "Listening",
  grammar: "Grammar",
  example: "Example",
  test: "Test",
};

// =============================================
// CEFR Level Enum
// =============================================
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

// =============================================
// Action Type Enum
// =============================================
export enum ActionType {
  Explain = "explain",
  Reading = "reading",
  Audio = "audio",
  Chat = "chat",
  Image = "image",
  Column = "column",
  Choice = "choice",
  Reorder = "reorder",
  MatchCard = "match_card",
  FillSentenceByTyping = "fill_sentence_by_typing",
  FillSentenceWithChoice = "fill_sentence_with_choice",
  WriteSentence = "write_sentence",
  WriteSentenceInChat = "write_sentence_in_chat",
}

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  [ActionType.Explain]: "Explain",
  [ActionType.Reading]: "Reading",
  [ActionType.Audio]: "Audio",
  [ActionType.Chat]: "Chat",
  [ActionType.Image]: "Image",
  [ActionType.Column]: "Column",
  [ActionType.Choice]: "Choice",
  [ActionType.Reorder]: "Reorder",
  [ActionType.MatchCard]: "Match Card",
  [ActionType.FillSentenceByTyping]: "Fill Sentence (Typing)",
  [ActionType.FillSentenceWithChoice]: "Fill Sentence (Choice)",
  [ActionType.WriteSentence]: "Write Sentence",
  [ActionType.WriteSentenceInChat]: "Write Sentence (Chat)",
};

export const ACTION_TYPE_VALUES = Object.values(ActionType);

// =============================================
// Word Type
// =============================================
export type Word = {
  text: string;
  translation: string[];
  isBlank: boolean;
  audioUrl?: string;
  bold?: boolean;
  italic?: boolean;
  italian?: boolean;
  underline?: boolean;
  highlight?: boolean;
};

// =============================================
// Action Common Fields
// =============================================
export type ActionCommon = {
  marginTop: number;
  marginBottom: number;
};

// =============================================
// Action Types (Union)
// =============================================
export type ExplainAction = ActionCommon & {
  type: "explain";
  text: Word[];
  alignment: "left" | "center" | "right";
  size: number;
  explanation?: string;
};

export type ReadingAction = ActionCommon & {
  type: "reading";
  text: Word[];
  audioUrl?: string;
  isHide: boolean;
  isReadable: boolean;
};

export type AudioAction = ActionCommon & {
  type: "audio";
  audio: string;
};

export type ChatAction = ActionCommon & {
  type: "chat";
  sender: { name: string; imageUrl: string };
  position: "left" | "right";
  text: Word[];
  audioUrl: string;
  isDisplay: boolean;
  isReadable: boolean;
};

export type ImageAction = ActionCommon & {
  type: "image";
  url: string;
  height: number;
};

export type ColumnRatio = "1:1" | "1:2" | "1:3";

export type ColumnAction = ActionCommon & {
  type: "column";
  ratio: ColumnRatio;
  actions: Array<ImageAction | ReadingAction | AudioAction>;
};

export type ChoiceAction = ActionCommon & {
  type: "choice";
  items: {
    text: Word;
    isCorrect: boolean;
  }[];
};

export type ReorderAction = ActionCommon & {
  type: "reorder";
  items: {
    text: Word;
    sequence: number;
  }[];
};

export type MatchCardAction = ActionCommon & {
  type: "match_card";
  items: {
    left: { text?: string; audioUrl?: string };
    right: { text?: string; audioUrl?: string };
  }[];
};

export type FillSentenceByTypingAction = ActionCommon & {
  type: "fill_sentence_by_typing";
  sentence: {
    text: string;
    isBlank: boolean;
    inSentence: boolean;
  }[];
};

export type FillSentenceWithChoiceAction = ActionCommon & {
  type: "fill_sentence_with_choice";
  sentence: {
    text: Word;
    isBlank: boolean;
    inSentence: boolean;
  }[];
};

export type WriteSentenceAction = ActionCommon & {
  type: "write_sentence";
  sentence: string[];
  expectSentence?: string[];
};

export type WriteSentenceInChatAction = ActionCommon & {
  type: "write_sentence_in_chat";
  sentence: string[];
  expectSentence?: string[];
  position: "left" | "right";
};

export type Action =
  | ExplainAction
  | ReadingAction
  | AudioAction
  | ChatAction
  | ImageAction
  | ColumnAction
  | ChoiceAction
  | ReorderAction
  | MatchCardAction
  | FillSentenceByTypingAction
  | FillSentenceWithChoiceAction
  | WriteSentenceAction
  | WriteSentenceInChatAction;

// =============================================
// Screen Type
// =============================================
export type Screen = {
  id: string;
  sequence: number;
  actions: (Action & { id: string; sequence: number })[];
};

// =============================================
// Default content for each action type
// =============================================
export function getDefaultContent(type: ActionType): Action {
  const margins = { marginTop: 10, marginBottom: 0 };
  switch (type) {
    case ActionType.Explain:
      return {
        ...margins,
        type: "explain",
        text: [],
        alignment: "left",
        size: 16,
      };
    case ActionType.Reading:
      return {
        ...margins,
        type: "reading",
        text: [],
        audioUrl: "",
        isHide: false,
        isReadable: true,
      };
    case ActionType.Audio:
      return { ...margins, type: "audio", audio: "" };
    case ActionType.Chat:
      return {
        ...margins,
        type: "chat",
        sender: { name: "", imageUrl: "" },
        position: "left",
        text: [],
        audioUrl: "",
        isDisplay: true,
        isReadable: true,
      };
    case ActionType.Image:
      return { ...margins, type: "image", url: "", height: 200 };
    case ActionType.Column:
      return { ...margins, type: "column", ratio: "1:1", actions: [] };
    case ActionType.Choice:
      return { ...margins, type: "choice", items: [] };
    case ActionType.Reorder:
      return { ...margins, type: "reorder", items: [] };
    case ActionType.MatchCard:
      return { ...margins, type: "match_card", items: [] };
    case ActionType.FillSentenceByTyping:
      return { ...margins, type: "fill_sentence_by_typing", sentence: [] };
    case ActionType.FillSentenceWithChoice:
      return { ...margins, type: "fill_sentence_with_choice", sentence: [] };
    case ActionType.WriteSentence:
      return { ...margins, type: "write_sentence", sentence: [] };
    case ActionType.WriteSentenceInChat:
      return {
        ...margins,
        type: "write_sentence_in_chat",
        sentence: [],
        position: "left",
      };
    default:
      return {
        ...margins,
        type: "explain",
        text: [],
        alignment: "left",
        size: 16,
      };
  }
}
