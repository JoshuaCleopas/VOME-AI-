"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import type { ActionCategory, ActionItem, ActionPhase, ActionPriority } from "@/lib/types";
import { Check } from "lucide-react";

const PHASES: ActionPhase[] = ["Week 1", "Weeks 2-4", "Weeks 4-8", "Post-Purchase"];
const STATUSES: ActionItem["status"][] = ["Not Started", "In Progress", "Done"];
const CATEGORIES: ActionCategory[] = ["Sales", "Loan", "Buy-side", "Tax", "Insurance", "Operations"];
const PRIORITIES: ActionPriority[] = ["High", "Medium", "Low"];

const CATEGORY_COLOR: Record<ActionCategory, string> = {
  Sales: "bg-amber-100 text-amber-700",
  Loan: "bg-blue-100 text-blue-700",
  "Buy-side": "bg-teal-pale text-teal-deep",
  Tax: "bg-purple-100 text-purple-700",
  Insurance: "bg-rose-100 text-rose-700",
  Operations: "bg-slate-200 text-slate-700",
};

const PRIORITY_STYLE: Record<ActionPriority, string> = {
  High: "text-status-bad",
  Medium: "text-status-warn",
  Low: "text-ink-subtle",
};

type GroupMode = "phase" | "status";

export function KanbanBoard() {
  const tasks = useStore((s) => s.tasks);
  const toggleTaskDone = useStore((s) => s.toggleTaskDone);
  const updateTask = useStore((s) => s.updateTask);

  const [groupMode, setGroupMode] = useState<GroupMode>("phase");
  const [catFilter, setCatFilter] = useState<Set<ActionCategory>>(new Set());
  const [priFilter, setPriFilter] = useState<Set<ActionPriority>>(new Set());

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (catFilter.size && !catFilter.has(t.category)) return false;
      if (priFilter.size && !priFilter.has(t.priority)) return false;
      return true;
    });
  }, [tasks, catFilter, priFilter]);

  const columns = groupMode === "phase" ? PHASES : STATUSES;
  const columnFor = (t: ActionItem) => (groupMode === "phase" ? t.phase : t.status);

  const grouped = useMemo(() => {
    const m = new Map<string, ActionItem[]>();
    columns.forEach((c) => m.set(c, []));
    filtered.forEach((t) => {
      const c = columnFor(t);
      if (!m.has(c)) m.set(c, []);
      m.get(c)!.push(t);
    });
    m.forEach((arr) => arr.sort((a, b) => a.order - b.order));
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, groupMode]);

  const done = tasks.filter((t) => t.status === "Done").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-ink-muted num">
          <span className="num-display text-ink text-base">{done}</span> of {tasks.length} done
        </div>
        <div className="flex items-center gap-1 bg-surface-subtle rounded-xl p-1">
          {(["phase", "status"] as GroupMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setGroupMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                groupMode === m ? "bg-surface-card text-ink shadow-soft" : "text-ink-muted"
              }`}
            >
              by {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterGroup
          label="Category"
          items={CATEGORIES}
          selected={catFilter}
          onToggle={(c) => {
            const n = new Set(catFilter);
            if (n.has(c)) n.delete(c);
            else n.add(c);
            setCatFilter(n);
          }}
          colorize={(c) => CATEGORY_COLOR[c as ActionCategory]}
        />
        <span className="w-px bg-black/10 mx-1.5" />
        <FilterGroup
          label="Priority"
          items={PRIORITIES}
          selected={priFilter}
          onToggle={(p) => {
            const n = new Set(priFilter);
            if (n.has(p)) n.delete(p);
            else n.add(p);
            setPriFilter(n);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = grouped.get(col) ?? [];
          return (
            <div key={col} className="bg-surface-subtle/60 rounded-2xl p-3 min-h-[100px]">
              <div className="flex items-center justify-between px-1.5 mb-3">
                <div className="font-display font-semibold text-sm">{col}</div>
                <div className="text-xs text-ink-muted num">{items.length}</div>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <TaskCard key={t.id} task={t} onToggle={() => toggleTaskDone(t.id)} onCycleStatus={() => {
                    const next: Record<ActionItem["status"], ActionItem["status"]> = {
                      "Not Started": "In Progress",
                      "In Progress": "Done",
                      Done: "Not Started",
                    };
                    updateTask(t.id, { status: next[t.status], completedAt: next[t.status] === "Done" ? new Date().toISOString() : undefined });
                  }} />
                ))}
                {!items.length && (
                  <div className="text-xs text-ink-subtle text-center py-6">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  items,
  selected,
  onToggle,
  colorize,
}: {
  label: string;
  items: readonly T[];
  selected: Set<T>;
  onToggle: (item: T) => void;
  colorize?: (item: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <span className="text-[10px] uppercase tracking-wider text-ink-subtle font-medium mr-1">
        {label}
      </span>
      {items.map((c) => {
        const active = selected.has(c);
        const tone = colorize ? colorize(c) : "bg-surface-subtle text-ink-muted";
        return (
          <button
            key={c}
            onClick={() => onToggle(c)}
            className={`pill border transition-all ${tone} ${
              active ? "ring-1 ring-teal-deep" : "opacity-60 hover:opacity-100"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

function TaskCard({
  task,
  onToggle,
  onCycleStatus,
}: {
  task: ActionItem;
  onToggle: () => void;
  onCycleStatus: () => void;
}) {
  const done = task.status === "Done";
  return (
    <div className={`bg-surface-card rounded-xl border border-black/[0.05] p-3 shadow-soft transition-opacity ${done ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-2.5">
        <button
          onClick={onToggle}
          className={`mt-0.5 size-5 rounded-md border grid place-items-center transition-colors flex-shrink-0 ${
            done ? "bg-status-good border-status-good text-white" : "border-black/20 hover:border-teal-deep"
          }`}
          aria-label="Toggle done"
        >
          {done && <Check size={12} strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`text-sm leading-snug ${done ? "line-through text-ink-subtle" : "text-ink"}`}>
            {task.task}
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className={`pill text-[10px] ${CATEGORY_COLOR[task.category]}`}>
              {task.category}
            </span>
            <span className={`text-[10px] font-medium ${PRIORITY_STYLE[task.priority]}`}>
              {task.priority}
            </span>
            <button
              onClick={onCycleStatus}
              className="ml-auto text-[10px] text-ink-subtle hover:text-teal-deep font-medium"
            >
              {task.status}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
