"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore, selectSourceTotals, selectTotalRaised } from "@/lib/store";
import { Hydrated } from "@/components/ui/Hydrated";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { FundingSourceCard } from "@/components/dashboard/FundingSourceCard";
import { VelocityWidget } from "@/components/dashboard/VelocityWidget";
import { CountdownWidget } from "@/components/dashboard/CountdownWidget";
import { LogFeed } from "@/components/logger/LogFeed";
import { LogMoneyDialog } from "@/components/logger/LogMoneyDialog";

export default function DashboardPage() {
  return (
    <Hydrated>
      <DashboardInner />
    </Hydrated>
  );
}

function DashboardInner() {
  const goal = useStore((s) => s.goal);
  const sources = useStore((s) => s.sources);
  const logs = useStore((s) => s.logs);
  const totalRaised = selectTotalRaised({ sources, logs } as any);
  const totals = selectSourceTotals({ sources, logs } as any);
  const [logOpen, setLogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-ink-muted uppercase tracking-widest font-medium">
            Goal
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">
            {goal.name}
          </h1>
        </div>
        <button onClick={() => setLogOpen(true)} className="btn-primary hidden md:inline-flex">
          <Plus size={16} /> Log Money
        </button>
      </header>

      <section className="card card-pad grid md:grid-cols-[auto_1fr] gap-8 items-center">
        <ProgressRing current={totalRaised} target={goal.targetAmount} />
        <div className="grid sm:grid-cols-2 gap-4">
          <VelocityWidget />
          <CountdownWidget />
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold text-lg mb-4">Funding sources</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {sources
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((src) => (
              <FundingSourceCard
                key={src.id}
                source={src}
                current={totals.get(src.id) ?? 0}
              />
            ))}
        </div>
      </section>

      <section className="card card-pad">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-semibold text-lg">Recent activity</h2>
          <span className="text-xs text-ink-muted">{logs.length} entries</span>
        </div>
        <LogFeed limit={10} />
      </section>

      <LogMoneyDialog open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
