"use client";

import { Hydrated } from "@/components/ui/Hydrated";
import { LoanCalculator } from "@/components/loan/LoanCalculator";

export default function LoanPage() {
  return (
    <Hydrated>
      <div className="space-y-8">
        <header>
          <div className="text-xs text-ink-muted uppercase tracking-widest font-medium">Financing</div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">
            Loan Calculator
          </h1>
        </header>
        <LoanCalculator />
      </div>
    </Hydrated>
  );
}
