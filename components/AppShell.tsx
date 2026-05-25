"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CheckSquare,
  Calculator,
  LineChart,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { LogMoneyDialog } from "./logger/LogMoneyDialog";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Vehicles", icon: Car },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/loan", label: "Loan Calc", icon: Calculator },
  { href: "/analytics", label: "Analytics", icon: LineChart },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [logOpen, setLogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-black/[0.06] bg-surface px-5 py-7 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-3 mb-10 px-2">
          <div className="size-9 rounded-xl bg-teal-deep grid place-items-center text-white font-display font-semibold">
            V
          </div>
          <div>
            <div className="font-display font-semibold text-ink leading-tight">
              VOME Capital
            </div>
            <div className="text-xs text-ink-muted">Tracker</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-teal-deep text-white shadow-soft"
                    : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setLogOpen(true)}
          className="btn-primary w-full"
        >
          <Plus size={16} />
          Log Money
        </button>

        <div className="mt-6 text-[11px] text-ink-subtle px-2">
          Joshua Cleopas · VOME Studio
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-black/[0.06] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-teal-deep grid place-items-center text-white font-display font-semibold text-sm">
            V
          </div>
          <span className="font-display font-semibold">VOME Capital</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-10">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-card border-t border-black/[0.06] flex items-center justify-around py-2 px-2 shadow-lift">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium ${
                active ? "text-teal-deep" : "text-ink-subtle"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile floating log button */}
      <button
        onClick={() => setLogOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 size-14 rounded-full bg-teal-deep text-white shadow-lift grid place-items-center active:scale-95 transition-transform"
        aria-label="Log money"
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>

      <LogMoneyDialog open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
