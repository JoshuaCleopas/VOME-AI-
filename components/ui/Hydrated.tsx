"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export function Hydrated({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const hydrated = useStore((s) => s.hydrated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !hydrated) {
    return <>{fallback ?? <div className="min-h-[200px] grid place-items-center text-ink-subtle text-sm">Loading…</div>}</>;
  }
  return <>{children}</>;
}
