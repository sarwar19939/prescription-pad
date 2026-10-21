'use client';

import { TriangleAlert } from 'lucide-react';
import type { SafetyWarning } from './safety';

export function SafetyBanners({ warnings }: { warnings: SafetyWarning[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-2">
      {warnings.map((w, i) => (
        <div
          key={i}
          className={
            'flex items-start gap-2.5 rounded-xl border p-3 text-sm font-semibold ' +
            (w.severity === 'red'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-amber-200 bg-amber-50 text-amber-900')
          }
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          <span>{w.message}</span>
        </div>
      ))}
    </div>
  );
}
