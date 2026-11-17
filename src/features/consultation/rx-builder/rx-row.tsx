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
import { ChevronDown, ChevronUp, Sparkles, Stethoscope, Syringe, Trash2 } from 'lucide-react';

import { db } from '@/db/localDb';
import {
  cleanBrandName,
  formatSubcontinentRxLine,
  formatSubcontinentSchedule,
  normalizeDosageForm,
  toBengaliNumerals,
} from '@/lib/prescriptionFormatters';
import { detectMedicineCategory, getCategoryDosageProfile } from '@/services/medicineRouteService';
import { checkMedicineWithCatalog, type SafetyWarning } from './safety';
import { SafetyBanners } from './safety-banners';
import { parseShorthand } from './shorthand';
import { TaperingDosePanel } from './tapering-dose-panel';
import type { MealTiming, Patient, PrescriptionItem, Vitals } from '@/types/schema';
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
  const [showPresets, setShowPresets] = useState(false);

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
  const displayTitle = `${cleanForm}. ${cleanBrand}${
    item.strength && !hasStrengthInBrand ? ` ${item.strength}` : ''
  }`.trim();

  // Auto-sanitize legacy records with duplicate form prefixes
  useEffect(() => {
    const fixedForm = normalizeDosageForm(item.dosage_form);
    const fixedBrand = cleanBrandName(item.brand_name);
    const updates: Partial<PrescriptionItem> = {};
    if (fixedForm !== item.dosage_form) updates.dosage_form = fixedForm;
    if (fixedBrand && fixedBrand !== item.brand_name) updates.brand_name = fixedBrand;

    // If item has no route and category has a specific default route (e.g. IV, Per Rectum, Topical), auto-fill
    if (!item.route && profile.defaultRoute && category !== 'oral_solid') {
      updates.route = profile.defaultRoute;
    }

    if (Object.keys(updates).length > 0) {
      void db.prescription_items.update(item.id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
    }
  }, [item.id, item.dosage_form, item.brand_name, item.route, profile.defaultRoute, category]);

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

          {/* Clinical Category Badge (ক্রিম / ইনজেকশন / সাপোজিটরি ইত্যাদি) */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadgeColor}`}>
            {profile.categoryLabelBn}
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

      {/* 3. Primary Dose Controls (শিডিউল, খাবার সময়/রুট, মেয়াদ ও শর্টহ্যান্ড) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
        {/* Bengali Shorthand / Frequency Badge */}
        <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md text-xs">
          {formatSubcontinentSchedule(item.schedule) || (profile.isTopical ? 'দিনে ২ বার' : '১ + ০ + ১')}
        </span>

        {/* Schedule / Frequency Input */}
        <input
          className="h-8 w-28 rounded-lg border border-slate-300 px-2 text-center font-medium font-mono text-teal-900 text-xs outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
          placeholder={profile.defaultSchedule || '1+0+1'}
          value={item.schedule}
          onChange={(e) => write({ schedule: e.target.value })}
          title="শিডিউল (যেমন: 1+0+1, দিনে ২ বার, রাতে ১ বার)"
        />

        {/* Meal Timing / Route Select */}
        <select
          className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
          value={item.meal_timing}
          onChange={(e) => write({ meal_timing: e.target.value as MealTiming })}
        >
          {STANDARD_MEAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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
            placeholder='শর্টহ্যান্ড (যেমন: "bd pc 7d" বা "1+0+1")'
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

        {/* Presets & Tapering Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2 py-1 rounded-md flex items-center gap-0.5 transition-colors"
          >
            <Sparkles className="h-3 w-3 text-teal-600" />
            {showPresets ? 'নির্দেশনা বন্ধ' : '+ নির্দেশনা অপশন'}
          </button>

          <button
            type="button"
            onClick={() => setShowTapering(!showTapering)}
            className="text-[11px] font-medium text-slate-500 hover:text-teal-700 underline px-1"
          >
            {showTapering ? 'ট্যাপারিং বন্ধ' : '+ ট্যাপারিং'}
          </button>
        </div>
      </div>

      {/* 4. Special Instructions & Quick Presets (ক্রিম মাখার নিয়ম, সাপোজিটরি, ইনজেকশন বা সিরাপের দ্রুত প্রিসেট) */}
      <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Stethoscope className="h-3 w-3 text-teal-600" />
            নির্দেশনা ও ব্যবহারের নিয়ম (Special Instructions / Administration):
          </label>
          <span className="text-[10px] text-slate-400">লিখুন বা নিচের অপশনে ক্লিক করুন</span>
        </div>

        <input
          type="text"
          value={item.special_instructions || ''}
          onChange={(e) => write({ special_instructions: e.target.value })}
          placeholder={
            profile.defaultSpecialInstructions ||
            'যেমন: আক্রান্ত স্থানে দিনে ২ বার লাগাবেন / পায়ুপথে / শিরায় (IV) পুশ করবেন...'
          }
          className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30 outline-none"
        />

        {/* Quick Dose Units (for Syrups: 1 spoon, 2 spoons, 5ml, 10ml) */}
        {profile.quickDoseUnits && profile.quickDoseUnits.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">মাত্রা:</span>
            {profile.quickDoseUnits.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => {
                  const cur = (item.special_instructions || '').trim();
                  const updated = cur ? `${u} করে — ${cur}` : `${u} করে দিনে ৩ বার খাবারের পরে`;
                  write({ special_instructions: updated });
                }}
                className="text-[10px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-2 py-0.5 rounded transition-colors"
              >
                + {u}
              </button>
            ))}
          </div>
        )}

        {/* Form-Specific Quick Instruction Presets Drawer / Chips */}
        {(showPresets || (profile.instructionPresets && profile.instructionPresets.length > 0)) && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">দ্রুত অপশন:</span>
            {profile.instructionPresets.map((pr, pIdx) => {
              const isActive = (item.special_instructions || '').includes(pr.text);
              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => write({ special_instructions: pr.text })}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-2xs'
                      : 'bg-white hover:bg-teal-50 text-slate-700 border-slate-200 hover:border-teal-300'
                  }`}
                  title={pr.text}
                >
                  {isActive ? '✓ ' : '+ '}{pr.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Live Rx Preview (প্রেসক্রিপশনে যেভাবে মুদ্রিত হবে) */}
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
