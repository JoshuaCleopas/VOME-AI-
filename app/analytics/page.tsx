"use client";

import { Hydrated } from "@/components/ui/Hydrated";
import { CumulativeChart } from "@/components/charts/CumulativeChart";
import { FundingDonut } from "@/components/charts/FundingDonut";
import { TargetVsCurrentBar } from "@/components/charts/TargetVsCurrentBar";
import { Burndown } from "@/components/charts/Burndown";
import { RoadmapGantt } from "@/components/timeline/RoadmapGantt";

export default function AnalyticsPage() {
  return (
    <Hydrated>
      <div className="space-y-8">
        <header>
          <div className="text-xs text-ink-muted uppercase tracking-widest font-medium">Analytics</div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">
            Progress & Insights
          </h1>
        </header>

        <RoadmapGantt />

        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title="Cumulative Progress" subtitle="Daily total vs ideal pace">
            <CumulativeChart />
          </ChartCard>
          <ChartCard title="Burn-down" subtitle="GH₵ remaining vs deadline">
            <Burndown />
          </ChartCard>
          <ChartCard title="Funding Mix" subtitle="Current breakdown by source">
            <FundingDonut />
          </ChartCard>
          <ChartCard title="Target vs Raised" subtitle="Stacked by source">
            <TargetVsCurrentBar />
          </ChartCard>
        </div>
      </div>
    </Hydrated>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="card card-pad">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display font-semibold">{title}</h3>
        <div className="text-xs text-ink-muted">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
