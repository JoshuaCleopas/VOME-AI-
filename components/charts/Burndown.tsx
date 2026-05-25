"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { formatGHS, formatGHSCompact } from "@/lib/format";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export function Burndown() {
  const logs = useStore((s) => s.logs);
  const goal = useStore((s) => s.goal);

  const data = useMemo(() => {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const startDate = logs.length
      ? new Date(logs.reduce((min, l) => (l.date < min ? l.date : min), logs[0].date))
      : new Date(goal.createdAt);
    const totalDays = Math.max(1, Math.ceil((deadline.getTime() - startDate.getTime()) / 86400000));

    const byDay = new Map<string, number>();
    for (const l of logs) byDay.set(l.date, (byDay.get(l.date) ?? 0) + l.amount);

    const out: { date: string; Remaining: number; Ideal: number }[] = [];
    let raised = 0;
    const cursor = new Date(startDate);
    let i = 0;
    while (cursor <= deadline) {
      const iso = cursor.toISOString().slice(0, 10);
      if (cursor <= today) raised += byDay.get(iso) ?? 0;
      const ideal = Math.max(0, goal.targetAmount - (goal.targetAmount / totalDays) * i);
      out.push({
        date: iso.slice(5),
        Remaining: cursor <= today ? Math.max(0, goal.targetAmount - raised) : NaN,
        Ideal: Math.round(ideal),
      });
      cursor.setDate(cursor.getDate() + 1);
      i++;
    }
    return out;
  }, [logs, goal]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,66,65,0.08)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5a6b6b" }} stroke="rgba(16,66,65,0.15)" />
          <YAxis
            tick={{ fontSize: 11, fill: "#5a6b6b" }}
            stroke="rgba(16,66,65,0.15)"
            tickFormatter={formatGHSCompact}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 12 }}
            formatter={(v: number) => formatGHS(v)}
          />
          <ReferenceLine y={0} stroke="rgba(13,148,136,0.5)" strokeDasharray="2 4" />
          <Line type="monotone" dataKey="Ideal" stroke="#f5b97e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          <Line type="monotone" dataKey="Remaining" stroke="#104241" strokeWidth={2.5} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
