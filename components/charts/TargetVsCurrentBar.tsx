"use client";

import { useStore, selectSourceTotals } from "@/lib/store";
import { formatGHS, formatGHSCompact } from "@/lib/format";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

export function TargetVsCurrentBar() {
  const sources = useStore((s) => s.sources);
  const logs = useStore((s) => s.logs);
  const totals = selectSourceTotals({ sources, logs } as any);

  const data = sources.map((s) => {
    const current = totals.get(s.id) ?? 0;
    return {
      name: s.name,
      Raised: current,
      Remaining: Math.max(0, s.targetAmount - current),
      color: s.color,
    };
  });

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,66,65,0.08)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5a6b6b" }} stroke="rgba(16,66,65,0.15)" />
          <YAxis
            tick={{ fontSize: 11, fill: "#5a6b6b" }}
            stroke="rgba(16,66,65,0.15)"
            tickFormatter={formatGHSCompact}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 12 }}
            formatter={(v: number) => formatGHS(v)}
          />
          <Bar dataKey="Raised" stackId="a" radius={[0, 0, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
          <Bar dataKey="Remaining" stackId="a" radius={[6, 6, 0, 0]} fill="rgba(16,66,65,0.08)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
