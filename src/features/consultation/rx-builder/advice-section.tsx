'use client';

/**
 * General advice & follow-up: quick-advice checkboxes toggled into the
 * encounter's advice array, free-text additions, and a follow-up date that
 * is written to Dexie on change.
 */
import { db } from '@/db/localDb';
import { TagInput } from '@/components/tag-input';
import type { Encounter } from '@/types/schema';

const QUICK_ADVICE = [
  'Drink plenty of warm water',
  'Avoid oily/spicy food',
  'Monitor BP daily',
  'Take plenty of rest',
  'Avoid cold drinks/ice cream',
  'Complete the full course of medicines',
];

export function AdviceSection({ encounter }: { encounter: Encounter }) {
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

  const toggleAdvice = (advice: string) => {
    const has = encounter.advice.includes(advice);
    write({
      advice: has
        ? encounter.advice.filter((a) => a !== advice)
        : [...encounter.advice, advice],
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
          General Advice
        </span>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 mb-3">
          {QUICK_ADVICE.map((advice) => (
            <label key={advice} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-teal-600 cursor-pointer"
                checked={encounter.advice.includes(advice)}
                onChange={() => toggleAdvice(advice)}
              />
              {advice}
            </label>
          ))}
        </div>
        <div>
          <TagInput
            value={encounter.advice.filter((a) => !QUICK_ADVICE.includes(a))}
            onChange={(custom) =>
              write({
                advice: [
                  ...encounter.advice.filter((a) => QUICK_ADVICE.includes(a)),
                  ...custom,
                ],
              })
            }
            placeholder="Custom advice + Enter…"
          />
        </div>
      </div>

      <div className="flex items-end gap-4 pt-1">
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
          Next Follow-up Date
          <input
            type="date"
            className="h-11 w-52 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 transition-all"
            value={encounter.follow_up_date ?? ''}
            onChange={(e) =>
              write(
                { follow_up_date: e.target.value ? e.target.value : null },
                true,
              )
            }
          />
        </label>
      </div>
    </section>
  );
}
