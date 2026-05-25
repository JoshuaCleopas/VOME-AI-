"use client";

import { useStore } from "@/lib/store";
import { formatGHS, formatDate, todayIso } from "@/lib/format";
import { TrendingUp } from "lucide-react";

export function VelocityWidget() {
  const logs = useStore((s) => s.logs);
  const goal = useStore((s) => s.goal);

  const today = todayIso();
  const sevenAgo = new Date();
  sevenAgo.setDate(sevenAgo.getDate() - 6);
  const sevenIso = sevenAgo.toISOString().slice(0, 10);

  const totalRaised = logs.reduce((a, l) => a + l.amount, 0);
  const weekTotal = logs.filter((l) => l.date >= sevenIso).reduce((a, l) => a + l.amount, 0);

  const earliestDate = logs.length
    ? logs.reduce((min, l) => (l.date < min ? l.date : min), logs[0].date)
    : today;
  const daysSinceStart = Math.max(
    1,
    Math.ceil(
      (new Date(today).getTime() - new Date(earliestDate).getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );
  const dailyAvg = totalRaised / daysSinceStart;
  const remaining = Math.max(0, goal.targetAmount - totalRaised);

  let projection: string;
  if (totalRaised >= goal.targetAmount) {
    projection = "Goal hit 🎉";
  } else if (dailyAvg <= 0) {
    projection = "Log to project pace";
  } else {
    const daysLeft = Math.ceil(remaining / dailyAvg);
    const eta = new Date();
    eta.setDate(eta.getDate() + daysLeft);
    projection = formatDate(eta.toISOString());
  }

  return (
    <div className="card card-pad">
      <div className="flex items-center gap-2 text-xs text-ink-muted uppercase tracking-wide mb-4">
        <TrendingUp size={14} /> Velocity
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="This week" value={formatGHS(weekTotal)} />
        <Stat label="Daily avg" value={formatGHS(dailyAvg)} />
        <Stat label="ETA at pace" value={projection} small />
      </div>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-ink-subtle font-medium">{label}</div>
      <div className={`num-display mt-1 text-ink ${small ? "text-sm" : "text-lg"}`}>{value}</div>
    </div>
  );
}
