'use client';

/**
 * One prescription line: medicine identity + editable schedule/timing/duration.
 * High-legibility clinical typography: text-lg medicine titles, spacious inputs,
 * MedEx patient instructions card, and high-contrast allergy warning banners.
 */
import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Sparkles, Trash2, WandSparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { calculateSmartDose } from '@/services/dosingEngine';
import { checkMedicineWithCatalog, type SafetyWarning } from './safety';
import { SafetyBanners } from './safety-banners';
import { parseShorthand } from './shorthand';
import { MedExGuidelineCard } from './medex-guideline-card';
import type { MealTiming, Patient, PrescriptionItem, Vitals } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MEAL_OPTIONS: MealTiming[] = ['After Meal', 'Before Meal', 'With Meal', 'Anytime'];
const FORM_OPTIONS = ['Tab', 'Cap', 'Syr', 'Inj', 'Oint', 'Drop'] as const;

function useDebouncedField(item: PrescriptionItem, field: 'strength' | 'special_instructions', delay = 400) {
  const [value, setValue] = useState(item[field]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setValue(item[field]);
  }, [item[field]]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const onChange = (next: string) => {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void db.prescription_items.update(item.id, {
        [field]: next,
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      });
    }, delay);
  };
  return [value, onChange, value !== item[field]] as const;
}

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

  const [strength, setStrength, strengthDirty] = useDebouncedField(item, 'strength');
  const [instructions, setInstructions, instructionsDirty] = useDebouncedField(
    item,
    'special_instructions',
  );
  const [cmd, setCmd] = useState('');

  // AI & Clinical Rule Dosage Evaluation based on live vitals, age & weight
  const smartDose = calculateSmartDose(item, patient, vitals);
  const hasDiscrepancy =
    smartDose.hasAdjustment &&
    (smartDose.schedule !== item.schedule ||
      smartDose.meal_timing !== item.meal_timing ||
      (smartDose.strength && smartDose.strength !== item.strength) ||
      (smartDose.dosage_form && smartDose.dosage_form !== item.dosage_form));

  const applySmartDose = () => {
    if (!smartDose.hasAdjustment) return;
    const patch: Partial<PrescriptionItem> = {};
    if (smartDose.dosage_form) patch.dosage_form = smartDose.dosage_form;
    if (smartDose.strength) {
      patch.strength = smartDose.strength;
      setStrength(smartDose.strength);
    }
    if (smartDose.schedule) patch.schedule = smartDose.schedule;
    if (smartDose.meal_timing) patch.meal_timing = smartDose.meal_timing;
    if (smartDose.duration) patch.duration = smartDose.duration;
    if (smartDose.special_instructions) {
      patch.special_instructions = smartDose.special_instructions;
      setInstructions(smartDose.special_instructions);
    }
    write(patch);
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

  const write = (patch: Partial<PrescriptionItem>) => {
    void db.prescription_items.update(item.id, {
      ...patch,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  const cell =
    'h-11 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 transition-all';

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all hover:border-slate-300">
      {/* Title Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-base font-bold text-slate-400">{index + 1}.</span>
          <span className="text-lg font-bold text-slate-950 tracking-tight">
            {item.dosage_form}. {item.brand_name}
          </span>
          {(strengthDirty || instructionsDirty) && (
            <span title="autosaving..." className="text-xs text-amber-500 animate-pulse font-medium">
              ● saving
            </span>
          )}
          <span className="text-sm font-medium text-slate-500 italic">
            ({item.generic_name})
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          aria-label={`Remove ${item.brand_name}`}
          className="h-9 w-9 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      {/* AI Smart Dose Recommendation Banner */}
      {hasDiscrepancy && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-teal-200 bg-teal-50/80 px-3.5 py-2.5 text-sm shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600 shrink-0" />
            <span className="font-bold text-teal-950">AI Dose Recommendation ({smartDose.badge}):</span>
            <span className="text-teal-800 text-xs font-semibold">{smartDose.reason}</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={applySmartDose}
            className="h-8 px-3 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Apply Smart Dose
          </Button>
        </div>
      )}

      {/* Inputs Grid */}
      <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Form
          <select
            className={cell}
            value={item.dosage_form}
            onChange={(e) => write({ dosage_form: e.target.value as PrescriptionItem['dosage_form'] })}
          >
            {FORM_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Strength
          <input
            className={`${cell} font-mono`}
            placeholder="500mg"
            value={strength}
            onChange={(e) => setStrength(e.target.value)}
          />
        </label>

        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Schedule (Dose)
          <input
            className={`${cell} font-mono font-bold text-teal-800`}
            placeholder="1+0+1"
            value={item.schedule}
            onChange={(e) => write({ schedule: e.target.value })}
          />
        </label>

        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Meal Timing
          <select
            className={cell}
            value={item.meal_timing}
            onChange={(e) => write({ meal_timing: e.target.value as MealTiming })}
          >
            {MEAL_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Duration
          <input
            className={`${cell} font-mono`}
            placeholder="7 Days"
            value={item.duration}
            onChange={(e) => write({ duration: e.target.value })}
          />
        </label>

        <label className="col-span-2 sm:col-span-3 grid gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Special Instructions
          <input
            className={cell}
            placeholder="e.g. After food with a full glass of water..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>
      </div>

      {/* Shorthand quick-command bar & Auto-Adjust Button */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="h-9 shrink-0 gap-1.5 border-teal-200 bg-teal-50 px-3 text-xs font-semibold text-teal-800">
          <WandSparkles className="h-3.5 w-3.5 text-teal-600" aria-hidden /> Quick Shorthand
        </Badge>
        <input
          className="h-10 min-w-44 flex-1 rounded-xl border border-teal-200 bg-teal-50/40 px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:text-slate-400"
          placeholder='Type shorthand like "1+0+1 pc 7d" or "bd pc 14d" and press Enter...'
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void applyCommand();
            }
          }}
        />
        {smartDose.hasAdjustment && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={applySmartDose}
            className="h-10 rounded-xl border-teal-300 text-teal-800 hover:bg-teal-50 text-xs font-semibold shrink-0 gap-1.5"
            title="Auto-adjust dosage based on patient vitals, weight & age"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-600" /> Auto-Adjust Dose
          </Button>
        )}
      </div>

      {/* MedEx Patient Drug Administration Guideline Card */}
      <MedExGuidelineCard
        item={item}
        onApplyInstruction={(inst) => {
          setInstructions(inst);
          write({ special_instructions: inst });
        }}
        onApplyScheduleAndMeal={(sched, meal) => {
          write({ schedule: sched, meal_timing: meal });
        }}
      />

      {/* Safety Warnings with High-Contrast Alerts */}
      <SafetyBanners warnings={warnings} />
    </div>
  );
}
