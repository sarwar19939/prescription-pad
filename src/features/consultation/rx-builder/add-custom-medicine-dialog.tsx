'use client';

/**
 * AddCustomMedicineDialog — Allows doctors to prescribe unlisted / new medicines & preparations
 * and automatically saves them to the local MedicineCatalog for future autocomplete.
 */
import { useState } from 'react';
import { BookmarkCheck, Check, Pill, Plus, Sparkles, X } from 'lucide-react';
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import type { DosageForm, MealTiming, Patient, PrescriptionItem, MedicineCatalog } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DOSAGE_FORMS: DosageForm[] = [
  'Tab',
  'Cap',
  'Syr',
  'Inj',
  'Drop',
  'Oint',
  'Sachet',
  'Inhaler',
  'Supp',
];

const COMMON_STRENGTHS = ['500 mg', '650 mg', '20 mg', '40 mg', '10 mg', '5 mg', '100 ml', '200 ml', '0.5%'];
const COMMON_SCHEDULES = ['1+0+1', '1+1+1', '1+0+0', '0+0+1', '1+1+1+1', '১ চা চামচ ৩ বার', 'SOS (প্রয়োজনে)'];
const COMMON_DURATIONS = ['৩ দিন (3 Days)', '৫ দিন (5 Days)', '৭ দিন (7 Days)', '১০ দিন (10 Days)', '১৪ দিন (14 Days)', '১ মাস (1 Month)', 'চলবে (Continue)'];

interface AddCustomMedicineDialogProps {
  open: boolean;
  onClose: () => void;
  initialBrand?: string;
  encounterId: string;
  patient: Patient;
  onAdded?: () => void;
}

export function AddCustomMedicineDialog({
  open,
  onClose,
  initialBrand = '',
  encounterId,
  patient,
  onAdded,
}: AddCustomMedicineDialogProps) {
  const [brandName, setBrandName] = useState(initialBrand);
  const [genericName, setGenericName] = useState('');
  const [dosageForm, setDosageForm] = useState<DosageForm>('Tab');
  const [strength, setStrength] = useState('');
  const [schedule, setSchedule] = useState('1+0+1');
  const [mealTiming, setMealTiming] = useState<MealTiming>('After Meal');
  const [duration, setDuration] = useState('7 Days');
  const [instructions, setInstructions] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [saveToCatalog, setSaveToCatalog] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setSaving(true);

    try {
      const now = new Date().toISOString();
      const finalBrand = brandName.trim();
      const finalGeneric = genericName.trim();
      const finalStrength = strength.trim();
      const cleanDuration = duration.split('(')[1]?.replace(')', '') || duration;

      // 1. Add to active prescription_items
      const rxRow: PrescriptionItem = {
        id: generateUUID(),
        tenant_id: patient.tenant_id,
        encounter_id: encounterId,
        patient_id: patient.id,
        brand_name: finalBrand,
        generic_name: finalGeneric,
        dosage_form: dosageForm,
        strength: finalStrength,
        schedule: schedule.trim() || '1+0+1',
        meal_timing: mealTiming,
        duration: cleanDuration.trim() || '7 Days',
        special_instructions: instructions.trim(),
        created_at: now,
        updated_at: now,
        sync_status: 'pending',
      };
      await db.prescription_items.put(rxRow);

      // 2. Auto-save to master medicine_catalog if checked
      if (saveToCatalog) {
        const existing = await db.medicine_catalog
          .where('brand_name')
          .equals(finalBrand)
          .toArray();

        const match = existing.find(
          (m) =>
            m.dosage_form === dosageForm &&
            m.strength.toLowerCase() === finalStrength.toLowerCase()
        );

        if (!match) {
          const catalogRow: MedicineCatalog = {
            id: generateUUID(),
            tenant_id: patient.tenant_id,
            brand_name: finalBrand,
            generic_name: finalGeneric || finalBrand,
            dosage_form: dosageForm,
            strength: finalStrength,
            manufacturer: manufacturer.trim() || 'Custom Added',
            contraindications: [],
            created_at: now,
            updated_at: now,
            sync_status: 'pending',
          };
          await db.medicine_catalog.put(catalogRow);
        }
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
        if (onAdded) onAdded();
      }, 700);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-2xl bg-white border border-slate-200 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-2.5">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Pill className="h-4 w-4 text-teal-600" />
            নতুন ওষুধ ও প্রিপারেশন যুক্ত করুন
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            লিস্টের বাইরের যেকোনো নতুন ওষুধ, প্রিপারেশন ও ডোজ লিখুন; এটি পরবর্তীতে অটো-সাজেস্ট হবে।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
          {/* Brand Name & Generic Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ওষুধের নাম (Brand Name) *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="যেমন: Maxpro D"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-bold text-xs focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                জেনেরিক নাম (Generic Name)
              </label>
              <input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="যেমন: Esomeprazole + Domperidone"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Dosage Form (Preparation) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              প্রিপারেশন (Preparation / Form):
            </label>
            <div className="flex flex-wrap gap-1">
              {DOSAGE_FORMS.map((form) => (
                <button
                  key={form}
                  type="button"
                  onClick={() => setDosageForm(form)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                    dosageForm === form
                      ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </div>

          {/* Strength (Power) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              পাওয়ার / শক্তি (Strength):
            </label>
            <input
              type="text"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              placeholder="যেমন: 20 mg, 500 mg, 100 ml"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-xs focus:border-teal-600 outline-none mb-1"
            />
            <div className="flex flex-wrap gap-1">
              {COMMON_STRENGTHS.map((str) => (
                <button
                  key={str}
                  type="button"
                  onClick={() => setStrength(str)}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-600 border border-slate-200"
                >
                  {str}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule & Meal Timing */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                খাওয়ার নিয়ম / শিডিউল:
              </label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="1+0+1"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-xs focus:border-teal-600 outline-none mb-1"
              />
              <div className="flex flex-wrap gap-1">
                {COMMON_SCHEDULES.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSchedule(s)}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-600 border border-slate-200 font-mono"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                খাবার সময় (Meal Timing):
              </label>
              <select
                value={mealTiming}
                onChange={(e) => setMealTiming(e.target.value as MealTiming)}
                className="w-full h-8 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-teal-600 outline-none"
              >
                <option value="After Meal">After Meal (খাওয়ার পর)</option>
                <option value="Before Meal">Before Meal (খাওয়ার আগে)</option>
                <option value="With Meal">With Meal (খাবারের সাথে)</option>
                <option value="Anytime">Anytime (যেকোনো সময়)</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              মেয়াদ (Duration):
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="7 Days"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs focus:border-teal-600 outline-none mb-1"
            />
            <div className="flex flex-wrap gap-1">
              {COMMON_DURATIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur.split('(')[1]?.replace(')', '') || dur)}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-600 border border-slate-200"
                >
                  {dur.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions & Manufacturer */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                বিশেষ নির্দেশনা:
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="যেমন: কুসুম গরম পানি সহ"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs focus:border-teal-600 outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                প্রস্তুতকারক কোম্পানি:
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="যেমন: Square, Incepta"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 text-xs focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Auto-Save to Catalog Checkbox */}
          <label className="flex items-center gap-2 p-2 rounded-lg bg-teal-50/70 border border-teal-200 cursor-pointer">
            <input
              type="checkbox"
              checked={saveToCatalog}
              onChange={(e) => setSaveToCatalog(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
            />
            <span className="font-bold text-xs text-teal-900 flex items-center gap-1">
              <BookmarkCheck className="h-3.5 w-3.5 text-teal-600" />
              ভবিষ্যতের জন্য ওষুধের ক্যাটালগে (Medicine Catalog) সংরক্ষণ করুন
            </span>
          </label>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs font-semibold"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="h-8 px-4 font-bold text-xs bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
            >
              {saved ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" />
                  যুক্ত হয়েছে!
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  প্রেসক্রিপশনে যোগ করুন
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
