'use client';

/**
 * AI-Generated Full Prescription Package Presentation Card.
 * Displays a complete multi-drug outpatient prescription package with
 * exact brand, generic, schedule, duration, instructions, and advice.
 * Allows 1-click application directly to the active consultation in Dexie.
 */
import { useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Pill,
  Sparkles,
  Stethoscope,
  Utensils,
  Wand2,
} from 'lucide-react';
import {
  formatSubcontinentDuration,
  formatSubcontinentMealTiming,
  formatSubcontinentSchedule,
} from '@/lib/prescriptionFormatters';
import type { FullPrescriptionPackage } from '@/services/aiPrescriptionService';
import type { Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';

interface AIFullPrescriptionCardProps {
  pkg: FullPrescriptionPackage;
  patient: Patient;
  onApply: (pkg: FullPrescriptionPackage) => Promise<{ addedCount: number; skippedCount: number }>;
}

export function AIFullPrescriptionCard({
  pkg,
  patient,
  onApply,
}: AIFullPrescriptionCardProps) {
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await onApply(pkg);
      setResult({ added: res.addedCount, skipped: res.skippedCount });
      setTimeout(() => setResult(null), 4000);
    } finally {
      setApplying(false);
    }
  };

  const isPediatric = (patient?.age ?? 30) < 12;

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/70 via-white to-violet-50/30 p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-start gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                সম্পূর্ণ প্রেসক্রিপশন প্যাকেজ
              </span>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800">
                {pkg.source === 'protocol_template' ? '⚡ প্রোটোকল টেমপ্লেট' : '✨ AI জেনারেটেড'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {pkg.diagnosis}
            </h3>
            <span className="text-[11px] text-slate-500">
              {isPediatric ? 'শিশুর বয়স ও ওজন অনুযায়ী ক্যালিব্রেটেড' : 'পূর্ণবয়স্ক রোগীর প্রমিত মাত্রা'}
            </span>
          </div>
        </div>
      </div>

      {/* Medicines List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Pill className="h-3.5 w-3.5 text-indigo-600" />
            নির্দেশিত ওষুধসমূহ ({pkg.medicines.length}টি)
          </span>
        </div>

        <div className="space-y-2">
          {pkg.medicines.map((m, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="rounded bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 text-[11px] border border-indigo-200">
                      {m.dosage_form}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{m.brand_name}</span>
                    <span className="text-xs text-slate-500 font-medium">({m.generic_name})</span>
                    <span className="text-xs font-bold text-slate-700">{m.strength}</span>
                  </div>
                </div>

                <span className="shrink-0 font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {formatSubcontinentSchedule(m.schedule)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Utensils className="h-3 w-3 text-teal-600" />
                  {formatSubcontinentMealTiming(m.meal_timing)}
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Clock className="h-3 w-3 text-indigo-600" />
                  {formatSubcontinentDuration(m.duration)}
                </span>
                {m.special_instructions && (
                  <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                    {m.special_instructions}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Advice */}
      {pkg.advice.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            পরামর্শ ও নির্দেশনা:
          </span>
          <ul className="space-y-1 text-xs text-slate-700">
            {pkg.advice.map((adv, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback banner */}
      {result && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {result.added > 0
              ? `সফলভাবে ${result.added}টি ওষুধ ও পরামর্শ প্রেসক্রিপশনে যুক্ত হয়েছে!`
              : 'ওষুধগুলো ইতিমধ্যেই প্রেসক্রিপশনে বিদ্যমান রয়েছে।'}
          </span>
        </div>
      )}

      {/* 1-Click Apply Action Button */}
      <Button
        type="button"
        disabled={applying}
        onClick={handleApply}
        className="w-full h-11 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
      >
        {result ? (
          <>
            <Check className="h-4 w-4 text-emerald-300" />
            প্রেসক্রিপশনে প্রয়োগ সম্পন্ন হয়েছে
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            ১-ক্লিকে পুরো প্রেসক্রিপশন প্রয়োগ করুন
          </>
        )}
      </Button>
    </div>
  );
}
