"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import { buildSeedState } from "./seed";
import { computeLoan } from "./loan";
import { nowIso } from "./format";
import type {
  ActionItem,
  ActionStatus,
  AppState,
  FundingSource,
  LoanScenario,
  MoneyLog,
  StatusHistoryEntry,
  Vehicle,
  VehicleStatus,
} from "./types";

type Store = AppState & {
  hydrated: boolean;
  _setHydrated: () => void;

  // money logs
  addLog: (input: { amount: number; sourceId: string; date: string; notes?: string }) => MoneyLog;
  updateLog: (id: string, patch: Partial<MoneyLog>) => void;
  deleteLog: (id: string) => void;

  // sources
  updateSource: (id: string, patch: Partial<FundingSource>) => void;

  // vehicles
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  setVehicleStatus: (id: string, status: VehicleStatus, note?: string) => void;

  // tasks
  addTask: (input: Omit<ActionItem, "id" | "order">) => void;
  updateTask: (id: string, patch: Partial<ActionItem>) => void;
  toggleTaskDone: (id: string) => void;
  deleteTask: (id: string) => void;

  // scenarios
  addScenario: (input: { label: string; principal: number; apr: number; termMonths: number }) => void;
  deleteScenario: (id: string) => void;

  // goal
  updateGoal: (patch: Partial<AppState["goal"]>) => void;

  // utility
  resetAll: () => void;
};

const STORAGE_KEY = "vome-capital-tracker:v1";

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...buildSeedState(),
      hydrated: false,
      _setHydrated: () => set({ hydrated: true }),

      addLog: ({ amount, sourceId, date, notes }) => {
        const log: MoneyLog = {
          id: nanoid(10),
          amount,
          sourceId,
          date,
          notes,
          createdAt: nowIso(),
        };
        set((s) => ({
          logs: [log, ...s.logs],
          lastUsedSourceId: sourceId,
        }));
        return log;
      },

      updateLog: (id, patch) =>
        set((s) => ({
          logs: s.logs.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),

      deleteLog: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),

      updateSource: (id, patch) =>
        set((s) => ({
          sources: s.sources.map((src) => (src.id === id ? { ...src, ...patch } : src)),
        })),

      updateVehicle: (id, patch) =>
        set((s) => ({
          vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),

      setVehicleStatus: (id, status, note) => {
        const entry: StatusHistoryEntry = { status, date: nowIso(), note };
        set((s) => ({
          vehicles: s.vehicles.map((v) =>
            v.id === id
              ? { ...v, status, statusHistory: [...v.statusHistory, entry] }
              : v,
          ),
        }));
      },

      addTask: (input) => {
        const order = Math.max(0, ...get().tasks.map((t) => t.order)) + 1;
        const task: ActionItem = { id: nanoid(10), order, ...input };
        set((s) => ({ tasks: [...s.tasks, task] }));
      },

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      toggleTaskDone: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t;
            const newStatus: ActionStatus = t.status === "Done" ? "Not Started" : "Done";
            return {
              ...t,
              status: newStatus,
              completedAt: newStatus === "Done" ? nowIso() : undefined,
            };
          }),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      addScenario: ({ label, principal, apr, termMonths }) => {
        const c = computeLoan(principal, apr, termMonths);
        const scenario: LoanScenario = {
          id: nanoid(10),
          label,
          principal,
          apr,
          termMonths,
          ...c,
        };
        set((s) => ({ scenarios: [...s.scenarios, scenario].slice(-10) }));
      },

      deleteScenario: (id) =>
        set((s) => ({ scenarios: s.scenarios.filter((sc) => sc.id !== id) })),

      updateGoal: (patch) =>
        set((s) => ({ goal: { ...s.goal, ...patch } })),

      resetAll: () => {
        const fresh = buildSeedState();
        set({ ...fresh, hydrated: true, lastUsedSourceId: undefined });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
      version: 1,
    },
  ),
);

// Derived selectors
export function selectSourceTotals(state: AppState) {
  const totals = new Map<string, number>();
  for (const src of state.sources) totals.set(src.id, 0);
  for (const log of state.logs) {
    totals.set(log.sourceId, (totals.get(log.sourceId) ?? 0) + log.amount);
  }
  return totals;
}

export function selectTotalRaised(state: AppState): number {
  return state.logs.reduce((sum, l) => sum + l.amount, 0);
}

export function selectLogsInRange(state: AppState, startIso: string, endIso: string): MoneyLog[] {
  return state.logs.filter((l) => l.date >= startIso && l.date <= endIso);
}
