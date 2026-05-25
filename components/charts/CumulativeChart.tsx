"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { formatGHSCompact, formatGHS } from "@/lib/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";

export function CumulativeChart() {
  const logs = useStore((s) => s.logs);
  const goal = useStore((s) => s.goal);

  const data = useMemo(() => {
    if (!logs.length) return [];
    const byDay = new Map<string, number>();
    for (const l of logs) {
      byDay.set(l.date, (byDay.get(l.date) ?? 0) + l.amount);
    }
    const sortedDates = Array.from(byDay.keys()).sort();
    const start = new Date(sortedDates[0]);
    const end = new Date(goal.deadline);
    const today = new Date();
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    const idealDaily = goal.targetAmount / totalDays;

    const out: { date: string; Actual: number; Ideal: number }[] = [];
    let running = 0;
    const cursor = new Date(start);
    while (cursor <= today) {
      const iso = cursor.toISOString().slice(0, 10);
      running += byDay.get(iso) ?? 0;
      const elapsed = Math.ceil((cursor.getTime() - start.getTime()) / 86400000) + 1;
      out.push({
        date: iso.slice(5),
        Actual: Math.round(running),
        Ideal: Math.round(idealDaily * elapsed),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  }, [logs, goal]);

  if (!data.length) {
    return <Empty msg="Log money to see cumulative progress" />;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="g-actual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#104241" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#104241" stopOpacity={0.04} />
            </linearGradient>
          </defs>
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
          <Area type="monotone" dataKey="Actual" stroke="#104241" fill="url(#g-actual)" strokeWidth={2.5} />
          <Line type="monotone" dataKey="Ideal" stroke="#f5b97e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="h-64 grid place-items-center text-ink-subtle text-sm">{msg}</div>
  );
}
