"use client";

import { useStore, selectSourceTotals } from "@/lib/store";
import { formatGHS } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function FundingDonut() {
  const sources = useStore((s) => s.sources);
  const logs = useStore((s) => s.logs);
  const totals = selectSourceTotals({ sources, logs } as any);

  const data = sources.map((s) => ({
    name: s.name,
    value: totals.get(s.id) ?? 0,
    color: s.color,
  }));
  const total = data.reduce((a, d) => a + d.value, 0);

  if (total === 0) {
    return <div className="h-64 grid place-items-center text-ink-subtle text-sm">No funds logged yet</div>;
  }

  return (
    <div className="h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 12 }}
            formatter={(v: number) => formatGHS(v)}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wide text-ink-subtle">Total</div>
          <div className="num-display text-base text-ink">{formatGHS(total)}</div>
        </div>
      </div>
    </div>
  );
}
