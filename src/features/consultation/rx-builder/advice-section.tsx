'use client';

/**
 * General advice & follow-up: quick-advice presets toggled into the
 * encounter's advice array, free-text additions, and follow-up date picker.
 * Features clinical presets tailored for Bangladesh outpatient practice.
 */
import { db } from '@/db/localDb';
import { TagInput } from '@/components/tag-input';
import type { Encounter } from '@/types/schema';

const QUICK_ADVICE = [
  'পর্যাপ্ত কুসুম গরম পানি পান করুন (Drink plenty of warm water)',
  'তৈলাক্ত, ভাজাপোড়া ও অতিরিক্ত ঝাল খাবার পরিহার করুন (Avoid oily/spicy food)',
  'খাবারে বাড়তি কাঁচা লবণ সম্পূর্ণ বর্জন করুন (Avoid added table salt)',
  'চিনি ও মিষ্টি জাতীয় খাবার এড়িয়ে চলুন (Avoid sugar & sweets)',
  'প্রতিদিন বা সপ্তাহে অন্তত একবার রক্তচাপ মাপুন (Monitor BP regularly)',
  'ডাক্তারের পরামর্শ ছাড়া কোনো ওষুধ হঠাৎ বন্ধ করবেন না (Do not stop meds abruptly)',
  'অ্যান্টিবায়োটিকের সম্পূর্ণ কোর্স শেষ করুন (Complete full antibiotic course)',
  'পর্যাপ্ত বিশ্রাম নিন ও দুশ্চিন্তামুক্ত থাকুন (Adequate rest & sleep)',
  'ডেঙ্গু সতর্কতা: তীব্র পেট ব্যথা, অতিরিক্ত বমি বা রক্তক্ষরণ হলে দ্রুত হাসপাতালে আসুন',
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

  const currentAdvice = encounter.advice || [];

  const toggleAdvice = (advice: string) => {
    const has = currentAdvice.includes(advice);
    write({
      advice: has
        ? currentAdvice.filter((a) => a !== advice)
        : [...currentAdvice, advice],
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <span className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
          রোগীর পরামর্শ ও জীবনযাত্রা নির্দেশিকা (Clinical Advice)
        </span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-3">
          {QUICK_ADVICE.map((advice) => (
            <label
              key={advice}
              className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200/70 bg-slate-50/60 p-2 text-xs font-medium text-slate-800 hover:bg-teal-50/60 hover:border-teal-200 transition-colors"
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-teal-600 cursor-pointer"
                checked={currentAdvice.includes(advice)}
                onChange={() => toggleAdvice(advice)}
              />
              <span>{advice}</span>
            </label>
          ))}
        </div>
        <div>
          <TagInput
            value={currentAdvice.filter((a) => !QUICK_ADVICE.includes(a))}
            onChange={(custom) =>
              write({
                advice: [
                  ...currentAdvice.filter((a) => QUICK_ADVICE.includes(a)),
                  ...custom,
                ],
              })
            }
            placeholder="Custom advice in Bangla or English + Enter…"
          />
        </div>
      </div>

      <div className="flex items-end gap-4 pt-1">
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          পরবর্তী সাক্ষাতের তারিখ (Next Follow-up Date)
          <input
            type="date"
            className="h-11 w-56 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 transition-all"
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
