"use client";

import { useMemo, useState } from "react";
import { amortizationSchedule, computeLoan } from "@/lib/loan";
import { formatGHS } from "@/lib/format";
import { useStore } from "@/lib/store";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Bookmark, Trash2 } from "lucide-react";

export function LoanCalculator() {
  const addScenario = useStore((s) => s.addScenario);
  const scenarios = useStore((s) => s.scenarios);
  const deleteScenario = useStore((s) => s.deleteScenario);

  const [principal, setPrincipal] = useState(250_000);
  const [apr, setApr] = useState(17);
  const [term, setTerm] = useState(48);
  const [label, setLabel] = useState("");

  const c = useMemo(() => computeLoan(principal, apr, term), [principal, apr, term]);
  const schedule = useMemo(() => amortizationSchedule(principal, apr, term), [principal, apr, term]);

  const chartData = schedule.map((row) => ({
    month: row.month,
    Principal: Math.round(row.cumulativePrincipal),
    Interest: Math.round(row.cumulativeInterest),
  }));

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      <div className="card card-pad space-y-6">
        <SliderRow
          label="Principal"
          value={principal}
          min={100_000}
          max={500_000}
          step={5_000}
          onChange={setPrincipal}
          format={formatGHS}
        />
        <SliderRow
          label="APR"
          value={apr}
          min={10}
          max={30}
          step={0.5}
          onChange={setApr}
          format={(v) => `${v.toFixed(1)}%`}
        />
        <SliderRow
          label="Term"
          value={term}
          min={12}
          max={72}
          step={6}
          onChange={setTerm}
          format={(v) => `${v} months`}
        />

        <div className="border-t border-black/[0.06] pt-5 grid grid-cols-3 gap-3">
          <Readout label="Monthly" value={formatGHS(c.monthlyPayment)} accent />
          <Readout label="Total interest" value={formatGHS(c.totalInterest)} />
          <Readout label="Total cost" value={formatGHS(c.totalCost)} />
        </div>

        <div className="border-t border-black/[0.06] pt-5">
          <div className="label">Save scenario</div>
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="e.g. Stretch term"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() => {
                addScenario({
                  label: label || `${term}m @ ${apr.toFixed(1)}%`,
                  principal,
                  apr,
                  termMonths: term,
                });
                setLabel("");
              }}
            >
              <Bookmark size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-display font-semibold">Amortization</h3>
          <div className="text-xs text-ink-muted">Principal vs interest over time</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g-p" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#104241" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#104241" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="g-i" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD7B4" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#FFD7B4" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,66,65,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5a6b6b" }} stroke="rgba(16,66,65,0.15)" />
              <YAxis
                tick={{ fontSize: 11, fill: "#5a6b6b" }}
                stroke="rgba(16,66,65,0.15)"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.06)",
                  fontSize: 12,
                }}
                formatter={(v: number) => formatGHS(v)}
                labelFormatter={(l) => `Month ${l}`}
              />
              <Area type="monotone" dataKey="Principal" stroke="#104241" fill="url(#g-p)" strokeWidth={2} />
              <Area type="monotone" dataKey="Interest" stroke="#f5b97e" fill="url(#g-i)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h4 className="font-display font-semibold text-sm mb-3">Saved scenarios</h4>
          {!scenarios.length ? (
            <div className="text-xs text-ink-subtle py-4 text-center">No scenarios saved yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wide text-ink-subtle border-b border-black/[0.06]">
                    <th className="py-2 pr-2 font-medium">Label</th>
                    <th className="py-2 px-2 font-medium num text-right">Principal</th>
                    <th className="py-2 px-2 font-medium text-right">APR</th>
                    <th className="py-2 px-2 font-medium text-right">Term</th>
                    <th className="py-2 px-2 font-medium num text-right">Monthly</th>
                    <th className="py-2 px-2 font-medium num text-right">Interest</th>
                    <th className="py-2 pl-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s) => (
                    <tr key={s.id} className="border-b border-black/[0.04] last:border-0">
                      <td className="py-2 pr-2 font-medium">{s.label}</td>
                      <td className="py-2 px-2 num text-right">{formatGHS(s.principal)}</td>
                      <td className="py-2 px-2 num text-right">{s.apr.toFixed(1)}%</td>
                      <td className="py-2 px-2 num text-right">{s.termMonths}m</td>
                      <td className="py-2 px-2 num text-right font-semibold text-teal-deep">{formatGHS(s.monthlyPayment)}</td>
                      <td className="py-2 px-2 num text-right text-ink-muted">{formatGHS(s.totalInterest)}</td>
                      <td className="py-2 pl-2 text-right">
                        <button
                          onClick={() => deleteScenario(s.id)}
                          className="size-7 grid place-items-center rounded-lg hover:bg-surface-subtle text-ink-subtle hover:text-status-bad"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">{label}</label>
        <span className="num-display text-base text-ink">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-deep"
      />
      <div className="flex justify-between text-[10px] text-ink-subtle num mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function Readout({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-ink-subtle font-medium">{label}</div>
      <div className={`num-display mt-1 ${accent ? "text-xl text-teal-deep" : "text-base text-ink"}`}>
        {value}
      </div>
    </div>
  );
}
