'use client';

/**
 * AI Co-Pilot Results Presentation:
 * Displays differential diagnoses, safety alerts, recommended investigations,
 * full multi-drug prescription packages, and 1-click Add to Rx.
 */
import { AlertTriangle, Check, ChevronRight, PlusCircle, Sparkles, Wand2 } from 'lucide-react';

import type { ClinicalTrackResult, SuggestedMedication } from '@/services/aiClinicalCopilot';
import type { FullPrescriptionPackage } from '@/services/aiPrescriptionService';
import type { Patient } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIFullPrescriptionCard } from './ai-full-prescription-card';

interface AICopilotResultsProps {
  results: ClinicalTrackResult;
  addedMeds: Set<string>;
  patient: Patient;
  onAddToRx: (med: SuggestedMedication) => void;
  onConfirmDiagnosis?: (diag: string) => void;
  fullPackage?: FullPrescriptionPackage | null;
  onApplyFullPackage?: (pkg: FullPrescriptionPackage) => Promise<{ addedCount: number; skippedCount: number }>;
}

export function AICopilotResults({
  results,
  addedMeds,
  patient,
  onAddToRx,
  onConfirmDiagnosis,
  fullPackage,
  onApplyFullPackage,
}: AICopilotResultsProps) {
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

      {/* Differential Diagnoses with 1-Click Confirmation & Full Prescription Generation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            সম্ভাব্য রোগ ও ডিফারেন্সিয়াল ডায়াগনোসিস
          </span>
          <span className="text-[11px] text-indigo-700 font-semibold">
            কনফার্ম করলে ফুল প্রেসক্রিপশন আসবে
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {results.differential_diagnoses?.map((diag, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs hover:border-indigo-300 transition-colors"
            >
              <Badge variant="outline" className="border-0 bg-transparent text-slate-900 px-2 text-xs font-bold">
                {diag}
              </Badge>
              {onConfirmDiagnosis && (
                <button
                  type="button"
                  onClick={() => onConfirmDiagnosis(diag)}
                  className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                >
                  <Wand2 className="h-3 w-3" />
                  কনফার্ম &amp; প্রেসক্রিপশন
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Prescription Package if Generated */}
      {fullPackage && onApplyFullPackage && (
        <AIFullPrescriptionCard
          pkg={fullPackage}
          patient={patient}
          onApply={onApplyFullPackage}
        />
      )}

      {/* Suggested Medications with 1-Click Add */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          সাজেস্টেড সহায়ক ঔষধ তালিকা
        </span>
        <div className="space-y-2.5">
          {results.suggested_medications?.map((med, i) => {
            const added = addedMeds.has(med.generic_name);
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-teal-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-950">
                      {med.suggested_brand ? `${med.suggested_brand} (${med.generic_name})` : med.generic_name}
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-600 mt-0.5">
                      {med.strength} · {med.schedule} · {med.duration}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={added ? 'secondary' : 'default'}
                    onClick={() => onAddToRx(med)}
                    disabled={added}
                    className={
                      added
                        ? 'h-8 px-2.5 text-xs bg-teal-50 text-teal-800 font-semibold'
                        : 'h-8 px-2.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold'
                    }
                  >
                    {added ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-teal-600" /> যুক্ত হয়েছে
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-3.5 w-3.5 mr-1" /> ১-ক্লিক অ্যাড
                      </>
                    )}
                  </Button>
                </div>

                {med.rationale && (
                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                    <strong className="text-slate-800 font-semibold">কারণ: </strong>
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
            প্রয়োজনীয় প্যাথলজি ও পরীক্ষা
          </span>
          <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {results.recommended_investigations.map((inv, i) => (
              <li key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span className="font-medium">{inv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
