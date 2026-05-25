"use client";

import { Hydrated } from "@/components/ui/Hydrated";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";

export default function TasksPage() {
  return (
    <Hydrated>
      <div className="space-y-8">
        <header>
          <div className="text-xs text-ink-muted uppercase tracking-widest font-medium">Action Items</div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">
            Roadmap to Two Vehicles
          </h1>
        </header>
        <KanbanBoard />
      </div>
    </Hydrated>
  );
}
