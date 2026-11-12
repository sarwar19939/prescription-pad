'use client';

/**
 * TaperingDosePanel — Interactive Tapering & Dose Escalation / Step-Down Builder.
 * Allows prescribing stepped doses (e.g. Week 1: 2+0+2 for 7d -> Week 2: 1+0+1 for 7d -> Week 3: 0+0+1 for 7d)
 * with instant 1-click presets for Steroids, Psychiatry titration, and step-down tapering.
 */
import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { MealTiming, PrescriptionItem, TaperingStep } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { toBengaliNumerals } from '@/lib/prescriptionFormatters';

interface TaperingDosePanelProps {
  item: PrescriptionItem;
  onSaveSteps: (steps: TaperingStep[] | undefined) => void;
}

const MEAL_OPTIONS: MealTiming[] = ['After Meal', 'Before Meal', 'With Meal', 'Anytime'];

export function TaperingDosePanel({ item, onSaveSteps }: TaperingDosePanelProps) {
  const existingSteps = item.tapering_steps || [];
  const [isOpen, setIsOpen] = useState(existingSteps.length > 0);
  const [steps, setSteps] = useState<TaperingStep[]>(existingSteps);

  useEffect(() => {
    setSteps(item.tapering_steps || []);
    if ((item.tapering_steps || []).length > 0) setIsOpen(true);
  }, [item.tapering_steps]);

  const updateSteps = (newSteps: TaperingStep[]) => {
    setSteps(newSteps);
    onSaveSteps(newSteps.length > 0 ? newSteps : undefined);
  };

  const handleEnableTapering = () => {
    const initial: TaperingStep[] = [
      {
        step: 1,
        schedule: item.schedule || '1+0+1',
        duration: item.duration || '7 Days',
        meal_timing: item.meal_timing || 'After Meal',
        note: '১ম সপ্তাহ (প্রাথমিক মাত্রা)',
      },
      {
        step: 2,
        schedule: '0+0+1',
        duration: '7 Days',
        meal_timing: item.meal_timing || 'After Meal',
        note: '২য় সপ্তাহ (টেপারিং মাত্রা)',
      },
    ];
    setIsOpen(true);
    updateSteps(initial);
  };

  const handleAddStep = () => {
    const nextStepNum = steps.length + 1;
    const lastStep = steps[steps.length - 1];
    const newStep: TaperingStep = {
      step: nextStepNum,
      schedule: lastStep?.schedule || '0+0+1',
      duration: lastStep?.duration || '7 Days',
      meal_timing: lastStep?.meal_timing || item.meal_timing || 'After Meal',
      note: `${toBengaliNumerals(nextStepNum)}ম ধাপ`,
    };
    updateSteps([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    const filtered = steps.filter((_, i) => i !== index);
    const reindexed = filtered.map((st, i) => ({ ...st, step: i + 1 }));
    updateSteps(reindexed);
    if (reindexed.length === 0) setIsOpen(false);
  };

  const handleStepFieldChange = (
    index: number,
    field: keyof TaperingStep,
    val: string
  ) => {
    const updated = steps.map((st, i) => {
      if (i !== index) return st;
      return { ...st, [field]: val };
    });
    updateSteps(updated);
  };

  // Presets
  const applyStepDownPreset = () => {
    updateSteps([
      { step: 1, schedule: '2+0+2', duration: '7 Days', meal_timing: item.meal_timing, note: '১ম সপ্তাহ (উচ্চ মাত্রা)' },
      { step: 2, schedule: '1+0+1', duration: '7 Days', meal_timing: item.meal_timing, note: '২য় সপ্তাহ (মাঝারি মাত্রা)' },
      { step: 3, schedule: '0+0+1', duration: '7 Days', meal_timing: item.meal_timing, note: '৩য় সপ্তাহ (সর্বনিম্ন মাত্রা)' },
    ]);
  };

  const applyStepUpPreset = () => {
    updateSteps([
      { step: 1, schedule: '0+0+0.5', duration: '7 Days', meal_timing: item.meal_timing, note: '১ম সপ্তাহ (কম মাত্রা দিয়ে শুরু)' },
      { step: 2, schedule: '0+0+1', duration: '14 Days', meal_timing: item.meal_timing, note: 'পরবর্তী সপ্তাহগুলোতে নিয়মিত' },
    ]);
  };

  const applySteroidPreset = () => {
    updateSteps([
      { step: 1, schedule: '4+0+0', duration: '5 Days', meal_timing: 'After Meal', note: '১ম ৫ দিন (২০মিগ্রা)' },
      { step: 2, schedule: '2+0+0', duration: '5 Days', meal_timing: 'After Meal', note: 'পরবর্তী ৫ দিন (১০মিগ্রা)' },
      { step: 3, schedule: '1+0+0', duration: '5 Days', meal_timing: 'After Meal', note: 'শেষ ৫ দিন (৫মিগ্রা)' },
    ]);
  };

  const handleClearTapering = () => {
    updateSteps([]);
    setIsOpen(false);
  };

  if (!isOpen && steps.length === 0) {
    return (
      <div className="mt-2 flex items-center">
        <button
          type="button"
          onClick={handleEnableTapering}
          className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          title="ডোজ যদি বাড়ানো বা কমানো লাগে (যেমন ১ম সপ্তাহে হাই ডোজ, ২য় সপ্তাহে লো ডোজ)"
        >
          <Layers className="h-3.5 w-3.5 text-amber-700" />
          + টেপারিং / স্টেপ ডোজ যুক্ত করুন (High/Low Dose Tapering)
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2.5 rounded-xl border border-amber-300 bg-amber-50/50 p-3 space-y-2.5 text-slate-800 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-700" />
          <span className="text-xs font-bold text-amber-950">
            টেপারিং ডোজ শিডিউল (ডোজ বাড়ানো বা কমানোর ধাপসমূহ)
          </span>
          <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.2 rounded">
            {steps.length}টি ধাপ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearTapering}
            className="text-[10px] text-rose-600 hover:text-rose-800 flex items-center gap-0.5 font-semibold"
          >
            <Trash2 className="h-3 w-3" /> সাধারণ ডোজে ফিরুন
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className="font-bold text-amber-900">কুইক প্রিসেট:</span>
        <button
          type="button"
          onClick={applyStepDownPreset}
          className="px-2 py-0.5 rounded bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold flex items-center gap-1"
        >
          <ArrowDownRight className="h-3 w-3 text-rose-600" /> হাই ডোজ ➔ লো ডোজ টেপারিং
        </button>
        <button
          type="button"
          onClick={applyStepUpPreset}
          className="px-2 py-0.5 rounded bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold flex items-center gap-1"
        >
          <ArrowUpRight className="h-3 w-3 text-emerald-600" /> লো ডোজ ➔ হাই ডোজ (টাইট্রেশন)
        </button>
        <button
          type="button"
          onClick={applySteroidPreset}
          className="px-2 py-0.5 rounded bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3 text-amber-600" /> স্টেরয়েড টেপারিং
        </button>
      </div>

      {/* Step Rows */}
      <div className="space-y-2">
        {steps.map((st, idx) => (
          <div
            key={idx}
            className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-lg border border-amber-200 text-xs shadow-2xs"
          >
            <span className="font-bold text-amber-900 text-[11px] shrink-0 w-16">
              ধাপ {toBengaliNumerals(idx + 1)}:
            </span>

            <div className="flex items-center gap-1">
              <label className="text-[10px] text-slate-500 font-medium">ডোজ:</label>
              <input
                value={st.schedule}
                onChange={(e) => handleStepFieldChange(idx, 'schedule', e.target.value)}
                placeholder="2+0+2"
                className="h-7 w-20 rounded border border-slate-300 px-1.5 font-mono font-bold text-amber-950 text-xs outline-none focus:border-amber-600 text-center"
              />
            </div>

            <div className="flex items-center gap-1">
              <label className="text-[10px] text-slate-500 font-medium">সময়কাল:</label>
              <input
                value={st.duration}
                onChange={(e) => handleStepFieldChange(idx, 'duration', e.target.value)}
                placeholder="7 Days"
                className="h-7 w-20 rounded border border-slate-300 px-1.5 font-mono text-xs outline-none focus:border-amber-600 text-center"
              />
            </div>

            <div className="flex items-center gap-1">
              <label className="text-[10px] text-slate-500 font-medium">খাবার:</label>
              <select
                value={st.meal_timing || item.meal_timing}
                onChange={(e) => handleStepFieldChange(idx, 'meal_timing', e.target.value)}
                className="h-7 rounded border border-slate-300 px-1 text-[11px] outline-none"
              >
                {MEAL_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 flex-1 min-w-28">
              <input
                value={st.note || ''}
                onChange={(e) => handleStepFieldChange(idx, 'note', e.target.value)}
                placeholder="নোট (যেমন: ১ম সপ্তাহে, ২য় সপ্তাহে)"
                className="h-7 w-full rounded border border-slate-300 px-1.5 text-[11px] outline-none placeholder:text-slate-400"
              />
            </div>

            {steps.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveStep(idx)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title="এই ধাপটি মুছুন"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer & Add Next Step */}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddStep}
          className="h-7 text-[11px] font-bold border-amber-300 text-amber-900 bg-white hover:bg-amber-100 gap-1"
        >
          <Plus className="h-3 w-3 text-amber-700" />
          + পরবর্তী ধাপ যোগ করুন (Add Step {steps.length + 1})
        </Button>

        <span className="text-[10px] text-amber-800 font-medium">
          প্রেসক্রিপশনে প্রতিটি ধাপ ধারাবাহিকভাবে মুদ্রিত হবে।
        </span>
      </div>
    </div>
  );
}
