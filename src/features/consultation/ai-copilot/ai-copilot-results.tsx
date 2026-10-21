'use client';

/**
 * AI Co-Pilot Results Presentation:
 * Displays differential diagnoses, safety alerts, recommended investigations,
 * and suggested medication tracks with 1-click Add to Rx.
 */
import { AlertTriangle, Check, ChevronRight, PlusCircle } from 'lucide-react';

import type { ClinicalTrackResult, SuggestedMedication } from '@/services/aiClinicalCopilot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AICopilotResultsProps {
  results: ClinicalTrackResult;
  addedMeds: Set<string>;
  onAddToRx: (med: SuggestedMedication) => void;
}

export function AICopilotResults({ results, addedMeds, onAddToRx }: AICopilotResultsProps) {
  return (
    <div className="space-y-5">
      {/* Safety Warnings Section */}
      {results.safety_warnings?.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-900 mb-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
            <span>Safety Alerts &amp; Drug Interactions</span>
          </div>
          <ul className="space-y-1.5 text-sm text-rose-800 font-medium">
            {results.safety_warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Differential Diagnoses */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Differential Diagnoses
        </span>
        <div className="flex flex-wrap gap-2">
          {results.differential_diagnoses?.map((diag, i) => (
            <Badge key={i} variant="outline" className="border-slate-300 bg-slate-50 text-slate-900 px-3 py-1.5 text-sm font-semibold">
              {diag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Suggested Medications with 1-Click Add */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Suggested Medication Tracks
        </span>
        <div className="space-y-3">
          {results.suggested_medications?.map((med, i) => {
            const added = addedMeds.has(med.generic_name);
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-teal-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-bold text-slate-950">
                      {med.suggested_brand ? `${med.suggested_brand} (${med.generic_name})` : med.generic_name}
                    </div>
                    <div className="font-mono text-sm font-semibold text-slate-600 mt-1">
                      {med.strength} · {med.schedule} · {med.duration}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={added ? 'secondary' : 'default'}
                    onClick={() => onAddToRx(med)}
                    disabled={added}
                    className={added ? 'bg-teal-50 text-teal-800 font-semibold' : 'bg-teal-600 hover:bg-teal-700 text-white font-semibold'}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 mr-1 text-teal-600" /> Added to Rx
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-1" /> 1-Click Add
                      </>
                    )}
                  </Button>
                </div>

                {med.rationale && (
                  <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    <strong className="text-slate-800 font-semibold">Rationale: </strong>
                    {med.rationale}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Investigations */}
      {results.recommended_investigations?.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Recommended Investigations
          </span>
          <ul className="space-y-1.5 text-sm text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            {results.recommended_investigations.map((inv, i) => (
              <li key={i} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-teal-600 shrink-0" />
                <span className="font-medium">{inv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
