"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useIsFetching } from "@tanstack/react-query";

export default function GlobalLoader() {
  const fetching = useIsFetching();
  const isLoading = fetching > 0;

  if (typeof window === "undefined") return null;
  if (!isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-6 py-6 shadow-lg">
        <svg className="h-12 w-12 animate-spin text-slate-800" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <div className="text-sm font-medium text-slate-900">Loading…</div>
      </div>
    </div>,
    document.body
  );
}
