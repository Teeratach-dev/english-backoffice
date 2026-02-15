import { FillSentenceByTypingAction } from "@/types/action.types";
import { SentenceBuilder } from "./common/sentence-builder";

interface FillSentenceByTypingActionFormProps {
  action: FillSentenceByTypingAction;
  onChange: (updates: Partial<FillSentenceByTypingAction>) => void;
}

export function FillSentenceByTypingActionForm({
  action,
  onChange,
}: FillSentenceByTypingActionFormProps) {
  const updateAction = (updates: Partial<FillSentenceByTypingAction>) => {
    onChange(updates);
  };

  return (
    <SentenceBuilder
      sentence={action.sentence || []}
      onChange={(newSentence) => updateAction({ sentence: newSentence })}
    />
  );
}
