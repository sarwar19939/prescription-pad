'use client';

/**
 * HistoryModifierPanel — Interactive Duration & Control Status Picker for Chronic Illnesses.
 * Allows 1-click selection of disease duration (e.g. 5 yrs, 10 yrs) and status
 * (Controlled, On medication, On Insulin) matching standard chamber protocols.
 */
import { useState } from 'react';
import { Check, Clock, ShieldCheck, Trash2, X } from 'lucide-react';

interface HistoryModifierPanelProps {
  conditionName: string;
  existingText?: string;
  onApply: (formattedCondition: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}

const CHRONIC_DURATIONS = [
  { label: '১ বছর ধরে', value: 'for 1 yr' },
  { label: '২ বছর ধরে', value: 'for 2 yrs' },
  { label: '৩ বছর ধরে', value: 'for 3 yrs' },
  { label: '৫ বছর ধরে', value: 'for 5 yrs' },
  { label: '৭ বছর ধরে', value: 'for 7 yrs' },
  { label: '১০ বছর ধরে', value: 'for 10 yrs' },
  { label: '১৫ বছর ধরে', value: 'for 15 yrs' },
  { label: 'শৈশব থেকে', value: 'since childhood' },
];

const CHRONIC_STATUSES = [
  { label: 'নিয়ন্ত্রণে (Controlled)', value: 'Controlled' },
  { label: 'অনিয়ন্ত্রিত (Uncontrolled)', value: 'Uncontrolled' },
  { label: 'নিয়মিত ওষুধে (On medication)', value: 'On regular medication' },
  { label: 'ইনসুলিন চলছে (On Insulin)', value: 'On Insulin' },
  { label: 'খাদ্যাভ্যাসে নিয়ন্ত্রিত', value: 'Diet controlled' },
];

export function HistoryModifierPanel({
  conditionName,
  existingText = '',
  onApply,
  onRemove,
  onClose,
}: HistoryModifierPanelProps) {
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const buildResult = (dur = selectedDuration, stat = selectedStatus) => {
    let out = conditionName.split(/[-:(]/)[0].trim();
    const parts: string[] = [];
    if (dur) parts.push(dur);
    if (stat) parts.push(stat);
    if (parts.length > 0) {
      out += ` (${parts.join(', ')})`;
    }
    return out;
  };

  const handleDurationClick = (val: string) => {
    const next = selectedDuration === val ? '' : val;
    setSelectedDuration(next);
    onApply(buildResult(next, selectedStatus));
  };

  const handleStatusClick = (val: string) => {
    const next = selectedStatus === val ? '' : val;
    setSelectedStatus(next);
    onApply(buildResult(selectedDuration, next));
  };

  const currentPreview = buildResult();

  return (
    <div className="rounded-xl border-2 border-teal-500 bg-white shadow-md p-2.5 space-y-2 text-slate-800 animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-teal-100 pb-1">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-teal-600" />
          <span className="font-bold text-xs text-teal-900">
            {conditionName} — সময়কাল ও বর্তমান অবস্থা
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          title="বন্ধ করুন"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Duration Options */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
          কত বছর ধরে (Duration):
        </span>
        <div className="flex flex-wrap gap-1">
          {CHRONIC_DURATIONS.map((d) => {
            const active = selectedDuration === d.value;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => handleDurationClick(d.value)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  active
                    ? 'bg-teal-700 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Options */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
          বর্তমান অবস্থা / নিয়ন্ত্রণ (Status):
        </span>
        <div className="flex flex-wrap gap-1">
          {CHRONIC_STATUSES.map((s) => {
            const active = selectedStatus === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => handleStatusClick(s.value)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  active
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview and Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200 gap-2 flex-wrap">
        <div className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 truncate">
          প্রিভিউ: <span className="font-mono text-teal-700">{currentPreview}</span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[10px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 font-semibold"
            >
              <Trash2 className="h-3 w-3" />
              বাদ দিন
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onApply(currentPreview);
              onClose();
            }}
            className="text-[10px] bg-teal-700 hover:bg-teal-800 text-white px-2 py-0.5 rounded-md flex items-center gap-1 font-bold shadow-xs"
          >
            <Check className="h-3 w-3" />
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
}
