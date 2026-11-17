'use client';

/**
 * RxRow — Intelligent, Form-Aware Prescription Line.
 * Automatically aligns dosage, route of administration, and instructions for:
 * - Creams / Ointments (Scabies permethrin, topical skin application, no "After Meal" clutter)
 * - Syrups / Suspensions (Spoon/ml dosing & shake bottle instructions)
 * - Rectal Suppositories (Per Rectum, fever/pain SOS)
 * - Vaginal Suppositories / Pessaries (Per Vaginam, bedtime)
 * - Injections (IV / IM / SC route selection)
 * - Eye / Ear / Nasal Drops & Inhalers
 * - Oral Tablets & Capsules
 */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Syringe, Trash2 } from 'lucide-react';

import { db } from '@/db/localDb';
import {
  cleanBrandName,
  formatSubcontinentRxLine,
  formatSubcontinentSchedule,
  normalizeDosageForm,
  sanitizeSpecialInstructions,
  toBengaliNumerals,
} from '@/lib/prescriptionFormatters';
import { detectMedicineCategory, getCategoryDosageProfile } from '@/services/medicineRouteService';
import { checkMedicineWithCatalog, type SafetyWarning } from './safety';
import { SafetyBanners } from './safety-banners';
import { parseShorthand } from './shorthand';
import { TaperingDosePanel } from './tapering-dose-panel';
import { LiquidDosingPanel } from './liquid-dosing-panel';
import type { DosageForm, MealTiming, Patient, PrescriptionItem, Vitals } from '@/types/schema';
import { Button } from '@/components/ui/button';

const STANDARD_MEAL_OPTIONS: Array<{ value: MealTiming; label: string }> = [
  { value: 'After Meal', label: 'খাবারের পরে (ভরা পেটে)' },
  { value: 'Before Meal', label: 'খাবারের পূর্বে (খালি পেটে)' },
  { value: 'With Meal', label: 'খাবারের সাথে' },
  { value: 'Anytime', label: 'যেকোনো সময়' },
  { value: 'প্রযোজ্য নয়', label: 'প্রযোজ্য নয় (বাহ্যিক / রুট)' },
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

  const category = detectMedicineCategory(item.dosage_form, item.brand_name, item.generic_name);
  const profile = getCategoryDosageProfile(category, item.brand_name, item.generic_name);

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
  const effectiveForm =
    category === 'topical' && (cleanForm === 'Syr' || cleanForm === 'Tab')
      ? (cleanBrand.toLowerCase().includes('oint') ? 'Oint' : 'Cream')
      : cleanForm;
  const displayTitle = `${effectiveForm}. ${cleanBrand}${
    item.strength && !hasStrengthInBrand ? ` ${item.strength}` : ''
  }`.trim();

  // Auto-sanitize legacy records with duplicate form prefixes, pediatric debug notes, and auto-fix wrongly tagged topicals
  useEffect(() => {
    const fixedForm = normalizeDosageForm(item.dosage_form);
    const fixedBrand = cleanBrandName(item.brand_name);
    const updates: Partial<PrescriptionItem> = {};
    if (fixedForm !== item.dosage_form) updates.dosage_form = fixedForm;
    if (fixedBrand && fixedBrand !== item.brand_name) updates.brand_name = fixedBrand;

    // 1. Auto-sanitize legacy records with pediatric debug instructions
    const sanitizedInst = sanitizeSpecialInstructions(item.special_instructions);
    if (sanitizedInst !== (item.special_instructions || '')) {
      updates.special_instructions = sanitizedInst;
    }

    // 2. Auto-fix topical medicines that were mistakenly tagged as Syr or Tab (e.g. Afun, Permin, Halovar)
    const genuineCat = detectMedicineCategory(item.dosage_form, item.brand_name, item.generic_name);
    if (genuineCat === 'topical') {
      if (item.dosage_form === 'Syr' || item.dosage_form === 'Tab') {
        const isOint = item.brand_name.toLowerCase().includes('oint') || (item.generic_name || '').toLowerCase().includes('oint');
        updates.dosage_form = isOint ? 'Oint' : 'Cream';
      }
      if (item.meal_timing) {
        updates.meal_timing = undefined;
      }
      // If schedule is numeric 1+0+1 or 1+1, migrate to standard clinical frequency
      const isScabies =
        (item.brand_name + ' ' + (item.generic_name || '')).toLowerCase().includes('permin') ||
        (item.brand_name + ' ' + (item.generic_name || '')).toLowerCase().includes('permethrin');
      if (item.schedule === '1+0+1' || item.schedule === '1+1') {
        updates.schedule = isScabies ? '১ বার (রাতে)' : 'দিনে ২ বার';
      }
      if (!item.route) {
        updates.route = isScabies ? 'সারা শরীরে (ঘাড় থেকে পা)' : 'আক্রান্ত স্থানে (ত্বকে)';
      }
    }

    // 3. For any non-oral category (suppository, injection, drops, inhaler)
    if (genuineCat !== 'oral_solid' && genuineCat !== 'syrup') {
      if (item.meal_timing) {
        updates.meal_timing = undefined;
      }
      if (!item.route && profile.defaultRoute) {
        updates.route = profile.defaultRoute;
      }
    }

    if (Object.keys(updates).length > 0) {
      void db.prescription_items.update(item.id, {
        ...updates,
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      });
    }
  }, [
    item.id,
    item.dosage_form,
    item.brand_name,
    item.generic_name,
    item.route,
    item.meal_timing,
    item.schedule,
    item.special_instructions,
    profile.defaultRoute,
    category,
  ]);

  // Form-specific color accents
  const categoryBadgeColor =
    category === 'topical'
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : category === 'syrup'
      ? 'bg-sky-100 text-sky-900 border-sky-300'
      : category === 'rectal_suppository'
      ? 'bg-rose-100 text-rose-900 border-rose-300'
      : category === 'vaginal_suppository'
      ? 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300'
      : category === 'injection'
      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
      : category === 'drops'
      ? 'bg-cyan-100 text-cyan-900 border-cyan-300'
      : category === 'inhaler'
      ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
      : 'bg-slate-100 text-slate-700 border-slate-200';

  const isLiquid =
    category === 'syrup' ||
    category === 'drops' ||
    cleanForm === 'Syr' ||
    cleanForm === 'Susp' ||
    cleanForm === 'Drop';

  const { dosageDetails } = formatSubcontinentRxLine(item);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 space-y-2.5">
      {/* 1. Trade Name, Form Badge & Strength (ট্রেড নেম, প্রিপারেশন টাইপ ও স্ট্রেন্থ) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-bold text-slate-400">
            {toBengaliNumerals(index + 1)}.
          </span>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            {displayTitle}
          </span>

          {/* Clinical Category Badge & Form Selector */}
          <select
            value={item.dosage_form || 'Tab'}
            onChange={(e) => {
              const newForm = e.target.value as DosageForm;
              const cat = detectMedicineCategory(newForm, item.brand_name, item.generic_name);
              const prof = getCategoryDosageProfile(cat, item.brand_name, item.generic_name);
              const updates: Partial<PrescriptionItem> = { dosage_form: newForm };
              if (prof.defaultRoute && (!item.route || item.route === profile.defaultRoute)) {
                updates.route = prof.defaultRoute;
              }
              if (prof.hideMealTiming) {
                updates.meal_timing = undefined;
              }
              write(updates);
            }}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer outline-none transition-all ${categoryBadgeColor}`}
            title="ঔষধের প্রিপারেশন পরিবর্তন করতে ক্লিক করুন (যেমন: Cream, Oint, Syr, Tab)"
          >
            <option value="Cream">ক্রিম (Cream)</option>
            <option value="Oint">মলম (Ointment)</option>
            <option value="Lotion">লোশন (Lotion)</option>
            <option value="Gel">জেল (Gel)</option>
            <option value="Tab">ট্যাবলেট (Tab)</option>
            <option value="Cap">ক্যাপসুল (Cap)</option>
            <option value="Syr">সিরাপ (Syr)</option>
            <option value="Susp">সাসপেনশন (Susp)</option>
            <option value="Supp">সাপোজিটরি (Supp)</option>
            <option value="Pessary">পেসারি (Pessary)</option>
            <option value="Inj">ইনজেকশন (Inj)</option>
            <option value="Drop">ড্রপ (Drop)</option>
            <option value="Inhaler">ইনহেলার (Inhaler)</option>
            <option value="Spray">স্প্রে (Spray)</option>
          </select>

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

      {/* 2. Route of Administration Selector Chips (রুট অফ অ্যাডমিনিস্ট্রেশন: শিরায়/মাংসে, আক্রান্ত স্থানে, পায়ুপথে, যোনিপথে) */}
      {profile.routeOptions && profile.routeOptions.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <Syringe className="h-3 w-3 text-teal-600" /> রুট:
          </span>
          {profile.routeOptions.map((r) => {
            const isSelected = item.route === r || (!item.route && r === profile.defaultRoute);
            return (
              <button
                key={r}
                type="button"
                onClick={() => write({ route: r })}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                {isSelected ? '✓ ' : ''}{r}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Primary Dose Controls: Liquid/Pediatric Panel for Syrups/Drops vs Standard Controls */}
      {isLiquid ? (
        <LiquidDosingPanel item={item} patient={patient} onUpdate={write} />
      ) : (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Bengali Shorthand / Frequency Badge */}
          <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md text-xs">
            {category === 'topical'
              ? (item.schedule || profile.defaultSchedule || 'দিনে ২ বার')
              : (formatSubcontinentSchedule(item.schedule) || '১ + ০ + ১')}
          </span>

          {/* Schedule / Frequency Input */}
          <input
            className="h-8 w-28 rounded-lg border border-slate-300 px-2 text-center font-medium font-mono text-teal-900 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
            placeholder={profile.defaultSchedule || '1+0+1'}
            value={item.schedule}
            onChange={(e) => write({ schedule: e.target.value })}
            title="শিডিউল (যেমন: দিনে ২ বার, রাতে ১ বার, 1+0+1)"
          />

          {/* Quick Frequency Chips for Topical Preparations */}
          {category === 'topical' && (
            <div className="flex items-center gap-1">
              {(profile.categoryLabelBn.includes('স্ক্যাবিস')
                ? ['১ বার (রাতে)', '৭ দিন পর পুনরায়', 'প্রয়োজনমতো']
                : ['দিনে ২ বার', 'দিনে ৩ বার', 'রাতে ১ বার', 'প্রয়োজনমতো']
              ).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => write({ schedule: q })}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-md border transition-all ${
                    item.schedule === q
                      ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Meal Timing / Route: STRICTLY Oral gets Meal Timing, non-oral displays route */}
          {category === 'oral_solid' ? (
            <select
              className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
              value={item.meal_timing || 'After Meal'}
              onChange={(e) => write({ meal_timing: e.target.value as MealTiming })}
            >
              {STANDARD_MEAL_OPTIONS.filter((opt) => opt.value !== 'প্রযোজ্য নয়').map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-xs font-semibold text-teal-900">
              <span className="text-[10px] text-teal-600 uppercase">রুট:</span>
              <span>{item.route || profile.defaultRoute || 'বাহ্যিক (ত্বকে)'}</span>
            </div>
          )}

          {/* Duration input */}
          <input
            className="h-8 w-24 rounded-lg border border-slate-300 px-2 text-center font-medium text-slate-800 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
            placeholder={profile.defaultDuration || '7 Days'}
            value={item.duration}
            onChange={(e) => write({ duration: e.target.value })}
            title="মেয়াদ (যেমন: 7 Days, 14 Days, চলবে)"
          />

          {/* Quick Shorthand input */}
          <div className="flex items-center gap-1 flex-1 min-w-[150px]">
            <input
              className="h-8 w-full rounded-lg border border-teal-200 bg-teal-50/30 px-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-600 focus:bg-white"
              placeholder={category === 'topical' ? 'শর্টহ্যান্ড (যেমন: "দিনে ২ বার ৭ দিন")' : 'শর্টহ্যান্ড (যেমন: "bd pc 7d" বা "1+0+1")'}
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

          {/* Tapering Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowTapering(!showTapering)}
              className="text-[11px] font-medium text-slate-500 hover:text-teal-700 underline px-1"
            >
              {showTapering ? 'ট্যাপারিং বন্ধ' : '+ ট্যাপারিং'}
            </button>
          </div>
        </div>
      )}

      {/* 4. Live Rx Preview (প্রেসক্রিপশনে যেভাবে মুদ্রিত হবে) */}
      {dosageDetails && (
        <div className="rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 flex items-center justify-between gap-2">
          <div className="truncate">
            <span className="font-bold text-slate-900 mr-1">প্রিন্ট প্রিভিউ:</span>
            <span className="text-teal-950 font-semibold">{displayTitle}</span>
            <span className="text-slate-400 mx-1">—</span>
            <span className="text-slate-800 font-medium">{dosageDetails}</span>
          </div>
        </div>
      )}

      {/* Tapering panel if active */}
      {showTapering && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <TaperingDosePanel item={item} onSaveSteps={(steps) => write({ tapering_steps: steps })} />
        </div>
      )}

      {/* Safety warnings (if allergic or contraindication) */}
      <SafetyBanners warnings={warnings} />
    </div>
  );
}
