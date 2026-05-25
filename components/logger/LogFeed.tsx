"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatDate, formatGHS } from "@/lib/format";
import { Pencil, Trash2 } from "lucide-react";

export function LogFeed({ limit }: { limit?: number }) {
  const logs = useStore((s) => s.logs);
  const sources = useStore((s) => s.sources);
  const deleteLog = useStore((s) => s.deleteLog);
  const updateLog = useStore((s) => s.updateLog);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const sourceMap = Object.fromEntries(sources.map((s) => [s.id, s]));
  const items = limit ? logs.slice(0, limit) : logs;

  if (!items.length) {
    return (
      <div className="text-center py-12 text-ink-muted text-sm">
        <div className="text-4xl mb-3">💪</div>
        Log your first cedi to start tracking
      </div>
    );
  }

  return (
    <ul className="divide-y divide-black/[0.05]">
      {items.map((log) => {
        const src = sourceMap[log.sourceId];
        const isEditing = editingId === log.id;
        return (
          <li key={log.id} className="py-3 flex items-center gap-3">
            <span
              className="size-10 rounded-xl grid place-items-center text-lg flex-shrink-0"
              style={{ background: (src?.color ?? "#999") + "22" }}
            >
              {src?.icon ?? "•"}
            </span>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="input py-1.5 text-sm w-28"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input py-1.5 text-sm flex-1"
                    placeholder="Note"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-display font-semibold num">
                      {formatGHS(log.amount)}
                    </span>
                    <span className="text-xs text-ink-muted">{src?.name ?? "Unknown"}</span>
                  </div>
                  <div className="text-xs text-ink-subtle flex gap-2 items-center">
                    <span>{formatDate(log.date)}</span>
                    {log.notes && (
                      <>
                        <span>·</span>
                        <span className="truncate">{log.notes}</span>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      const n = Number(editAmount);
                      if (n > 0) {
                        updateLog(log.id, { amount: n, notes: editNotes || undefined });
                      }
                      setEditingId(null);
                    }}
                    className="text-xs px-2 py-1 rounded-lg bg-teal-deep text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs px-2 py-1 rounded-lg text-ink-muted"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(log.id);
                      setEditAmount(String(log.amount));
                      setEditNotes(log.notes ?? "");
                    }}
                    className="size-8 grid place-items-center rounded-lg hover:bg-surface-subtle text-ink-muted"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this entry?")) deleteLog(log.id);
                    }}
                    className="size-8 grid place-items-center rounded-lg hover:bg-surface-subtle text-ink-muted hover:text-status-bad"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
