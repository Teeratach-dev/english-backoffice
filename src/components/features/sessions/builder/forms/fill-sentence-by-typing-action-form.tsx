import { FillSentenceByTypingAction } from "@/types/action.types";
import { SentenceBuilder } from "./common/sentence-builder";
import { MarginFields } from "./margin-fields";

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
    <div className="space-y-4">
      <MarginFields
        marginTop={action.marginTop}
        marginBottom={action.marginBottom}
        onChange={(updates) => updateAction(updates)}
      />
      <SentenceBuilder
        sentence={action.sentence || []}
        onChange={(newSentence) => updateAction({ sentence: newSentence })}
      />
    </div>
  );
}
