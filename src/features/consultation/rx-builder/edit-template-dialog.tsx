'use client';

/**
 * EditTemplateDialog — Allows doctors to customize, edit medicines/dosages,
 * and save tailored versions of any disease protocol template.
 */
import { useState } from 'react';
import { Check, Edit3, Plus, Trash2, X } from 'lucide-react';
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import type { AgeGroupCategory, PrescriptionTemplate, TemplateMedicineItem } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DISEASE_SYSTEM_CATEGORIES } from '@/services/diseaseGroupTemplates';

interface EditTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  template: {
    id?: string;
    title: string;
    titleBn: string;
    category: string;
    diseaseGroup: string;
    ageGroup: AgeGroupCategory;
    ageRangeLabel: string;
    diagnosis: string[];
    medicines: TemplateMedicineItem[];
    advice: string[];
    isCustom?: boolean;
    tenantId?: string;
  };
  onSaved?: () => void;
}

export function EditTemplateDialog({
  open,
  onClose,
  template,
  onSaved,
}: EditTemplateDialogProps) {
  const [title, setTitle] = useState(template.titleBn || template.title);
  const [category, setCategory] = useState(template.category || 'Respiratory (শ্বাসতন্ত্র ও ফুসফুস)');
  const [diseaseGroup, setDiseaseGroup] = useState(template.diseaseGroup || 'General');
  const [ageGroup, setAgeGroup] = useState<AgeGroupCategory>(template.ageGroup || 'adult');
  const [medicines, setMedicines] = useState<TemplateMedicineItem[]>([...template.medicines]);
  const [adviceText, setAdviceText] = useState((template.advice || []).join('\n'));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdateMedicine = (idx: number, patch: Partial<TemplateMedicineItem>) => {
    setMedicines((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        brand_name: 'New Medicine',
        generic_name: '',
        dosage_form: 'Tab',
        strength: '',
        schedule: '1+0+1',
        meal_timing: 'After Meal',
        duration: '7 Days',
        special_instructions: '',
      },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tenantId = template.tenantId || (await db.tenants.toCollection().first())?.id || generateUUID();
      const templateRecord: PrescriptionTemplate = {
        id: template.isCustom && template.id ? template.id : generateUUID(),
        tenant_id: tenantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
        title: title.trim(),
        title_bn: title.trim(),
        category,
        disease_group: diseaseGroup.trim() || 'General',
        age_group: ageGroup,
        age_range_label: template.ageRangeLabel || 'নির্দিষ্ট বয়স',
        diagnosis: template.diagnosis || [],
        medicines,
        advice: adviceText.split('\n').map((s) => s.trim()).filter(Boolean),
        is_custom: true,
      };

      await db.prescription_templates.put(templateRecord);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
        if (onSaved) onSaved();
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-5 rounded-2xl bg-white border border-slate-200 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-2.5">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-indigo-600" />
            ডিজিজ টেমপ্লেট এডিট করুন ({title})
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            ওষুধের তালিকা, ডোজ, শিডিউল ও রোগীর উপদেশ আপনার চেম্বার প্র্যাকটিস অনুযায়ী কাস্টমাইজ করুন।
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 py-2 text-xs">
          {/* Title & Category */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">টেমপ্লেটের শিরোনাম:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-medium text-xs focus:border-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">সিস্টেম ক্যাটাগরি:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-slate-300 font-medium text-xs bg-white focus:border-indigo-600 outline-none"
              >
                {DISEASE_SYSTEM_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Medicines Table Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                ওষুধের তালিকা ({medicines.length}টি):
              </span>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> নতুন ওষুধ যোগ করুন
              </button>
            </div>

            <div className="space-y-1.5">
              {medicines.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 grid grid-cols-12 gap-1.5 items-center text-xs"
                >
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={m.brand_name}
                      onChange={(e) => handleUpdateMedicine(idx, { brand_name: e.target.value })}
                      placeholder="Brand Name"
                      className="w-full h-7 px-1.5 rounded border border-slate-300 bg-white font-bold text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={m.strength}
                      onChange={(e) => handleUpdateMedicine(idx, { strength: e.target.value })}
                      placeholder="500 mg"
                      className="w-full h-7 px-1.5 rounded border border-slate-300 bg-white text-xs font-mono"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={m.schedule}
                      onChange={(e) => handleUpdateMedicine(idx, { schedule: e.target.value })}
                      placeholder="1+0+1"
                      className="w-full h-7 px-1.5 rounded border border-slate-300 bg-white text-xs font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={m.duration}
                      onChange={(e) => handleUpdateMedicine(idx, { duration: e.target.value })}
                      placeholder="7 Days"
                      className="w-full h-7 px-1.5 rounded border border-slate-300 bg-white text-xs"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      title="মুছুন"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">রোগীর উপদেশ (প্রতি লাইনে ১টি):</label>
            <textarea
              rows={3}
              value={adviceText}
              onChange={(e) => setAdviceText(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 font-medium text-xs focus:border-indigo-600 outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-2.5 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs font-semibold">
            বাতিল
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={handleSave}
            className="h-8 px-4 font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" />
                সংরক্ষিত হয়েছে!
              </>
            ) : (
              'কাস্টম টেমপ্লেট সেভ করুন'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
