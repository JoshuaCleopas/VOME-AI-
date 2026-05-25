"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
};

export function Dialog({ open, onClose, title, children, maxWidth = "max-w-md" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} bg-surface-card rounded-t-3xl md:rounded-2xl shadow-lift border border-black/[0.06] animate-rise max-h-[90vh] overflow-y-auto scrollbar-thin`}
      >
        {title && (
          <div className="sticky top-0 bg-surface-card/95 backdrop-blur border-b border-black/[0.04] px-6 py-4 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">{title}</h2>
            <button
              onClick={onClose}
              className="size-8 rounded-lg grid place-items-center hover:bg-surface-subtle text-ink-muted"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
