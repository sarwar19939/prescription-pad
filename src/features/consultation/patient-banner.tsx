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
    <div className="sticky top-[52px] z-30 border-b border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-lg font-semibold">{patient.full_name}</h2>
        <span className="text-sm text-neutral-500">
          {patient.age} yrs · {patient.gender}
        </span>
        <Badge variant="secondary">{patient.blood_group || '—'}</Badge>
        <span className="font-mono text-xs text-neutral-400">{patient.patient_code}</span>

        {onOpenCopilot && (
          <Button
            type="button"
            size="sm"
            onClick={onOpenCopilot}
            className="ml-auto bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white shadow-xs text-xs h-7 px-2.5"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            AI Co-Pilot
          </Button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {patient.chronic_conditions.map((c) => (
          <Badge key={c} variant="outline" className="bg-neutral-100 text-neutral-700">
            {c}
          </Badge>
        ))}
        {patient.allergies.length > 0 && (
          <>
            {patient.allergies.map((a) => (
              <Badge
                key={a}
                variant="destructive"
                className="gap-1 border-red-300 bg-red-100 text-xs font-semibold text-red-800"
              >
                <TriangleAlert className="h-3.5 w-3.5" aria-hidden />
                ALLERGY: {a}
              </Badge>
            ))}
          </>
        )}
        {patient.chronic_conditions.length === 0 && patient.allergies.length === 0 && (
          <span className="text-xs text-neutral-400">No chronic conditions or allergies on record.</span>
        )}
      </div>
    </div>
  );
}
