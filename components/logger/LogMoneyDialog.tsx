"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog } from "../ui/Dialog";
import { Confetti } from "../ui/Confetti";
import { useStore, selectSourceTotals } from "@/lib/store";
import { formatGHS, todayIso } from "@/lib/format";
import { Check } from "lucide-react";

const QUICK_AMOUNTS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000];

export function LogMoneyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const sources = useStore((s) => s.sources);
  const lastUsedSourceId = useStore((s) => s.lastUsedSourceId);
  const addLog = useStore((s) => s.addLog);
  const allLogs = useStore((s) => s.logs);
  const sourceTargets = useMemo(
    () => Object.fromEntries(sources.map((s) => [s.id, s.targetAmount])),
    [sources],
  );
  const totalsBefore = useMemo(
    () => selectSourceTotals({ sources, logs: allLogs } as any),
    [sources, allLogs],
  );

  const [amount, setAmount] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("");
  const [date, setDate] = useState<string>(todayIso());
  const [notes, setNotes] = useState<string>("");
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    if (open) {
      setAmount("");
      setNotes("");
      setDate(todayIso());
      setSourceId(lastUsedSourceId ?? sources[0]?.id ?? "");
    }
  }, [open, lastUsedSourceId, sources]);

  const numericAmount = Number(amount.replace(/[^\d.]/g, ""));
  const canSubmit = numericAmount > 0 && sourceId;

  function submit() {
    if (!canSubmit) return;
    const before = totalsBefore.get(sourceId) ?? 0;
    const target = sourceTargets[sourceId] ?? Infinity;
    const after = before + numericAmount;
    addLog({ amount: numericAmount, sourceId, date, notes: notes || undefined });
    if (before < target && after >= target) {
      setConfettiKey((k) => k + 1);
    }
    onClose();
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} title="Log Money" maxWidth="max-w-lg">
        <div className="space-y-5">
          <div>
            <label className="label">Amount (GH₵)</label>
            <input
              type="text"
              inputMode="decimal"
              className="input text-2xl font-display font-semibold py-3"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
            {numericAmount > 0 && (
              <div className="mt-1.5 text-xs text-ink-muted num">
                = {formatGHS(numericAmount)}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="px-2.5 py-1 rounded-full bg-surface-subtle text-xs font-medium text-ink-muted hover:bg-teal-pale hover:text-teal-deep transition-colors num"
                >
                  +{q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Source</label>
            <div className="grid grid-cols-2 gap-2">
              {sources.map((s) => {
                const selected = sourceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSourceId(s.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                      selected
                        ? "border-teal-deep bg-teal-pale/60"
                        : "border-black/10 hover:border-black/20 bg-surface-card"
                    }`}
                  >
                    <span
                      className="size-7 rounded-lg grid place-items-center text-base"
                      style={{ background: s.color + "22" }}
                    >
                      {s.icon}
                    </span>
                    <span className="text-sm font-medium flex-1 truncate">{s.name}</span>
                    {selected && <Check size={14} className="text-teal-deep" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Note (optional)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. CAATIF milestone"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="btn-primary flex-1"
            >
              Save Entry
            </button>
          </div>
        </div>
      </Dialog>
      <Confetti trigger={confettiKey} />
    </>
  );
}
