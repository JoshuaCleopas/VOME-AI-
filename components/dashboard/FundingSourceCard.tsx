"use client";

import { AnimatedNumber } from "../ui/AnimatedNumber";
import { formatGHS, formatPercent } from "@/lib/format";
import type { FundingSource } from "@/lib/types";
import { Check } from "lucide-react";

type Props = {
  source: FundingSource;
  current: number;
};

const STATUS_STYLE: Record<FundingSource["status"], { label: string; cls: string }> = {
  confirmed: { label: "Confirmed", cls: "bg-status-good/10 text-status-good" },
  pending: { label: "Pending", cls: "bg-status-warn/10 text-status-warn" },
  deployed: { label: "Deployed", cls: "bg-teal-deep/10 text-teal-deep" },
};

export function FundingSourceCard({ source, current }: Props) {
  const pct = Math.max(0, Math.min(100, (current / source.targetAmount) * 100));
  const complete = current >= source.targetAmount;
  const status = STATUS_STYLE[source.status];

  return (
    <div className="card card-pad relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="size-11 rounded-xl grid place-items-center text-xl shrink-0"
            style={{ background: source.color + "22" }}
          >
            {source.icon}
          </div>
          <div className="min-w-0">
            <div className="font-display font-semibold truncate">{source.name}</div>
            <div className="text-xs text-ink-muted num">Target {formatGHS(source.targetAmount)}</div>
          </div>
        </div>
        <span className={`pill ${status.cls}`}>
          {complete && <Check size={12} />}
          {complete ? "Funded" : status.label}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <div className="num-display text-xl text-ink">
            <AnimatedNumber value={current} format={(n) => formatGHS(n)} />
          </div>
          <div className="num-display text-sm text-ink-muted">
            <AnimatedNumber value={pct} format={(n) => formatPercent(n, 0)} />
          </div>
        </div>
        <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: source.color }}
          />
        </div>
      </div>
    </div>
  );
}
