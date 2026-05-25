"use client";

import type { Vehicle, VehicleStatus } from "@/lib/types";
import { formatGHS } from "@/lib/format";
import { Car } from "lucide-react";

export const STATUS_STYLE: Record<VehicleStatus, { label: string; cls: string }> = {
  "to-source": { label: "To Source", cls: "bg-status-warn/10 text-status-warn" },
  listed: { label: "Listed", cls: "bg-status-warn/10 text-status-warn" },
  inspecting: { label: "Inspecting", cls: "bg-teal-mid/10 text-teal-mid" },
  negotiating: { label: "Negotiating", cls: "bg-teal-mid/10 text-teal-mid" },
  purchased: { label: "Purchased", cls: "bg-status-good/10 text-status-good" },
  sold: { label: "Sold", cls: "bg-status-good/10 text-status-good" },
};

export const STATUS_OPTIONS: VehicleStatus[] = [
  "to-source",
  "listed",
  "inspecting",
  "negotiating",
  "purchased",
  "sold",
];

export function VehicleCard({
  vehicle,
  onClick,
}: {
  vehicle: Vehicle;
  onClick: () => void;
}) {
  const style = STATUS_STYLE[vehicle.status];
  return (
    <button
      onClick={onClick}
      className="card card-pad text-left hover:shadow-lift transition-shadow group"
    >
      <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-teal-pale to-surface-subtle mb-4 overflow-hidden grid place-items-center text-teal-mid/60">
        {vehicle.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <Car size={56} strokeWidth={1.2} />
        )}
      </div>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <div className="font-display font-semibold text-base">{vehicle.name}</div>
          <div className="text-xs text-ink-muted">{vehicle.trim}</div>
        </div>
        <span className={`pill ${style.cls}`}>{style.label}</span>
      </div>
      <div className="num-display text-lg text-ink mt-3">
        {formatGHS(vehicle.workingPrice)}
      </div>
      <div className="text-xs text-ink-subtle mt-1 line-clamp-2">{vehicle.role}</div>
    </button>
  );
}
