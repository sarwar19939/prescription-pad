'use client';

/**
 * SuggestedMedsSection — AI Prescription Suggestions with Doctor Permission.
 * Allows doctor to check/uncheck individual medicines (টিক চিহ্ন) and add
 * individual items or all checked medicines at once to the active prescription.
 */
import { useEffect, useState } from 'react';
import { Check, CheckSquare, Loader2, PlusCircle, Square } from 'lucide-react';
import type { SuggestedMedication } from '@/services/aiClinicalCopilot';
import { Button } from '@/components/ui/button';

interface SuggestedMedsSectionProps {
  medications: SuggestedMedication[];
  addedMeds: Set<string>;
  onAddToRx: (med: SuggestedMedication) => void;
  onAddSelectedMeds?: (meds: SuggestedMedication[]) => Promise<void>;
}

export function SuggestedMedsSection({
  medications = [],
  addedMeds,
  onAddToRx,
  onAddSelectedMeds,
}: SuggestedMedsSectionProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    medications.forEach((_, i) => initial.add(i));
    return initial;
  });
  const [bulkAdding, setBulkAdding] = useState(false);

  useEffect(() => {
    const initial = new Set<number>();
    medications.forEach((_, i) => initial.add(i));
    setSelectedIndices(initial);
  }, [medications]);

  if (medications.length === 0) return null;

  const toggleSelect = (idx: number) => {
    setSelectedIndices((prev) => {
      const copy = new Set(prev);
      if (copy.has(idx)) copy.delete(idx);
      else copy.add(idx);
      return copy;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIndices.size === medications.length) {
      setSelectedIndices(new Set());
    } else {
      const all = new Set<number>();
      medications.forEach((_, i) => all.add(i));
      setSelectedIndices(all);
    }
  };

  const handleBulkAdd = async () => {
    if (!onAddSelectedMeds) return;
    const selected = medications.filter((_, i) => selectedIndices.has(i));
    if (selected.length === 0) return;
    setBulkAdding(true);
    try {
      await onAddSelectedMeds(selected);
    } finally {
      setBulkAdding(false);
    }
  };

  const allSelected = selectedIndices.size === medications.length;

  return (
    <div className="space-y-2.5">
      {/* Header with Doctor Permission Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          সাজেস্টেড সহায়ক ঔষধ তালিকা ({selectedIndices.size}/{medications.length}টি নির্বাচিত)
        </span>

        <button
          type="button"
          onClick={toggleSelectAll}
          className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:text-teal-950 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
        >
          {allSelected ? <CheckSquare className="h-3.5 w-3.5 text-teal-700" /> : <Square className="h-3.5 w-3.5 text-slate-400" />}
          {allSelected ? 'সব টিক তোলা' : 'সব টিক দিন'}
        </button>
      </div>

      {/* Bulk Add Button */}
      {onAddSelectedMeds && selectedIndices.size > 0 && (
        <Button
          type="button"
          onClick={handleBulkAdd}
          disabled={bulkAdding}
          className="w-full h-9 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
        >
          {bulkAdding ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <CheckSquare className="h-3.5 w-3.5 mr-1" />}
          ✓ নির্বাচিত ({selectedIndices.size}টি) ওষুধ প্রেসক্রিপশনে যোগ করুন
        </Button>
      )}

      {/* Medication Cards with Doctor Checkbox */}
      <div className="space-y-2">
        {medications.map((med, i) => {
          const added = addedMeds.has(med.generic_name);
          const isSelected = selectedIndices.has(i);

          return (
            <div
              key={i}
              className={`rounded-xl border p-3 shadow-2xs transition-all ${
                isSelected
                  ? 'border-teal-300 bg-teal-50/20'
                  : 'border-slate-200 bg-white opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(i)}
                    className="h-4 w-4 rounded accent-teal-600 cursor-pointer mt-0.5 shrink-0"
                    title="প্রেসক্রিপশনে যোগ করার জন্য টিক দিন"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-950">
                      {med.suggested_brand ? `${med.suggested_brand} (${med.generic_name})` : med.generic_name}
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-600 mt-0.5">
                      {med.strength} · {med.schedule} · {med.duration}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={added ? 'secondary' : 'default'}
                  onClick={() => onAddToRx(med)}
                  disabled={added}
                  className={
                    added
                      ? 'h-8 px-2.5 text-xs bg-teal-50 text-teal-800 font-semibold shrink-0'
                      : 'h-8 px-2.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold shrink-0'
                  }
                >
                  {added ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-teal-600" /> যুক্ত হয়েছে
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-3.5 w-3.5 mr-1" /> ১-ক্লিক যোগ
                    </>
                  )}
                </Button>
              </div>

              {med.rationale && (
                <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed ml-6">
                  <strong className="text-slate-800 font-semibold">কারণ: </strong>
                  {med.rationale}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
