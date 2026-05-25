"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { ActionItem } from "@/lib/types";

type Lane = {
  key: string;
  label: string;
  segments: { week: number; weeks: number; color: string }[];
  taskFilter: (t: ActionItem) => boolean;
};

const LANES: Lane[] = [
  {
    key: "list",
    label: "List vehicles",
    segments: [{ week: 1, weeks: 1, color: "#FFD7B4" }],
    taskFilter: (t) => t.category === "Sales" && t.phase === "Week 1",
  },
  {
    key: "sell",
    label: "Sell vehicles",
    segments: [{ week: 3, weeks: 6, color: "#f5b97e" }],
    taskFilter: (t) => t.category === "Sales" && t.phase !== "Week 1",
  },
  {
    key: "loan",
    label: "Bank loan",
    segments: [{ week: 1, weeks: 8, color: "#3a6e6d" }],
    taskFilter: (t) => t.category === "Loan",
  },
  {
    key: "camry",
    label: "Camry",
    segments: [{ week: 2, weeks: 5, color: "#285453" }],
    taskFilter: (t) =>
      t.category === "Buy-side" &&
      (t.task.toLowerCase().includes("camry") || t.task.toLowerCase().includes("inspection")),
  },
  {
    key: "jetour",
    label: "Jetour",
    segments: [{ week: 1, weeks: 8, color: "#104241" }],
    taskFilter: (t) => t.category === "Buy-side" && t.task.toLowerCase().includes("jetour"),
  },
  {
    key: "register",
    label: "Register + insure",
    segments: [{ week: 6, weeks: 3, color: "#0d9488" }],
    taskFilter: (t) => t.category === "Insurance" || t.task.toLowerCase().includes("register"),
  },
];

const TOTAL_WEEKS = 10;

export function RoadmapGantt() {
  const tasks = useStore((s) => s.tasks);
  const goal = useStore((s) => s.goal);
  const [openLane, setOpenLane] = useState<string | null>(null);

  // current week
  const today = new Date();
  const deadline = new Date(goal.deadline);
  const start = new Date(deadline);
  start.setDate(start.getDate() - TOTAL_WEEKS * 7);
  const daysElapsed = Math.max(0, (today.getTime() - start.getTime()) / 86400000);
  const currentWeek = Math.max(1, Math.min(TOTAL_WEEKS, Math.ceil(daysElapsed / 7)));

  return (
    <div className="card card-pad">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold">10-Week Roadmap</h3>
          <div className="text-xs text-ink-muted">Currently week {currentWeek}</div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[600px]">
          {/* Week headers */}
          <div
            className="grid mb-2 text-[10px] text-ink-subtle font-medium pl-32"
            style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}
          >
            {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
              <div key={i} className="text-center">W{i + 1}</div>
            ))}
          </div>

          <div className="space-y-2 relative">
            {/* current week vertical line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-status-warn z-10 pointer-events-none"
              style={{ left: `calc(8rem + ${((currentWeek - 0.5) / TOTAL_WEEKS) * 100}% - 8rem * ${((currentWeek - 0.5) / TOTAL_WEEKS)})` }}
            />

            {LANES.map((lane) => {
              const relatedTasks = tasks.filter(lane.taskFilter);
              const doneRatio = relatedTasks.length
                ? relatedTasks.filter((t) => t.status === "Done").length / relatedTasks.length
                : 0;
              return (
                <div key={lane.key} className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenLane(openLane === lane.key ? null : lane.key)}
                    className="w-32 text-left text-sm font-medium pr-3 text-ink hover:text-teal-deep truncate flex-shrink-0"
                  >
                    {lane.label}
                  </button>
                  <div
                    className="flex-1 grid h-9 relative rounded-lg bg-surface-subtle/60"
                    style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}
                  >
                    {lane.segments.map((seg, i) => (
                      <div
                        key={i}
                        className="rounded-md flex items-center justify-center text-[10px] font-medium text-white relative overflow-hidden"
                        style={{
                          gridColumn: `${seg.week} / span ${seg.weeks}`,
                          background: seg.color,
                          margin: 2,
                        }}
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-white/15"
                          style={{ width: `${doneRatio * 100}%` }}
                        />
                        <span className="relative z-10">{Math.round(doneRatio * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {openLane && (
            <div className="mt-4 pt-4 border-t border-black/[0.06]">
              <div className="text-xs text-ink-muted mb-2">
                Tasks linked to <span className="font-medium text-ink">{LANES.find((l) => l.key === openLane)?.label}</span>
              </div>
              <ul className="space-y-1 text-sm">
                {tasks
                  .filter(LANES.find((l) => l.key === openLane)!.taskFilter)
                  .map((t) => (
                    <li key={t.id} className="flex items-center gap-2">
                      <span
                        className={`size-1.5 rounded-full ${
                          t.status === "Done"
                            ? "bg-status-good"
                            : t.status === "In Progress"
                            ? "bg-status-warn"
                            : "bg-ink-subtle"
                        }`}
                      />
                      <span className={t.status === "Done" ? "line-through text-ink-subtle" : "text-ink"}>
                        {t.task}
                      </span>
                    </li>
                  ))}
                {!tasks.filter(LANES.find((l) => l.key === openLane)!.taskFilter).length && (
                  <li className="text-ink-subtle text-xs">No linked tasks</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
