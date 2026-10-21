'use client';

/**
 * One prescription line: medicine identity + editable schedule/timing/
 * duration + real-time allergy warnings. Text edits autosave to Dexie
 * (debounced); selects write immediately. All writes are local-first with
 * sync_status: 'pending'.
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

/** Debounce text-field writes so 0ms storage isn't spammed per keystroke. */
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

function WriteDot(unsaved: boolean) {
  return unsaved ? <span title="autosaving…" className="text-[9px] text-amber-500">●</span> : null;
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

  const cell = 'w-full rounded border border-neutral-300 px-1.5 py-1 text-xs outline-none focus:border-emerald-600';

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-2.5">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold text-neutral-800">{index + 1}.</span>
        <span className="font-medium">
          {item.dosage_form}. {item.brand_name}
        </span>
        {WriteDot(strengthDirty || instructionsDirty)}
        <span className="normal-case italic text-xs text-neutral-500">{item.generic_name}</span>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Remove ${item.brand_name}`}
          className="ml-auto h-6 w-6 p-0 text-neutral-400 hover:text-red-600"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <label className="grid gap-0.5 text-[10px] text-neutral-500">
          Form
          <select className={cell} value={item.dosage_form} onChange={(e) => write({ dosage_form: e.target.value as PrescriptionItem['dosage_form'] })}>
            {FORM_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-0.5 text-[10px] text-neutral-500">
          Strength
          <input className={cell} placeholder="650mg" value={strength} onChange={(e) => setStrength(e.target.value)} />
        </label>
        <label className="grid gap-0.5 text-[10px] text-neutral-500">
          Schedule
          <input className={cell} placeholder="1+0+1" value={item.schedule} onChange={(e) => write({ schedule: e.target.value })} />
        </label>
        <label className="grid gap-0.5 text-[10px] text-neutral-500">
          Meal Timing
          <select className={cell} value={item.meal_timing} onChange={(e) => write({ meal_timing: e.target.value as MealTiming })}>
            {MEAL_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-0.5 text-[10px] text-neutral-500">
          Duration
          <input className={cell} placeholder="7 Days" value={item.duration} onChange={(e) => write({ duration: e.target.value })} />
        </label>
        <label className="col-span-2 sm:col-span-3 grid gap-0.5 text-[10px] text-neutral-500">
          Special Instructions
          <input className={cell} placeholder="After food, with plenty of water…" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </label>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <Badge variant="outline" className="shrink-0 gap-1 bg-emerald-50 text-[10px] text-emerald-800">
          <WandSparkles className="h-3 w-3" aria-hidden /> shorthand
        </Badge>
        <input
          className="min-w-0 flex-1 rounded border border-emerald-200 bg-emerald-50/50 px-2 py-1 text-xs outline-none focus:border-emerald-600"
          placeholder='e.g. "1+0+1 pc 7d" or "bd pc 7d" — Enter to apply'
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

      {warnings.length > 0 && (
        <div className="mt-1.5 flex flex-col gap-1">
          {warnings.map((w, i) => (
            <div
              key={i}
              className={
                'flex items-start gap-1.5 rounded border px-2 py-1.5 text-xs font-medium ' +
                (w.severity === 'red'
                  ? 'border-red-300 bg-red-100 text-red-800'
                  : 'border-amber-300 bg-amber-100 text-amber-800')
              }
            >
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {w.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
