'use client';

/**
 * General advice & follow-up: quick-advice presets toggled into the
 * encounter's advice array, free-text additions, and follow-up date picker.
 * Features clinical presets tailored for Bangladesh outpatient practice.
 */
import { useState } from 'react';
import { addDays, addMonths, format } from 'date-fns';
import { Check, ChevronDown, ChevronUp, Clock, Plus, RotateCcw, Sparkles, X } from 'lucide-react';
import { db } from '@/db/localDb';
import { toBengaliNumerals } from '@/lib/prescriptionFormatters';
import { matchProtocolsForDiagnosis } from '@/services/clinicalProtocolsService';
import type { Encounter } from '@/types/schema';
import { FOLLOW_UP_PRESETS, QUICK_ADVICE } from './advice-presets';

export function AdviceSection({ encounter }: { encounter: Encounter }) {
  const [showAdvicePresets, setShowAdvicePresets] = useState(false);
  const [customDraft, setCustomDraft] = useState('');
  const write = (patch: Partial<Encounter>, debounce = false) => {
    const delayedWrite = () => {
      void db.encounters.update(encounter.id, {
        ...patch,
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      });
    };
    if (debounce) {
      setTimeout(delayedWrite, 400);
    } else {
      delayedWrite();
    }
  };

  const currentAdvice = encounter.advice || [];

  // Disease-tailored AI Advice based on Diagnosis & Complaints
  const matchedProtocols = matchProtocolsForDiagnosis([
    ...(encounter.diagnosis || []),
    ...(encounter.chief_complaints || []),
  ]);
  const smartAiAdvice = Array.from(new Set(matchedProtocols.flatMap((p) => p.adviceBn)));
  const unselectedSmartAdvice = smartAiAdvice.filter((a) => !currentAdvice.includes(a));

  const toggleAdvice = (advice: string) => {
    const has = currentAdvice.includes(advice);
    write({
      advice: has
        ? currentAdvice.filter((a) => a !== advice)
        : [...currentAdvice, advice],
    });
  };

  const handleAddCustom = () => {
    const trimmed = customDraft.trim();
    if (!trimmed) return;
    if (!currentAdvice.includes(trimmed)) {
      write({ advice: [...currentAdvice, trimmed] });
    }
    setCustomDraft('');
  };

  const handlePresetFollowUp = (preset: typeof FOLLOW_UP_PRESETS[0]) => {
    const base = new Date();
    let targetDate: Date | null = null;
    if (preset.days) targetDate = addDays(base, preset.days);
    else if (preset.months) targetDate = addMonths(base, preset.months);

    const isoDate = targetDate ? format(targetDate, 'yyyy-MM-dd') : null;
    const text = preset.text || preset.label;

    write({
      follow_up_text: text,
      follow_up_date: isoDate,
    });
  };

  const handleClearFollowUp = () => {
    write({
      follow_up_text: null,
      follow_up_date: null,
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            রোগীর পরামর্শ ও জীবনযাত্রা নির্দেশিকা (Clinical Advice)
          </span>
          <button
            type="button"
            onClick={() => setShowAdvicePresets(!showAdvicePresets)}
            className="text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1 transition-colors"
          >
            {showAdvicePresets ? <>সংক্ষেপ করুন <ChevronUp className="h-3 w-3" /></> : <>+ পরামর্শ প্রিসেট <ChevronDown className="h-3 w-3" /></>}
          </button>
        </div>

        {showAdvicePresets && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-3 animate-in fade-in duration-150">
            {QUICK_ADVICE.map((advice) => (
              <label
                key={advice}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200/70 bg-slate-50/60 p-2 text-xs font-medium text-slate-800 hover:bg-teal-50/60 hover:border-teal-200 transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-teal-600 cursor-pointer"
                  checked={currentAdvice.includes(advice)}
                  onChange={() => toggleAdvice(advice)}
                />
                <span>{advice}</span>
              </label>
            ))}
          </div>
        )}

        {/* Disease-Tailored Smart AI Advice Banner */}
        {unselectedSmartAdvice.length > 0 && (
          <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-2.5 space-y-1.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> রোগ অনুযায়ী AI নির্বাচিত পরামর্শ:
              </span>
              <button
                type="button"
                onClick={() => {
                  const merged = Array.from(new Set([...currentAdvice, ...unselectedSmartAdvice]));
                  write({ advice: merged });
                }}
                className="px-2.5 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] shadow-2xs transition-all"
              >
                + সব যুক্ত করুন
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {unselectedSmartAdvice.map((adv) => (
                <button
                  key={adv}
                  type="button"
                  onClick={() => toggleAdvice(adv)}
                  className="rounded-lg bg-white border border-indigo-200 px-2 py-1 text-left text-xs text-indigo-900 font-medium hover:bg-indigo-100 flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-3 w-3 text-indigo-600 shrink-0" />
                  <span>{adv}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Clinical Advice: Wrapped Paragraph Cards with Always-Visible Cross Button */}
        {currentAdvice.length > 0 && (
          <div className="space-y-1.5 mb-2.5">
            {currentAdvice.map((adv, idx) => (
              <div
                key={idx}
                className="group flex items-start justify-between gap-2.5 rounded-xl border border-teal-200/80 bg-teal-50/40 p-2.5 text-xs text-slate-800 transition-colors hover:bg-teal-50/80"
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="font-mono font-bold text-teal-800 shrink-0 mt-0.5">
                    {toBengaliNumerals(idx + 1)}.
                  </span>
                  <p className="font-medium text-slate-900 leading-relaxed whitespace-pre-wrap break-words flex-1">
                    {adv}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAdvice(adv)}
                  className="h-6 w-6 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 flex items-center justify-center shrink-0 transition-colors"
                  title="এই পরামর্শটি মুছে ফেলুন"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Free-text Advice Input Bar */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-1 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/30 transition-all">
          <input
            type="text"
            placeholder="পরামর্শ লিখুন (যেমন: কুসুম গরম পানি পান করুন, অতিরিক্ত লবণ নিষেধ) ও Enter চাপুন..."
            className="h-9 flex-1 border-0 bg-transparent px-2.5 text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
            value={customDraft}
            onChange={(e) => setCustomDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customDraft.trim()}
            className="h-8 px-3 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white flex items-center gap-1 transition-all shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> যুক্ত করুন
          </button>
        </div>
      </div>

      {/* 2. Follow-up / পরবর্তী সাক্ষাৎ Section */}
      <div className="pt-2 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal-600" />
            পরবর্তী সাক্ষাৎ (দিন, সপ্তাহ বা মাস অনুযায়ী নির্বাচন করুন)
          </label>
          {(encounter.follow_up_text || encounter.follow_up_date) && (
            <button
              type="button"
              onClick={handleClearFollowUp}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> ক্লিয়ার করুন
            </button>
          )}
        </div>

        {/* Quick Day / Week / Month Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {FOLLOW_UP_PRESETS.map((p) => {
            const isSelected =
              encounter.follow_up_text === (p.text || p.label) ||
              encounter.follow_up_text === p.label;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePresetFollowUp(p)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-teal-500 hover:bg-teal-50'
                }`}
              >
                {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Custom text & date picker row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="পরবর্তী সাক্ষাতের বিবরণ (যেমন: ৭ দিন পর, ১ মাস পর, রিপোর্টসহ)..."
              className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:text-slate-400"
              value={encounter.follow_up_text ?? ''}
              onChange={(e) => write({ follow_up_text: e.target.value ? e.target.value : null }, true)}
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 font-medium">তারিখ:</span>
            <input
              type="date"
              className="h-10 rounded-xl border border-slate-300 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 transition-all"
              value={encounter.follow_up_date ?? ''}
              onChange={(e) =>
                write(
                  { follow_up_date: e.target.value ? e.target.value : null },
                  true,
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
