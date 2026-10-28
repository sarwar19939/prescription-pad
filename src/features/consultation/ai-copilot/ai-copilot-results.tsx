'use client';

/**
 * AI Co-Pilot Results Presentation:
 * Displays Most Probable Diagnosis card with 1-click confirmation,
 * interactive clarifying questions to refine diagnoses, alternative differentials,
 * safety warnings, recommended investigations, and full prescription packages.
 */
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Info,
  PlusCircle,
  Sparkles,
  Wand2,
} from 'lucide-react';

import type { ClinicalTrackResult, SuggestedMedication } from '@/services/aiClinicalCopilot';
import type { FullPrescriptionPackage } from '@/services/aiPrescriptionService';
import type { Patient } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIFullPrescriptionCard } from './ai-full-prescription-card';
import { AICopilotQuestions } from './ai-copilot-questions';

interface AICopilotResultsProps {
  results: ClinicalTrackResult;
  addedMeds: Set<string>;
  patient: Patient;
  onAddToRx: (med: SuggestedMedication) => void;
  onConfirmDiagnosis?: (diag: string) => void;
  fullPackage?: FullPrescriptionPackage | null;
  onApplyFullPackage?: (pkg: FullPrescriptionPackage) => Promise<{ addedCount: number; skippedCount: number }>;
  doctorAnswers?: Record<string, string>;
  onAnswerChange?: (id: string, answer: string) => void;
  onSubmitAnswers?: () => void;
  loadingAnswers?: boolean;
}

export function AICopilotResults({
  results,
  addedMeds,
  patient,
  onAddToRx,
  onConfirmDiagnosis,
  fullPackage,
  onApplyFullPackage,
  doctorAnswers = {},
  onAnswerChange = () => {},
  onSubmitAnswers = () => {},
  loadingAnswers = false,
}: AICopilotResultsProps) {
  const primaryProbable =
    results.probable_diagnosis ||
    (results.differential_diagnoses && results.differential_diagnoses.length > 0
      ? results.differential_diagnoses[0]
      : null);

  const alternativeDiffs = (results.differential_diagnoses || []).filter(
    (d) => d !== primaryProbable,
  );

  return (
    <div className="space-y-4">
      {/* Clinical Summary Alert */}
      {results.clinical_summary && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs text-indigo-950 flex items-start gap-2">
          <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{results.clinical_summary}</p>
        </div>
      )}

      {/* 1. Most Probable Diagnosis Primary Card */}
      {primaryProbable && (
        <div className="rounded-2xl border-2 border-indigo-500 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
              {results.is_confirmed_mode
                ? 'ডাক্তার কর্তৃক নিশ্চিতকৃত ডায়াগনোসিস'
                : '★ সর্বাধিক সম্ভাব্য রোগ (Most Probable Diagnosis)'}
            </span>
            <span className="text-[10px] bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {results.is_confirmed_mode ? 'Confirmed' : 'Probable Match'}
            </span>
          </div>

          <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
            {primaryProbable}
          </div>

          {onConfirmDiagnosis && (
            <Button
              type="button"
              onClick={() => onConfirmDiagnosis(primaryProbable)}
              className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Wand2 className="h-3.5 w-3.5" />
              {results.is_confirmed_mode
                ? '✓ প্রেসক্রিপশন প্রোটোকল তৈরি করুন'
                : '✓ এই রোগ নিশ্চিত করুন ও সম্পূর্ণ প্রেসক্রিপশন লিখুন'}
            </Button>
          )}
        </div>
      )}

      {/* 2. Interactive Clinical Clarifying Questions */}
      {results.clinical_questions && results.clinical_questions.length > 0 && (
        <AICopilotQuestions
          questions={results.clinical_questions}
          answers={doctorAnswers}
          onAnswerChange={onAnswerChange}
          onSubmitAnswers={onSubmitAnswers}
          loading={loadingAnswers}
        />
      )}

      {/* 3. Safety Warnings Section */}
      {results.safety_warnings?.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5">
          <div className="flex items-center gap-2 font-bold text-xs text-rose-900 mb-1.5 uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>Safety Alerts &amp; Drug Warnings</span>
          </div>
          <ul className="space-y-1 text-xs text-rose-800 font-medium">
            {results.safety_warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Alternative Differential Diagnoses */}
      {alternativeDiffs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              বিকল্প ডিফারেনশিয়াল ডায়াগনোসিস (Alternative Differentials)
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              প্রয়োজনে ক্লিক করে নির্বাচন করুন
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alternativeDiffs.map((diag, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs hover:border-indigo-300 transition-colors"
              >
                <Badge variant="outline" className="border-0 bg-transparent text-slate-800 px-2 text-xs font-bold">
                  {diag}
                </Badge>
                {onConfirmDiagnosis && (
                  <button
                    type="button"
                    onClick={() => onConfirmDiagnosis(diag)}
                    className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                  >
                    <Wand2 className="h-3 w-3" />
                    কনফার্ম
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Full Prescription Package if Generated */}
      {fullPackage && onApplyFullPackage && (
        <AIFullPrescriptionCard
          pkg={fullPackage}
          patient={patient}
          onApply={onApplyFullPackage}
        />
      )}

      {/* 6. Suggested Medications with 1-Click Add */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
          সাজেস্টেড সহায়ক ঔষধ তালিকা
        </span>
        <div className="space-y-2">
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

      {/* 7. Recommended Investigations */}
      {results.recommended_investigations?.length > 0 && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
            প্রয়োজনীয় প্যাথলজি ও পরীক্ষা
          </span>
          <ul className="space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
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
