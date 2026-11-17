'use client';

/**
 * LiquidDosingPanel — Dedicated, Crystal-Clear Pediatric & Liquid Dosage Builder.
 * Standardizes Liquid Dosing for Syrups, Suspensions, and Drops:
 * 1. Smart age-based presets (আধা চামচ, ১ চামচ, ১.৫ চামচ, ২ চামচ / ফোঁটা)
 * 2. Precision amount input with decimal support (e.g. 1, 1.25, 1.5, 2.5)
 * 3. Unit selector (চামচ / মি.লি. / ফোঁটা)
 * 4. Frequency selector (দিনে ৩ বার, দিনে ২ বার, দিনে ১ বার, SOS)
 * 5. Meal timing & duration
 */
import { useEffect, useState } from 'react';
import { Droplets, Sparkles, Utensils } from 'lucide-react';
import { toBengaliNumerals } from '@/lib/prescriptionFormatters';
import type { MealTiming, Patient, PrescriptionItem } from '@/types/schema';

export type LiquidUnit = 'চামচ' | 'মি.লি.' | 'ফোঁটা';

export const LIQUID_SPOON_PRESETS = [
  { label: 'আধা চামচ (২.৫ মি.লি.)', amount: '0.5', unit: 'চামচ' as const },
  { label: '১ চামচ (৫ মি.লি.)', amount: '1', unit: 'চামচ' as const },
  { label: '১.৫ চামচ (৭.৫ মি.লি.)', amount: '1.5', unit: 'চামচ' as const },
  { label: '২ চামচ (১০ মি.লি.)', amount: '2', unit: 'চামচ' as const },
];

export const LIQUID_DROP_PRESETS = [
  { label: '৫ ফোঁটা', amount: '5', unit: 'ফোঁটা' as const },
  { label: '১০ ফোঁটা', amount: '10', unit: 'ফোঁটা' as const },
  { label: '১৫ ফোঁটা', amount: '15', unit: 'ফোঁটা' as const },
  { label: '১ মি.লি. (ড্রপার)', amount: '1', unit: 'মি.লি.' as const },
];

export const LIQUID_FREQUENCIES = [
  { label: 'দিনে ৩ বার (৮ ঘণ্টা পর পর)', value: 'দিনে ৩ বার' },
  { label: 'দিনে ২ বার (১২ ঘণ্টা পর পর)', value: 'দিনে ২ বার' },
  { label: 'দিনে ১ বার (রাতে / সকালে)', value: 'দিনে ১ বার' },
  { label: 'দিনে ৪ বার (৬ ঘণ্টা পর পর)', value: 'দিনে ৪ বার' },
  { label: 'জ্বর বা ব্যথায় (প্রয়োজনে SOS)', value: 'প্রয়োজনে (SOS)' },
  { label: 'প্রতি ৬ ঘণ্টা পর পর', value: 'প্রতি ৬ ঘণ্টা পর পর' },
];

export function buildLiquidSchedule(amount: string, unit: LiquidUnit, frequency: string): string {
  const cleanAmt = amount.trim() || '1';
  let displayAmt = toBengaliNumerals(cleanAmt);
  if (cleanAmt === '0.5' && unit === 'চামচ') {
    displayAmt = 'আধা';
  }

  let mlPart = '';
  if (unit === 'চামচ') {
    const num = parseFloat(cleanAmt);
    if (!isNaN(num) && num > 0) {
      const ml = Math.round(num * 5 * 10) / 10;
      mlPart = ` (${toBengaliNumerals(ml)} মি.লি.)`;
    }
  }

  return `${displayAmt} ${unit}${mlPart} করে ${frequency}`.trim();
}

export function parseLiquidSchedule(
  schedule?: string | null,
  isDrop?: boolean,
  patientAge?: number | null,
): { amount: string; unit: LiquidUnit; frequency: string } {
  const s = (schedule || '').trim();

  let detectedAmount = '';
  let detectedUnit: LiquidUnit = isDrop ? 'ফোঁটা' : 'চামচ';
  let detectedFreq = 'দিনে ৩ বার';

  if (s.includes('ফোঁটা')) {
    detectedUnit = 'ফোঁটা';
    const match = s.match(/([০-৯0-9.\-]+)\s*ফোঁটা/);
    if (match) detectedAmount = match[1].replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  } else if (s.includes('মি.লি.') || s.toLowerCase().includes('ml')) {
    detectedUnit = 'মি.লি.';
    const match = s.match(/([০-৯0-9.]+)\s*(মি\.লি\.|ml)/i);
    if (match) detectedAmount = match[1].replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  } else if (s.includes('চামচ')) {
    detectedUnit = 'চামচ';
    if (s.includes('আধা') || s.includes('১/২') || s.includes('০.৫') || s.includes('0.5')) {
      detectedAmount = '0.5';
    } else {
      const match = s.match(/([০-৯0-9.]+)\s*চামচ/);
      if (match) detectedAmount = match[1].replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
    }
  }

  if (s.includes('দিনে ৩ বার') || s.includes('1+1+1') || s.includes('১ + ১ + ১')) {
    detectedFreq = 'দিনে ৩ বার';
  } else if (s.includes('দিনে ২ বার') || s.includes('1+0+1') || s.includes('১ + ০ + ১') || s.includes('1+1')) {
    detectedFreq = 'দিনে ২ বার';
  } else if (s.includes('দিনে ১ বার') || s.includes('1+0+0') || s.includes('0+0+1') || s.includes('১ + ০ + ০') || s.includes('০ + ০ + ১')) {
    detectedFreq = 'দিনে ১ বার';
  } else if (s.includes('দিনে ৪ বার') || s.includes('1+1+1+1')) {
    detectedFreq = 'দিনে ৪ বার';
  } else if (s.includes('SOS') || s.includes('প্রয়োজন')) {
    detectedFreq = 'প্রয়োজনে (SOS)';
  }

  if (!detectedAmount) {
    const age = patientAge ?? 5;
    if (isDrop || age < 1) {
      detectedUnit = 'ফোঁটা';
      detectedAmount = '10';
    } else if (age < 2) {
      detectedUnit = 'চামচ';
      detectedAmount = '0.5';
    } else if (age <= 5) {
      detectedUnit = 'চামচ';
      detectedAmount = '1';
    } else if (age <= 8) {
      detectedUnit = 'চামচ';
      detectedAmount = '1.5';
    } else {
      detectedUnit = 'চামচ';
      detectedAmount = '2';
    }
  }

  return {
    amount: detectedAmount,
    unit: detectedUnit,
    frequency: detectedFreq,
  };
}

export function LiquidDosingPanel({
  item,
  patient,
  onUpdate,
}: {
  item: PrescriptionItem;
  patient: Patient;
  onUpdate: (patch: Partial<PrescriptionItem>) => void;
}) {
  const isDrop = item.dosage_form === 'Drop';
  const parsed = parseLiquidSchedule(item.schedule, isDrop, patient.age);

  const [amount, setAmount] = useState<string>(parsed.amount);
  const [unit, setUnit] = useState<LiquidUnit>(parsed.unit);
  const [frequency, setFrequency] = useState<string>(parsed.frequency);

  // Synchronize initial schedule if empty or old raw 1+1+1
  useEffect(() => {
    const isOldStyle =
      !item.schedule ||
      /^(1\+1\+1|1\+0\+1|1\+0\+0|0\+0\+1|1\+1|1\+1\+1\+1)$/.test(item.schedule.trim()) ||
      item.schedule.includes('SOS');

    if (isOldStyle) {
      const generated = buildLiquidSchedule(parsed.amount, parsed.unit, parsed.frequency);
      if (generated !== item.schedule) {
        onUpdate({
          schedule: generated,
          meal_timing: item.meal_timing || 'After Meal',
          duration: item.duration || '3 Days',
        });
      }
    }
  }, [item.id, item.schedule, parsed.amount, parsed.unit, parsed.frequency]);

  const applyDose = (newAmt: string, newUnit: LiquidUnit, newFreq: string) => {
    setAmount(newAmt);
    setUnit(newUnit);
    setFrequency(newFreq);
    const newSched = buildLiquidSchedule(newAmt, newUnit, newFreq);
    onUpdate({ schedule: newSched });
  };

  const presets = isDrop ? LIQUID_DROP_PRESETS : LIQUID_SPOON_PRESETS;

  return (
    <div className="rounded-xl border border-sky-200/80 bg-sky-50/50 p-2.5 space-y-2 text-xs">
      {/* 1. Quick Presets (৩-৪টি দ্রুত প্রি-সেট অপশন - মাউস দিয়ে ১ ক্লিকে সিলেক্ট) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold text-sky-950 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-sky-600" />
          দ্রুত প্রি-সেট অপশন:
        </span>
        {presets.map((pr) => {
          const isSelected = amount === pr.amount && unit === pr.unit;
          return (
            <button
              key={pr.label}
              type="button"
              onClick={() => applyDose(pr.amount, pr.unit, frequency)}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-sky-700 text-white border-sky-700 shadow-2xs'
                  : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-100/80 hover:border-sky-300'
              }`}
            >
              {isSelected ? '✓ ' : '+ '}{pr.label}
            </button>
          );
        })}
      </div>

      {/* 2. Structured Dosing Bar: [মাত্রা] [একক] [দিনে কতবার] [খাবার সময়] [মেয়াদ] */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-sky-200/60">
        {/* A. Amount / মাত্রা ইনপুট */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] font-bold text-slate-600">মাত্রা:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              setAmount(val);
              applyDose(val, unit, frequency);
            }}
            placeholder="1"
            className="h-8 w-14 rounded-lg border border-sky-300 bg-white px-1.5 text-center font-bold text-sky-950 text-xs outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-500/30"
            title="মাত্রা লিখুন (যেমন: 1, 1.5, 2, 0.5 বা 1.25)"
          />
        </div>

        {/* Quick Amount Mini-Chips */}
        <div className="flex items-center gap-0.5">
          {['0.5', '1', '1.5', '2', '2.5'].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => applyDose(q, unit, frequency)}
              className={`h-7 px-1.5 rounded text-[11px] font-bold border transition-colors ${
                amount === q
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
              }`}
            >
              {q === '0.5' ? 'আধা' : toBengaliNumerals(q)}
            </button>
          ))}
        </div>

        {/* B. Unit / একক (চামচ, মি.লি., ফোঁটা) */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] font-bold text-slate-600">একক:</label>
          <select
            value={unit}
            onChange={(e) => {
              const u = e.target.value as LiquidUnit;
              setUnit(u);
              applyDose(amount, u, frequency);
            }}
            className="h-8 rounded-lg border border-sky-300 bg-white px-2 text-xs font-bold text-sky-950 outline-none focus:border-sky-600"
          >
            <option value="চামচ">চামচ (tsp)</option>
            <option value="মি.লি.">মি.লি. (ml)</option>
            <option value="ফোঁটা">ফোঁটা (Drops)</option>
          </select>
        </div>

        {/* C. Frequency / দিনে কতবার */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] font-bold text-slate-600">দিনে:</label>
          <select
            value={frequency}
            onChange={(e) => {
              const f = e.target.value;
              setFrequency(f);
              applyDose(amount, unit, f);
            }}
            className="h-8 rounded-lg border border-sky-300 bg-white px-2 text-xs font-bold text-slate-900 outline-none focus:border-sky-600"
          >
            {LIQUID_FREQUENCIES.map((fq) => (
              <option key={fq.value} value={fq.value}>
                {fq.label}
              </option>
            ))}
          </select>
        </div>

        {/* D. Meal Timing / খাবার সময় */}
        <div className="flex items-center gap-1">
          <select
            value={item.meal_timing || 'After Meal'}
            onChange={(e) => onUpdate({ meal_timing: e.target.value as MealTiming })}
            className="h-8 rounded-lg border border-sky-300 bg-white px-2 text-xs font-bold text-slate-900 outline-none focus:border-sky-600"
          >
            <option value="After Meal">খাবারের পরে (ভরা পেটে)</option>
            <option value="Before Meal">খাবারের পূর্বে (খালি পেটে)</option>
            <option value="With Meal">খাবারের সাথে</option>
            <option value="Anytime">যেকোনো সময়</option>
          </select>
        </div>

        {/* E. Duration / কতদিন */}
        <div className="flex items-center gap-1">
          <label className="text-[11px] font-bold text-slate-600">মেয়াদ:</label>
          <input
            type="text"
            value={item.duration || '3 Days'}
            onChange={(e) => onUpdate({ duration: e.target.value })}
            placeholder="3 Days"
            className="h-8 w-20 rounded-lg border border-sky-300 bg-white px-1.5 text-center font-bold text-slate-800 text-xs outline-none focus:border-sky-600"
          />
        </div>

        {/* Quick Duration Chips */}
        <div className="flex items-center gap-0.5">
          {['3 Days', '5 Days', '7 Days', '10 Days'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onUpdate({ duration: d })}
              className={`h-7 px-1.5 rounded text-[10px] font-semibold border transition-colors ${
                item.duration === d
                  ? 'bg-slate-700 text-white border-slate-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {d.replace('Days', 'দিন')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
