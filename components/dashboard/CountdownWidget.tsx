"use client";

import { useStore } from "@/lib/store";
import { formatDate, todayIso, daysBetween } from "@/lib/format";
import { CalendarClock } from "lucide-react";

export function CountdownWidget() {
  const goal = useStore((s) => s.goal);
  const today = todayIso();
  const daysLeft = daysBetween(today, goal.deadline);
  const totalDays = 70;
  const elapsed = totalDays - daysLeft;
  const pct = Math.max(0, Math.min(100, (elapsed / totalDays) * 100));

  const tone =
    daysLeft < 14 ? "text-status-bad" : daysLeft < 28 ? "text-status-warn" : "text-teal-deep";

  return (
    <div className="card card-pad">
      <div className="flex items-center gap-2 text-xs text-ink-muted uppercase tracking-wide mb-4">
        <CalendarClock size={14} /> Deadline
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`num-display text-3xl ${tone}`}>{daysLeft}</span>
        <span className="text-sm text-ink-muted">days left</span>
      </div>
      <div className="text-xs text-ink-subtle mt-1">Target: {formatDate(goal.deadline)}</div>
      <div className="mt-4 h-1.5 rounded-full bg-surface-subtle overflow-hidden">
        <div
          className="h-full bg-teal-mid rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[10px] uppercase tracking-wide text-ink-subtle font-medium mt-2">
        Week {Math.max(1, Math.ceil(elapsed / 7))} of 10
      </div>
    </div>
  );
}
