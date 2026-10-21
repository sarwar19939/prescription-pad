'use client';

/**
 * MedEx Patient Drug Administration Guideline Card & Popover.
 * Shows verified MedEx and clinical instructions in natural Bangla:
 * "কখন খেতে হয়, কীভাবে খেতে হয়" and enables 1-click instruction insertion.
 */
import { useState } from 'react';
import { BookOpen, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { getDrugGuideline } from '@/services/drugGuidelinesService';
import type { MealTiming, PrescriptionItem } from '@/types/schema';
import { Button } from '@/components/ui/button';

interface MedExGuidelineCardProps {
  item: PrescriptionItem;
  onApplyInstruction: (instruction: string) => void;
  onApplyScheduleAndMeal?: (schedule: string, mealTiming: MealTiming) => void;
}

export function MedExGuidelineCard({
  item,
  onApplyInstruction,
  onApplyScheduleAndMeal,
}: MedExGuidelineCardProps) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  const guide = getDrugGuideline(item.brand_name || item.generic_name);
  if (!guide) return null;

  const handleInsertInstruction = () => {
    const formatted = `${guide.whenToTake}। ${guide.howToTake}`;
    onApplyInstruction(formatted);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleApplySchedule = () => {
    if (onApplyScheduleAndMeal) {
      onApplyScheduleAndMeal(guide.standardSchedule, guide.standardMealTiming);
    }
  };

  return (
    <div className="mt-2.5 overflow-hidden rounded-xl border border-sky-200/90 bg-sky-50/50 text-slate-800 transition-all">
      {/* Header bar / Toggle */}
      <div className="flex items-center justify-between px-3.5 py-2">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-bold text-sky-900 hover:text-sky-950 transition-colors"
        >
          <BookOpen className="h-4 w-4 text-sky-700 shrink-0" />
          <span>📘 MedEx নির্দেশিকা & রোগী নির্দেশনা (কখন ও কীভাবে খাবেন)</span>
          {open ? (
            <ChevronUp className="h-3.5 w-3.5 text-sky-600" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-sky-600" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleInsertInstruction}
            className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-2xs"
            title="প্রেসক্রিপশনের বিশেষ নির্দেশনায় বাংলায় যোগ করুন"
          >
            {applied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" /> যোগ হয়েছে
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1" /> নির্দেশনায় যোগ করুন
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Clinical & Patient Guide Body */}
      {open && (
        <div className="border-t border-sky-200/80 bg-white/95 px-3.5 py-3 text-xs leading-relaxed space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <div>
              <span className="font-bold text-sky-900">🎯 রোগের কারণ / নির্দেশনা:</span>{' '}
              {guide.indication}
            </div>
            <div>
              <span className="font-bold text-sky-900">⏰ কখন খাবেন:</span>{' '}
              <span className="font-semibold text-slate-900">{guide.whenToTake}</span>
            </div>
            <div>
              <span className="font-bold text-sky-900">💧 কীভাবে খাবেন:</span>{' '}
              {guide.howToTake}
            </div>
            <div>
              <span className="font-bold text-rose-800">⚠️ রোগীর বিশেষ সতর্কতা:</span>{' '}
              {guide.specialAdvice}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-500">
              প্রস্তাবিত শিডিউল: <strong className="font-mono text-slate-800">{guide.standardSchedule}</strong> ({guide.standardMealTiming})
            </span>
            {onApplyScheduleAndMeal && (
              <button
                type="button"
                onClick={handleApplySchedule}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 underline ml-auto"
              >
                প্রস্তাবিত সময় ও নিয়ম সেটিংসে প্রয়োগ করুন
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
