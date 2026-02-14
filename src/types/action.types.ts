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
  underline?: boolean;
  highlight?: boolean;
};

// =============================================
// Action Types (Union)
// =============================================
export type ExplainAction = {
  type: "explain";
  content: {
    text: Word[];
    alignment: "left" | "center" | "right";
    size: number;
  };
};

export type ReadingAction = {
  type: "reading";
  content: {
    text: Word[];
    audioUrl?: string;
    isHide: boolean;
    isReadable: boolean;
  };
};

export type AudioAction = {
  type: "audio";
  content: {
    audio: string;
  };
};

export type ChatAction = {
  type: "chat";
  content: {
    sender: { name: string; imageUrl: string };
    position: "left" | "right";
    text: Word[];
    audioUrl: string;
    isDisplay: boolean;
    isReadable: boolean;
  };
};

export type ImageAction = {
  type: "image";
  content: {
    url: string;
  };
};

export type ColumnAction = {
  type: "column";
  content: {
    actions: Array<ImageAction | ReadingAction | AudioAction>;
  };
};

export type ChoiceAction = {
  type: "choice";
  content: {
    items: {
      text: Word;
      isCorrect: boolean;
    }[];
  };
};

export type ReorderAction = {
  type: "reorder";
  content: {
    items: {
      text: Word;
      sequence: number;
    }[];
  };
};

export type MatchCardAction = {
  type: "match_card";
  content: {
    items: {
      left: { text?: string; audioUrl?: string };
      right: { text?: string; audioUrl?: string };
    }[];
  };
};

export type FillSentenceByTypingAction = {
  type: "fill_sentence_by_typing";
  content: {
    sentence: {
      text: string;
      isBlank: boolean;
    }[];
  };
};

export type FillSentenceWithChoiceAction = {
  type: "fill_sentence_with_choice";
  content: {
    sentence: {
      text: string;
      isBlank: boolean;
      choice?: Word[];
    }[];
  };
};

export type WriteSentenceAction = {
  type: "write_sentence";
  content: {
    sentence: string[];
  };
};

export type WriteSentenceInChatAction = {
  type: "write_sentence_in_chat";
  content: {
    sentence: string[];
    position: "left" | "right";
  };
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
export function getDefaultContent(type: ActionType): Record<string, unknown> {
  switch (type) {
    case ActionType.Explain:
      return { text: [], alignment: "left", size: 16 };
    case ActionType.Reading:
      return { text: [], audioUrl: "", isHide: false, isReadable: true };
    case ActionType.Audio:
      return { audio: "" };
    case ActionType.Chat:
      return {
        sender: { name: "", imageUrl: "" },
        position: "left",
        text: [],
        audioUrl: "",
        isDisplay: true,
        isReadable: true,
      };
    case ActionType.Image:
      return { url: "" };
    case ActionType.Column:
      return { actions: [] };
    case ActionType.Choice:
      return { items: [] };
    case ActionType.Reorder:
      return { items: [] };
    case ActionType.MatchCard:
      return { items: [] };
    case ActionType.FillSentenceByTyping:
      return { sentence: [] };
    case ActionType.FillSentenceWithChoice:
      return { sentence: [] };
    case ActionType.WriteSentence:
      return { sentence: [] };
    case ActionType.WriteSentenceInChat:
      return { sentence: [], position: "left" };
    default:
      return {};
  }
}
