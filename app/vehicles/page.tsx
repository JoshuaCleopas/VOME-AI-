"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Hydrated } from "@/components/ui/Hydrated";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleDetail } from "@/components/vehicles/VehicleDetail";
import type { Vehicle } from "@/lib/types";

export default function VehiclesPage() {
  return (
    <Hydrated>
      <Inner />
    </Hydrated>
  );
}

function Inner() {
  const vehicles = useStore((s) => s.vehicles);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = vehicles.find((v) => v.id === openId) ?? null;

  const buying = vehicles.filter((v) => v.direction === "buying");
  const selling = vehicles.filter((v) => v.direction === "selling");

  return (
    <div className="space-y-10">
      <header>
        <div className="text-xs text-ink-muted uppercase tracking-widest font-medium">Vehicles</div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">
          Buy + Sell Pipeline
        </h1>
      </header>

      <Section title="Buying" subtitle="Acquiring for VOME Studio" vehicles={buying} onOpen={(v) => setOpenId(v.id)} />
      <Section title="Selling" subtitle="Personal vehicles to convert" vehicles={selling} onOpen={(v) => setOpenId(v.id)} />

      <VehicleDetail vehicle={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function Section({
  title,
  subtitle,
  vehicles,
  onOpen,
}: {
  title: string;
  subtitle: string;
  vehicles: Vehicle[];
  onOpen: (v: Vehicle) => void;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="font-display font-semibold text-lg">{title}</h2>
        <span className="text-xs text-ink-muted">{subtitle}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} onClick={() => onOpen(v)} />
        ))}
      </div>
    </section>
  );
}
