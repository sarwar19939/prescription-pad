'use client';

/**
 * Extracted Clinical Documentation Results View for Voice Scribe.
 * Focuses strictly on Chief Complaints (C/C), Vitals (BP, Pulse, Temp, Weight, SpO2),
 * History Notes (H/O), and Examination Findings (O/E) for the prescription pad.
 * Does NOT auto-apply diagnoses or medicines (reserved for AI Co-Pilot/Vision).
 */
import {
  Activity,
  CheckCircle2,
  FileText,
  Sparkles,
  Stethoscope,
  Wand2,
} from 'lucide-react';

import type { ScribeExtractionResult } from '@/services/aiScribeService';
import { Button } from '@/components/ui/button';

interface VoiceScribeResultsProps {
  result: ScribeExtractionResult;
  onApply: () => void;
  applied: boolean;
}

export function VoiceScribeResults({
  result,
  onApply,
  applied,
}: VoiceScribeResultsProps) {
  const vitals = result.vitals_mentioned || {};
  const hasVitals = Object.values(vitals).some((v) => Boolean(v));

  return (
    <div className="space-y-3.5 rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/50 via-white to-slate-50/30 p-4 shadow-2xs">
      {/* Auto-detected Vitals from Speech */}
      {hasVitals && (
        <div className="rounded-xl border border-teal-200 bg-teal-50/90 p-2.5">
          <span className="text-[11px] font-bold text-teal-900 block mb-1 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-teal-700" />
            কথা থেকে সংগৃহীত ভাইটালস (Auto-Detected Vitals):
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
      {result.chief_complaints?.length > 0 && (
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
            প্রধান উপসর্গসমূহ (Chief Complaints - C/C):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {result.chief_complaints.map((c, i) => (
              <span key={i} className="rounded-lg bg-teal-50/80 border border-teal-200 px-2.5 py-1 text-xs font-semibold text-teal-900">
                • {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Examination & History Notes */}
      {(result.history_notes?.length > 0 || result.examination_findings) && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-xs text-slate-700 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-600" />
            হিস্ট্রি ও অন এক্সামিনেশন (H/O &amp; O/E):
          </span>
          {result.history_notes?.length > 0 && (
            <p className="leading-relaxed">
              <strong className="text-slate-900">H/O:</strong> {result.history_notes.join('; ')}
            </p>
          )}
          {result.examination_findings && (
            <p className="leading-relaxed">
              <strong className="text-slate-900">O/E:</strong> {result.examination_findings}
            </p>
          )}
        </div>
      )}

      {/* Advice */}
      {result.advice?.length > 0 && (
        <div className="border-t border-slate-100 pt-2 text-xs text-slate-600">
          <span className="font-bold text-slate-700 block mb-1">রোগীর পরামর্শ (Advice):</span>
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

      {/* Guidance Note */}
      <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-2 text-[11px] text-amber-900 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        <span>
          হিস্ট্রি ও এক্সামিনেশন যুক্ত করার পর ডায়াগনোসিস ও প্রেসক্রিপশনের জন্য AI Co-Pilot বা ক্লিনিক্যাল ফটো ব্যবহার করতে পারেন।
        </span>
      </div>

      {/* Apply Button */}
      <Button
        type="button"
        onClick={onApply}
        disabled={applied}
        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
      >
        {applied ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-200" />
            উপসর্গ, ভাইটালস ও O/E প্রেসক্রিপশনে যুক্ত হয়েছে!
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            ✓ উপসর্গ, ভাইটালস ও O/E প্রেসক্রিপশনে যুক্ত করুন
          </>
        )}
      </Button>
    </div>
  );
}
