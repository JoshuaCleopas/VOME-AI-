"use client";

import { AnimatedNumber } from "../ui/AnimatedNumber";
import { formatGHS, formatUSD } from "@/lib/format";

type Props = {
  current: number;
  target: number;
};

export function ProgressRing({ current, target }: Props) {
  const pct = Math.max(0, Math.min(100, (current / target) * 100));
  const size = 260;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#104241" />
            <stop offset="100%" stopColor="#3a6e6d" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(16,66,65,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div className="text-[10px] tracking-widest uppercase text-ink-subtle font-medium">
          Raised
        </div>
        <div className="num-display text-[28px] md:text-[32px] text-teal-deep mt-1">
          <AnimatedNumber value={current} format={(n) => formatGHS(n)} />
        </div>
        <div className="text-xs text-ink-muted num mt-0.5">
          of {formatGHS(target)}
        </div>
        <div className="mt-3 num-display text-2xl text-teal-mid">
          <AnimatedNumber value={pct} format={(n) => `${n.toFixed(1)}%`} />
        </div>
        <div className="text-[11px] text-ink-subtle num mt-0.5">
          <AnimatedNumber value={current} format={(n) => formatUSD(n)} /> raised
        </div>
      </div>
    </div>
  );
}
