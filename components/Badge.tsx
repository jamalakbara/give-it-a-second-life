import type { Condition } from "@/lib/types";
import { CONDITION_LABELS } from "@/lib/types";

export function ConditionBadge({ condition }: { condition: Condition }) {
  return (
    <span className="glass tracked inline-block rounded-full px-3 py-1 text-[10px] text-fg-muted">
      {CONDITION_LABELS[condition]}
    </span>
  );
}

export function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="tracked inline-block text-[10px] text-fg-faint">
      {label}
    </span>
  );
}
