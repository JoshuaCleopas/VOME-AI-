const GHS_TO_USD = 1 / 11;

const ghsFmt = new Intl.NumberFormat("en-GH", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const usdFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatGHS(amount: number): string {
  return `GH₵ ${ghsFmt.format(Math.round(amount))}`;
}

export function formatUSD(amount: number): string {
  return `$${usdFmt.format(Math.round(amount * GHS_TO_USD))}`;
}

export function formatGHSCompact(amount: number): string {
  if (amount >= 1_000_000) return `GH₵ ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `GH₵ ${(amount / 1_000).toFixed(0)}K`;
  return formatGHS(amount);
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function daysBetween(startIso: string, endIso: string): number {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
