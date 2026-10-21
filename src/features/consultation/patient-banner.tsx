'use client';

/** Sticky patient banner: identity + chronic conditions + red allergy alert. */
import { Bot, Sparkles, TriangleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Patient } from '@/types/schema';

export function PatientBanner({
  patient,
  onOpenCopilot,
}: {
  patient: Patient;
  onOpenCopilot?: () => void;
}) {
  return (
    <div className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/95 px-6 py-4 shadow-xs backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">{patient.full_name}</h2>
        <span className="text-base font-medium text-slate-600">
          {patient.age} yrs · {patient.gender}
        </span>
        <Badge variant="secondary" className="bg-slate-100 text-slate-800 text-sm font-semibold px-2.5 py-0.5">
          {patient.blood_group || '—'}
        </Badge>
        <span className="font-mono text-sm font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
          {patient.patient_code}
        </span>

        {onOpenCopilot && (
          <Button
            type="button"
            onClick={onOpenCopilot}
            className="ml-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm font-semibold text-sm h-10 px-4 rounded-xl flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Co-Pilot
          </Button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {patient.chronic_conditions.map((c) => (
          <Badge key={c} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-sm font-medium px-3 py-1 rounded-lg">
            {c}
          </Badge>
        ))}
        {patient.allergies.length > 0 && (
          <>
            {patient.allergies.map((a) => (
              <Badge
                key={a}
                variant="destructive"
                className="gap-1.5 border-rose-200 bg-rose-50 text-sm font-semibold text-rose-700 px-3 py-1 rounded-lg"
              >
                <TriangleAlert className="h-4 w-4 text-rose-600" aria-hidden />
                ALLERGY: {a}
              </Badge>
            ))}
          </>
        )}
        {patient.chronic_conditions.length === 0 && patient.allergies.length === 0 && (
          <span className="text-sm text-slate-400">No chronic conditions or allergies on record.</span>
        )}
      </div>
    </div>
  );
}
