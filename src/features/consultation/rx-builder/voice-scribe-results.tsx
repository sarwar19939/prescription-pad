'use client';

/**
 * Extracted Diagnostic Results View for Voice Scribe.
 * Focuses on Chief Complaints & Differential Diagnoses selection,
 * plus auto-detected Vitals (BP, Pulse, Temp, Weight, SpO2) and Clinical History.
 */
import { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Stethoscope,
  Wand2,
} from 'lucide-react';

import type { ScribeExtractionResult } from '@/services/aiScribeService';
import { Button } from '@/components/ui/button';

interface VoiceScribeResultsProps {
  result: ScribeExtractionResult;
  selectedDiagnosis: string;
  onSelectDiagnosis: (diag: string) => void;
  onApplyDiagnosisOnly: () => void;
  onAddMedicinesAlso: () => void;
  applied: boolean;
}

export function VoiceScribeResults({
  result,
  selectedDiagnosis,
  onSelectDiagnosis,
  onApplyDiagnosisOnly,
  onAddMedicinesAlso,
  applied,
}: VoiceScribeResultsProps) {
  const [showMeds, setShowMeds] = useState(false);
  const vitals = result.vitals_mentioned || {};
  const hasVitals = Object.values(vitals).some((v) => Boolean(v));

  return (
    <div className="space-y-3.5 rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/50 via-white to-slate-50/30 p-4 shadow-2xs">
      {/* Auto-detected Vitals from Speech */}
      {hasVitals && (
        <div className="rounded-xl border border-teal-200 bg-teal-50/90 p-2.5">
          <span className="text-[11px] font-bold text-teal-900 block mb-1 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-teal-700" />
            কথা থেকে অটো-ডিটেক্টেড ভাইটালস (Auto-Detected Vitals):
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-mono font-semibold text-teal-950">
            {vitals.bp && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded-md">BP: {vitals.bp}</span>}
            {vitals.pulse && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded-md">Pulse: {vitals.pulse}</span>}
            {vitals.temp && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded-md">Temp: {vitals.temp}</span>}
            {vitals.weight && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded-md">Weight: {vitals.weight}</span>}
            {vitals.spo2 && <span className="bg-white border border-teal-300 px-2 py-0.5 rounded-md">SpO₂: {vitals.spo2}</span>}
          </div>
        </div>
      )}

      {/* Chief Complaints (Medical English) */}
      <div>
        <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
          <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
          চিহ্নিত প্রধান উপসর্গসমূহ (Chief Complaints - Medical English):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {result.chief_complaints.map((c, i) => (
            <span key={i} className="rounded-lg bg-teal-50/80 border border-teal-200 px-2.5 py-1 text-xs font-semibold text-teal-900">
              • {c}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Diagnoses (Clickable selection) */}
      <div>
        <span className="text-xs font-bold text-slate-700 block mb-1.5">
          🎯 AI প্রস্তাবিত সম্ভাব্য রোগসমূহ (ডাক্তার হিসেবে নির্বাচন করুন):
        </span>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onSelectDiagnosis(result.primary_diagnosis)}
            className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
              selectedDiagnosis === result.primary_diagnosis
                ? 'border-teal-600 bg-teal-50 text-teal-950 ring-1 ring-teal-500'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>★ {result.primary_diagnosis}</span>
            <span className="text-[10px] bg-teal-200/80 text-teal-900 px-2 py-0.5 rounded font-extrabold uppercase">
              Primary Match
            </span>
          </button>

          {result.differential_diagnoses
            .filter((d) => d !== result.primary_diagnosis)
            .map((diff, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDiagnosis(diff)}
                className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  selectedDiagnosis === diff
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-500 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>• {diff}</span>
                <span className="text-[10px] text-slate-500">Differential</span>
              </button>
            ))}
        </div>
      </div>

      {/* Clinical Examination & History Notes */}
      {(result.history_notes?.length > 0 || result.examination_findings) && (
        <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-2">
          {result.history_notes?.length > 0 && (
            <p><strong className="text-slate-700">H/O:</strong> {result.history_notes.join('; ')}</p>
          )}
          {result.examination_findings && (
            <p><strong className="text-slate-700">O/E:</strong> {result.examination_findings}</p>
          )}
        </div>
      )}

      {/* Advice */}
      {result.advice.length > 0 && (
        <div className="border-t border-slate-100 pt-2 text-xs text-slate-600">
          <span className="font-bold text-slate-700 block mb-1">পরামর্শ (Advice):</span>
          <ul className="space-y-1">
            {result.advice.map((adv, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-teal-600 font-bold">•</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Apply Button */}
      <Button
        type="button"
        onClick={onApplyDiagnosisOnly}
        disabled={applied}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
      >
        {applied ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-200" />
            ভাইটালস, উপসর্গ ও রোগ প্রেসক্রিপশনে যুক্ত হয়েছে!
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            ✓ নির্বাচিত রোগ, ভাইটালস ও উপসর্গ প্রেসক্রিপশনে যুক্ত করুন
          </>
        )}
      </Button>

      {/* Collapsible Medicines */}
      <div className="border-t border-slate-200/60 pt-2">
        <button
          type="button"
          onClick={() => setShowMeds(!showMeds)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
        >
          <span>প্রয়োজনে প্রস্তাবিত ঔষধ প্রোটোকল দেখতে চান? ({result.suggested_medicines.length}টি)</span>
          {showMeds ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showMeds && (
          <div className="mt-2 space-y-1.5">
            {result.suggested_medicines.map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-slate-200 p-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{m.dosage_form}. {m.brand_name} {m.strength}</span>
                  <span className="text-slate-500 text-[11px] ml-1">({m.generic_name})</span>
                </div>
                <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                  {m.schedule} ({m.meal_timing})
                </span>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={onAddMedicinesAlso}
              className="w-full mt-2 h-9 border-teal-300 text-teal-800 hover:bg-teal-50 text-xs font-bold rounded-lg"
            >
              + এই ঔষধগুলোও প্রেসক্রিপশনে যোগ করুন
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
