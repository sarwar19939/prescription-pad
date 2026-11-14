'use client';

/**
 * One prescription line: Trade Name & Strength, with clean shorthand dose line below.
 * Strictly adheres to doctor's request:
 * - Trade Name + Strength on top
 * - Shorthand (e.g. ১+০+১ খাবার পূর্বে/পরে — ৭ দিন) directly below
 * - Zero unnecessary visual clutter or bloated forms
 */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2 } from 'lucide-react';

import { db } from '@/db/localDb';
import { cleanBrandName, formatSubcontinentSchedule, normalizeDosageForm, toBengaliNumerals } from '@/lib/prescriptionFormatters';
import { checkMedicineWithCatalog, type SafetyWarning } from './safety';
import { SafetyBanners } from './safety-banners';
import { parseShorthand } from './shorthand';
import { TaperingDosePanel } from './tapering-dose-panel';
import type { MealTiming, Patient, PrescriptionItem, Vitals } from '@/types/schema';
import { Button } from '@/components/ui/button';

const MEAL_OPTIONS: Array<{ value: MealTiming; label: string }> = [
  { value: 'Before Meal', label: 'খাবারের পূর্বে (খালি পেটে)' },
  { value: 'After Meal', label: 'খাবারের পরে (ভরা পেটে)' },
  { value: 'With Meal', label: 'খাবারের সাথে' },
  { value: 'Anytime', label: 'যেকোনো সময়' },
];

export function RxRow({
  item,
  patient,
  vitals,
  index,
  onRemove,
}: {
  item: PrescriptionItem;
  patient: Patient;
  vitals?: Partial<Vitals> | null;
  index: number;
  onRemove: (id: string) => void;
}) {
  const catalogEntry = useLiveQuery(
    async () => {
      const all = await db.medicine_catalog.where('brand_name').equals(item.brand_name).toArray();
      return all.find((m) => m.strength === item.strength) ?? all[0];
    },
    [item.brand_name, item.strength],
  );
  const warnings: SafetyWarning[] = checkMedicineWithCatalog(item, patient, catalogEntry);

  const [cmd, setCmd] = useState('');
  const [showTapering, setShowTapering] = useState(
    Boolean(item.tapering_steps && item.tapering_steps.length > 0)
  );

  const write = (patch: Partial<PrescriptionItem>) => {
    void db.prescription_items.update(item.id, {
      ...patch,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  const applyCommand = async () => {
    if (!cmd.trim()) return;
    const parsed = parseShorthand(cmd);
    const patch: Partial<PrescriptionItem> = {};
    if (parsed.schedule) patch.schedule = parsed.schedule;
    if (parsed.meal_timing) patch.meal_timing = parsed.meal_timing;
    if (parsed.duration) patch.duration = parsed.duration;
    if (Object.keys(patch).length > 0) {
      await db.prescription_items.update(item.id, {
        ...patch,
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      });
      setCmd('');
    }
  };

  const cleanForm = normalizeDosageForm(item.dosage_form);
  const cleanBrand = cleanBrandName(item.brand_name) || item.brand_name;
  const hasStrengthInBrand = item.strength && cleanBrand.toLowerCase().includes(item.strength.toLowerCase());
  const displayTitle = `${cleanForm}. ${cleanBrand}${
    item.strength && !hasStrengthInBrand ? ` ${item.strength}` : ''
  }`.trim();

  // Auto-sanitize legacy records with duplicate form prefixes (e.g. "Tablet. Tab. Bisocor")
  useEffect(() => {
    const fixedForm = normalizeDosageForm(item.dosage_form);
    const fixedBrand = cleanBrandName(item.brand_name);
    if (fixedForm !== item.dosage_form || (fixedBrand && fixedBrand !== item.brand_name)) {
      void db.prescription_items.update(item.id, {
        dosage_form: fixedForm,
        brand_name: fixedBrand || item.brand_name,
        updated_at: new Date().toISOString(),
      });
    }
  }, [item.id, item.dosage_form, item.brand_name]);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300">
      {/* 1. Trade Name & Strength (ট্রেড নেম ও স্ট্রেন্থ) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-slate-400">
            {toBengaliNumerals(index + 1)}.
          </span>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            {displayTitle}
          </span>
          {item.tapering_steps && item.tapering_steps.length > 0 && (
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
              {item.tapering_steps.length} ধাপের টেপারিং
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          aria-label={`Remove ${item.brand_name}`}
          className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      {/* 2. Below: Shorthand Dose Controls (নিচে শর্টহ্যান্ড: যেমন ১+০+১ খাবার পূর্বে/পরে) */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Bengali Shorthand Badge */}
        <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md text-xs">
          {formatSubcontinentSchedule(item.schedule) || '১ + ০ + ১'}
        </span>

        {/* Schedule (Dose: 1+0+1) */}
        <input
          className="h-8 w-20 rounded-lg border border-slate-300 px-2 text-center font-mono font-bold text-teal-900 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
          placeholder="1+0+1"
          value={item.schedule}
          onChange={(e) => write({ schedule: e.target.value })}
          title="শিডিউল (যেমন: 1+0+1, 1+1+1)"
        />

        {/* Meal timing select */}
        <select
          className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
          value={item.meal_timing}
          onChange={(e) => write({ meal_timing: e.target.value as MealTiming })}
        >
          {MEAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Duration input */}
        <input
          className="h-8 w-24 rounded-lg border border-slate-300 px-2 text-center font-medium text-slate-800 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
          placeholder="7 Days"
          value={item.duration}
          onChange={(e) => write({ duration: e.target.value })}
          title="মেয়াদ (যেমন: 7 Days, 14 Days)"
        />

        {/* Quick Shorthand input: type "1+0+1 pc 7d" or "bd" */}
        <div className="flex items-center gap-1 flex-1 min-w-[170px]">
          <input
            className="h-8 w-full rounded-lg border border-teal-200 bg-teal-50/30 px-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-600 focus:bg-white"
            placeholder='শর্টহ্যান্ড (যেমন: "bd pc 14d" বা "1+0+1")'
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void applyCommand();
              }
            }}
          />
        </div>

        {/* Tapering toggle */}
        <button
          type="button"
          onClick={() => setShowTapering(!showTapering)}
          className="text-[11px] font-medium text-slate-500 hover:text-teal-700 underline px-1"
        >
          {showTapering ? 'ট্যাপারিং বন্ধ' : '+ ট্যাপারিং'}
        </button>
      </div>

      {/* Tapering panel if active */}
      {showTapering && (
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <TaperingDosePanel item={item} onSaveSteps={(steps) => write({ tapering_steps: steps })} />
        </div>
      )}

      {/* Safety warnings (if allergic or contraindication) */}
      <SafetyBanners warnings={warnings} />
    </div>
  );
}
