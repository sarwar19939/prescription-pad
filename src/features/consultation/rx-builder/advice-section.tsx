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
    <section className="flex flex-col gap-3">
      <div>
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          General Advice
        </span>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {QUICK_ADVICE.map((advice) => (
            <label key={advice} className="flex cursor-pointer items-center gap-2 text-xs text-neutral-700">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-emerald-700"
                checked={encounter.advice.includes(advice)}
                onChange={() => toggleAdvice(advice)}
              />
              {advice}
            </label>
          ))}
        </div>
        <div className="mt-1.5">
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

      <div className="flex items-end gap-4">
        <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          Next Follow-up
          <input
            type="date"
            className="w-44 rounded-md border border-neutral-300 px-2 py-1.5 text-xs font-normal normal-case text-neutral-800 outline-none focus:border-emerald-600"
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
