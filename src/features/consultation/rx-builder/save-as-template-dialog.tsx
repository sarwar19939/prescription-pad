'use client';

/**
 * SaveAsTemplateDialog — Saves the current active prescription as a reusable Disease Template.
 * Allows doctor to categorize by System, Disease Group, and Age Group for 1-click reuse.
 */
import { useState } from 'react';
import { BookmarkPlus, Check, Sparkles, X } from 'lucide-react';
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import type { AgeGroupCategory, Encounter, Patient, PrescriptionItem, PrescriptionTemplate } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DISEASE_SYSTEM_CATEGORIES } from '@/services/diseaseGroupTemplates';

interface SaveAsTemplateDialogProps {
  encounter: Encounter;
  patient: Patient;
  prescriptionItems: PrescriptionItem[];
}

export function SaveAsTemplateDialog({
  encounter,
  patient,
  prescriptionItems,
}: SaveAsTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auto-detect age group
  const age = patient.age ?? 30;
  const initialAgeGroup: AgeGroupCategory =
    age < 1 ? 'infant' : age <= 5 ? 'child' : age <= 12 ? 'adolescent' : age >= 60 ? 'elderly' : 'adult';

  const defaultDisease = encounter.diagnosis?.[0] || encounter.chief_complaints?.[0] || 'My Disease Protocol';

  const [title, setTitle] = useState(`${defaultDisease} - ${initialAgeGroup.toUpperCase()}`);
  const [category, setCategory] = useState('Respiratory (শ্বাসতন্ত্র ও ফুসফুস)');
  const [diseaseGroup, setDiseaseGroup] = useState(defaultDisease);
  const [ageGroup, setAgeGroup] = useState<AgeGroupCategory>(initialAgeGroup);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const templateRecord: PrescriptionTemplate = {
        id: generateUUID(),
        tenant_id: encounter.tenant_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
        title: title.trim(),
        title_bn: title.trim(),
        category,
        disease_group: diseaseGroup.trim() || 'General',
        age_group: ageGroup,
        age_range_label:
          ageGroup === 'infant'
            ? 'শিশু (< ১ বছর)'
            : ageGroup === 'child'
            ? 'শিশু (১ - ৫ বছর)'
            : ageGroup === 'adolescent'
            ? 'কিশোর (৬ - ১২ বছর)'
            : ageGroup === 'elderly'
            ? 'বয়োজ্যেষ্ঠ (> ৬০ বছর)'
            : 'পূর্ণবয়স্ক (১২+ বছর)',
        diagnosis: encounter.diagnosis || [],
        chief_complaints: encounter.chief_complaints || [],
        medicines: prescriptionItems.map((m) => ({
          brand_name: m.brand_name,
          generic_name: m.generic_name,
          dosage_form: m.dosage_form,
          strength: m.strength,
          schedule: m.schedule,
          meal_timing: m.meal_timing,
          duration: m.duration,
          special_instructions: m.special_instructions,
        })),
        advice: encounter.advice || [],
        is_custom: true,
      };

      await db.prescription_templates.add(templateRecord);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setOpen(false);
      }, 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={prescriptionItems.length === 0}
          className="h-8 gap-1.5 rounded-lg border-teal-300 bg-teal-50/80 text-teal-900 hover:bg-teal-100 font-bold text-xs shadow-2xs transition-all"
          title="বর্তমান প্রেসক্রিপশনকে ডিজিজ টেমপ্লেট হিসেবে সেভ করুন"
        >
          <BookmarkPlus className="h-3.5 w-3.5 text-teal-600" />
          <span>💾 টেমপ্লেট সেভ করুন</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-5 rounded-2xl bg-white border border-slate-200 shadow-xl">
        <DialogHeader className="border-b border-slate-100 pb-2.5">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookmarkPlus className="h-4 w-4 text-teal-600" />
            ডিজিজ টেমপ্লেট হিসেবে সংরক্ষণ করুন
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            বর্তমান প্রেসক্রিপশনের {prescriptionItems.length}টি ওষুধ ও উপদেশ পরবর্তীতে ১-ক্লিকে ব্যবহারের জন্য সেভ থাকবে।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2 text-xs">
          {/* Template Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">টেমপ্লেটের নাম:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: নিউমোনিয়া (শিশু ১-৫ বছর) - আমার স্পেশাল"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-medium text-xs focus:border-teal-600 outline-none"
            />
          </div>

          {/* System Category */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">শারীরিক সিস্টেম (System):</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-8 px-2 rounded-lg border border-slate-300 font-medium text-xs bg-white focus:border-teal-600 outline-none"
            >
              {DISEASE_SYSTEM_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Disease Group & Age Group */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">রোগের গ্রুপ (Disease):</label>
              <input
                type="text"
                value={diseaseGroup}
                onChange={(e) => setDiseaseGroup(e.target.value)}
                placeholder="যেমন: Pneumonia, Fever"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-medium text-xs focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">বয়স গ্রুপ (Age Group):</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroupCategory)}
                className="w-full h-8 px-2 rounded-lg border border-slate-300 font-medium text-xs bg-white focus:border-teal-600 outline-none"
              >
                <option value="infant">শিশু (&lt; ১ বছর)</option>
                <option value="child">শিশু (১ - ৫ বছর)</option>
                <option value="adolescent">কিশোর (৬ - ১২ বছর)</option>
                <option value="adult">পূর্ণবয়স্ক (১২+ বছর)</option>
                <option value="elderly">বয়োজ্যেষ্ঠ (&gt; ৬০ বছর)</option>
                <option value="all">সকল বয়স (All ages)</option>
              </select>
            </div>
          </div>

          {/* Included Items Preview */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-1">
            <span className="font-bold text-[11px] text-slate-700 block">সংরক্ষিত হচ্ছে:</span>
            <div className="flex flex-wrap gap-1">
              {prescriptionItems.map((m) => (
                <span
                  key={m.id}
                  className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-800"
                >
                  {m.brand_name} ({m.schedule})
                </span>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 text-xs font-semibold"
            >
              বাতিল
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={saving}
              onClick={handleSave}
              className="h-8 px-4 font-bold text-xs bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
            >
              {saved ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" />
                  সংরক্ষিত হয়েছে!
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  টেমপ্লেট সংরক্ষণ করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
