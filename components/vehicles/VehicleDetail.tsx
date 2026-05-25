"use client";

import { useState } from "react";
import { Dialog } from "../ui/Dialog";
import { useStore } from "@/lib/store";
import { STATUS_OPTIONS, STATUS_STYLE } from "./VehicleCard";
import { formatDate, formatGHS } from "@/lib/format";
import type { Vehicle, VehicleStatus } from "@/lib/types";

export function VehicleDetail({ vehicle, onClose }: { vehicle: Vehicle | null; onClose: () => void }) {
  const setVehicleStatus = useStore((s) => s.setVehicleStatus);
  const updateVehicle = useStore((s) => s.updateVehicle);
  const [statusNote, setStatusNote] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(vehicle?.notes ?? "");

  if (!vehicle) return null;

  return (
    <Dialog open={!!vehicle} onClose={onClose} title={vehicle.name} maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Direction" value={vehicle.direction === "buying" ? "Buying" : "Selling"} />
          <Stat label="Working price" value={formatGHS(vehicle.workingPrice)} />
          <Stat label="Range low" value={formatGHS(vehicle.priceRangeLow)} />
          <Stat label="Range high" value={formatGHS(vehicle.priceRangeHigh)} />
        </div>

        <div>
          <div className="label">Role</div>
          <div className="text-sm text-ink">{vehicle.role}</div>
        </div>

        <div>
          <div className="label">Update status</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {STATUS_OPTIONS.map((s) => {
              const st = STATUS_STYLE[s];
              const active = vehicle.status === s;
              return (
                <button
                  key={s}
                  onClick={() => setVehicleStatus(vehicle.id, s, statusNote || undefined)}
                  className={`pill border transition-all ${st.cls} ${
                    active ? "ring-2 ring-teal-deep ring-offset-1" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            className="input text-sm"
            placeholder="Optional note for this change…"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="label !mb-0">Notes</div>
            {!editingNotes ? (
              <button
                onClick={() => {
                  setNotes(vehicle.notes ?? "");
                  setEditingNotes(true);
                }}
                className="text-xs text-teal-mid hover:text-teal-deep font-medium"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateVehicle(vehicle.id, { notes });
                    setEditingNotes(false);
                  }}
                  className="text-xs text-teal-deep font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingNotes(false)}
                  className="text-xs text-ink-muted"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {editingNotes ? (
            <textarea
              className="input text-sm min-h-[80px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          ) : (
            <div className="text-sm text-ink-muted whitespace-pre-wrap">
              {vehicle.notes || "—"}
            </div>
          )}
        </div>

        <div>
          <div className="label">History</div>
          <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {vehicle.statusHistory
              .slice()
              .reverse()
              .map((h, idx) => {
                const st = STATUS_STYLE[h.status as VehicleStatus] ?? { label: h.status, cls: "" };
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm border-l-2 border-teal-pale pl-3 py-1"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-ink">{st.label}</div>
                      {h.note && (
                        <div className="text-xs text-ink-muted">{h.note}</div>
                      )}
                    </div>
                    <div className="text-xs text-ink-subtle">{formatDate(h.date)}</div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-ink-subtle font-medium">{label}</div>
      <div className="num-display text-sm text-ink mt-0.5">{value}</div>
    </div>
  );
}
