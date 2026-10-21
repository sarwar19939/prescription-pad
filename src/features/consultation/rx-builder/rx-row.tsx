'use client';

/**
 * One prescription line: medicine identity + editable schedule/timing/duration.
 * High-legibility clinical typography: text-lg medicine titles, spacious inputs,
 * and high-contrast allergy warning banners.
 */
import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2, TriangleAlert, WandSparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { checkMedicineWithCatalog, type SafetyWarning } from './safety';
import { parseShorthand } from './shorthand';
import type { MealTiming, Patient, PrescriptionItem } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MEAL_OPTIONS: MealTiming[] = ['After Meal', 'Before Meal', 'With Meal', 'Anytime'];
const FORM_OPTIONS = ['Tab', 'Cap', 'Syr', 'Inj', 'Oint', 'Drop'] as const;

function useDebouncedField(item: PrescriptionItem, field: 'strength' | 'special_instructions', delay = 400) {
  const [value, setValue] = useState(item[field]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
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
  index,
  onRemove,
}: {
  item: PrescriptionItem;
  patient: Patient;
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
      {/* Title Bar: Medicine name in text-lg font-semibold */}
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

      {/* Inputs Grid: Form, Strength, Schedule, Meal Timing, Duration */}
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

      {/* Shorthand quick-command bar */}
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="outline" className="h-8 shrink-0 gap-1.5 border-teal-200 bg-teal-50 px-2.5 text-xs font-semibold text-teal-800">
          <WandSparkles className="h-3.5 w-3.5 text-teal-600" aria-hidden /> Quick Shorthand
        </Badge>
        <input
          className="h-10 min-w-0 flex-1 rounded-xl border border-teal-200 bg-teal-50/40 px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:text-slate-400"
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
      </div>

      {/* Safety Warnings with High-Contrast Alerts */}
      {warnings.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className={
                'flex items-start gap-2.5 rounded-xl border p-3 text-sm font-semibold ' +
                (w.severity === 'red'
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : 'border-amber-200 bg-amber-50 text-amber-900')
              }
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
