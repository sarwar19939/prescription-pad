'use client';

/**
 * ClinicalPhotoResults — Interactive Vision Results with Primary & Differential Diagnosis Swap.
 * Clicking any differential diagnosis swaps it to the primary position and vice-versa.
 */
import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Pill,
  Sparkles,
  Wand2,
} from 'lucide-react';

import type { ClinicalVisionResult } from '@/services/aiVisionService';
import { Button } from '@/components/ui/button';

interface ClinicalPhotoResultsProps {
  result: ClinicalVisionResult;
  primaryDiagnosis: string;
  differentialDiagnoses: string[];
  onSwapDiagnosis: (newPrimary: string) => void;
  onApplyToRx: () => void;
  applied: boolean;
}

export function ClinicalPhotoResults({
  result,
  primaryDiagnosis,
  differentialDiagnoses,
  onSwapDiagnosis,
  onApplyToRx,
  applied,
}: ClinicalPhotoResultsProps) {
  const [showMeds, setShowMeds] = useState(false);

  return (
    <div className="space-y-3.5 rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/30 p-4 shadow-2xs">
      {/* Primary Diagnosis Banner */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            নির্বাচিত মূল রোগ (Primary Diagnosis):
          </span>
          {result.ai_provider === 'gemini' ? (
            <span className="rounded-full bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse" />
              🌐 লাইভ অনলাইন AI (Google Gemini Vision)
            </span>
          ) : result.ai_provider === 'nvidia_nim' ? (
            <span className="rounded-full bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 flex items-center gap-1 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse" />
              🌐 লাইভ অনলাইন AI (NVIDIA NIM Vision)
            </span>
          ) : (
            <span className="rounded-full bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5">
              অফলাইন ব্যাকআপ প্রটোকল
            </span>
          )}
        </div>
        <p className="text-sm font-extrabold text-indigo-950">{primaryDiagnosis}</p>
      </div>

      {/* Differential Diagnoses with 1-Click Swap */}
      {differentialDiagnoses.length > 0 && (
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
            ডিফারেনশিয়াল ডায়াগনোসিস (ক্লিক করলে মূল রোগ হিসেবে অদলবদল হবে):
          </span>
          <div className="flex flex-wrap gap-2">
            {differentialDiagnoses.map((diff, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSwapDiagnosis(diff)}
                className="group flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-all shadow-2xs"
                title="ক্লিক করে এটিকে মূল রোগ করুন"
              >
                <span>{diff}</span>
                <span className="text-[10px] text-indigo-600 opacity-60 group-hover:opacity-100 font-bold">
                  ⇄ সিলেক্ট করুন
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Observed Morphological Features */}
      {result.observed_features?.length > 0 && (
        <div className="text-xs text-slate-600">
          <span className="text-[11px] font-bold text-slate-700 block mb-1">দৃশ্যমান ক্লিনিক্যাল লক্ষণ:</span>
          <ul className="space-y-0.5">
            {result.observed_features.map((f, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Warnings */}
      {result.safety_warnings?.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">সতর্কবার্তা:</strong>
            <p className="mt-0.5">{result.safety_warnings.join(' ')}</p>
          </div>
        </div>
      )}

      {/* 1-Click Apply to Prescription */}
      <Button
        type="button"
        onClick={onApplyToRx}
        disabled={applied}
        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
      >
        {applied ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-200" />
            নির্বাচিত রোগ ও তথ্য প্রেসক্রিপশনে যুক্ত হয়েছে!
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            ✓ নির্বাচিত ডায়াগনোসিস প্রেসক্রিপশনে প্রয়োগ করুন
          </>
        )}
      </Button>

      {/* Suggested Medications Preview (Optional Collapsible) */}
      {result.suggested_treatment?.medicines?.length ? (
        <div className="border-t border-slate-200/60 pt-2">
          <button
            type="button"
            onClick={() => setShowMeds(!showMeds)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
          >
            <span>প্রস্তাবিত ডার্মাটোলজি প্রোটোকল ওষুধ ({result.suggested_treatment.medicines.length}টি)</span>
            {showMeds ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showMeds && (
            <div className="mt-2 space-y-1.5">
              {result.suggested_treatment.medicines.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-slate-200 p-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{m.dosage_form}. {m.brand_name} {m.strength}</span>
                    <span className="text-slate-500 text-[11px] ml-1">({m.generic_name})</span>
                  </div>
                  <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                    {m.schedule} ({m.meal_timing})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
