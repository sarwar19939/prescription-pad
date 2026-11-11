'use client';

/**
 * ProtocolTemplatesDialog — System-wise, Disease-Grouped, and Age-Calibrated Template Library.
 * Features:
 * 1. Categorization by System (Respiratory, GI, Fever, etc.)
 * 2. Disease Groups (Pneumonia, Fever, Diarrhea, etc.) with Age-Group Sub-templates
 * 3. Auto-recommendation based on Patient Age
 * 4. In-place Template Editing (Custom tailored chamber templates)
 * 5. 1-Click application directly into Dexie DB
 */
import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Check,
  ChevronRight,
  Clock,
  Edit3,
  Layers,
  Search,
  Sparkles,
  Stethoscope,
  Wand2,
} from 'lucide-react';
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import type { DosageForm, Encounter, MealTiming, Patient, PrescriptionItem, TemplateMedicineItem } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BUILTIN_DISEASE_GROUPS,
  DISEASE_SYSTEM_CATEGORIES,
  type DiseaseGroupTemplateDef,
} from '@/services/diseaseGroupTemplates';
import { EditTemplateDialog } from './edit-template-dialog';

export function ProtocolTemplatesDialog({
  encounter,
  patient,
  triggerLabel = 'রোগভিত্তিক প্রেসক্রিপশন টেমপ্লেট',
  compact = false,
}: {
  encounter: Encounter;
  patient: Patient;
  triggerLabel?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);
  const [selectedSubIdx, setSelectedSubIdx] = useState<number>(0);
  const [applied, setApplied] = useState(false);
  const [appliedCount, setAppliedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Edit Template Dialog state
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  // Load custom templates from Dexie
  const customTemplates = useLiveQuery(() => db.prescription_templates.toArray(), []) || [];

  // Patient age-based category detection
  const patientAge = patient?.age ?? 30;
  const recommendedAgeTag = useMemo(() => {
    if (patientAge < 1) return { key: 'infant', label: 'শিশু (< ১ বছর)' };
    if (patientAge <= 5) return { key: 'child', label: 'শিশু (১ - ৫ বছর)' };
    if (patientAge <= 12) return { key: 'adolescent', label: 'কিশোর (৬ - ১২ বছর)' };
    if (patientAge >= 60) return { key: 'elderly', label: 'বয়োজ্যেষ্ঠ (> ৬০ বছর)' };
    return { key: 'adult', label: 'পূর্ণবয়স্ক (১২+ বছর)' };
  }, [patientAge]);

  // Combine builtin groups with doctor custom templates
  const allDiseaseGroups = useMemo(() => {
    const groups: DiseaseGroupTemplateDef[] = [...BUILTIN_DISEASE_GROUPS];

    // Merge doctor's custom templates
    for (const ct of customTemplates) {
      const matchIdx = groups.findIndex(
        (g) => g.diseaseGroup.toLowerCase() === ct.disease_group.toLowerCase()
      );
      const subItem = {
        subId: ct.id,
        title: ct.title,
        titleBn: ct.title_bn || ct.title,
        ageGroup: ct.age_group,
        ageRangeLabel: ct.age_range_label || 'কাস্টম বয়স',
        diagnosis: ct.diagnosis || [],
        medicines: ct.medicines || [],
        advice: ct.advice || [],
        investigations: ct.investigations || [],
        isCustom: true,
      };

      if (matchIdx >= 0) {
        groups[matchIdx].subTemplates.unshift(subItem as any);
      } else {
        groups.push({
          id: `custom_${ct.id}`,
          systemCategory: ct.category || 'General',
          diseaseGroup: ct.disease_group,
          diseaseGroupBn: `${ct.disease_group} (কাস্টম)`,
          subTemplates: [subItem as any],
        });
      }
    }

    return groups;
  }, [customTemplates]);

  // Filter groups by system & search
  const filteredGroups = useMemo(() => {
    return allDiseaseGroups.filter((g) => {
      const matchSys = selectedSystem === 'All' || g.systemCategory.includes(selectedSystem.split(' ')[0]);
      if (!matchSys) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        g.diseaseGroup.toLowerCase().includes(q) ||
        g.diseaseGroupBn.toLowerCase().includes(q) ||
        g.subTemplates.some((st) => st.title.toLowerCase().includes(q) || st.titleBn.toLowerCase().includes(q))
      );
    });
  }, [allDiseaseGroups, selectedSystem, search]);

  const activeGroup = filteredGroups[selectedGroupIdx] || filteredGroups[0];
  const activeSub = activeGroup?.subTemplates[selectedSubIdx] || activeGroup?.subTemplates[0];

  const handleApply = async () => {
    if (!activeSub) return;
    setLoading(true);
    try {
      const tenantId = encounter.tenant_id;
      const now = new Date().toISOString();

      // 1. Add medicines to prescription_items table
      const itemsToInsert: PrescriptionItem[] = activeSub.medicines.map((m: TemplateMedicineItem) => ({
        id: generateUUID(),
        tenant_id: tenantId,
        patient_id: patient.id,
        encounter_id: encounter.id,
        brand_name: m.brand_name,
        generic_name: m.generic_name || '',
        dosage_form: (m.dosage_form as DosageForm) || 'Tab',
        strength: m.strength || '',
        schedule: m.schedule || '1+0+1',
        meal_timing: (m.meal_timing as MealTiming) || 'After Meal',
        duration: m.duration || '7 Days',
        special_instructions: m.special_instructions || '',
        created_at: now,
        updated_at: now,
        sync_status: 'pending',
      }));

      if (itemsToInsert.length > 0) {
        await db.prescription_items.bulkAdd(itemsToInsert);
      }

      // 2. Update encounter diagnosis & advice
      const currentDx = encounter.diagnosis || [];
      const newDx = Array.from(new Set([...currentDx, ...(activeSub.diagnosis || [activeGroup.diseaseGroup])]));
      const currentAdv = encounter.advice || [];
      const newAdv = Array.from(new Set([...currentAdv, ...(activeSub.advice || [])]));

      await db.encounters.update(encounter.id, {
        diagnosis: newDx,
        advice: newAdv,
        updated_at: now,
        sync_status: 'pending',
      });

      setAppliedCount(itemsToInsert.length);
      setApplied(true);
      setTimeout(() => {
        setApplied(false);
        setOpen(false);
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={
              compact
                ? 'h-8 px-2.5 gap-1 rounded-lg border-indigo-200 bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100 font-bold text-xs shadow-2xs'
                : 'h-9 gap-1.5 rounded-xl border-indigo-200 bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100/80 font-bold text-xs shadow-2xs'
            }
          >
            <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>{triggerLabel}</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-5xl max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-5 rounded-2xl bg-white border border-slate-200 shadow-2xl">
          <DialogHeader className="border-b border-slate-100 pb-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    সিস্টেম ও রোগভিত্তিক প্রেসক্রিপশন টেমপ্লেট
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    রোগীর বয়স ({patientAge} বছর) অনুযায়ী সাব-টেমপ্লেট নির্বাচন ও এডিট করার সুবিধা
                  </DialogDescription>
                </div>
              </div>
              <div className="relative w-56">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="রোগ সার্চ করুন (যেমন: Pneumonia)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </DialogHeader>

          {/* System Category Filter Pills */}
          <div className="flex gap-1 overflow-x-auto py-1.5 border-b border-slate-100 no-scrollbar">
            {DISEASE_SYSTEM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedSystem(cat);
                  setSelectedGroupIdx(0);
                  setSelectedSubIdx(0);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedSystem === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* 3-Column Split: Disease Group List -> Age Sub-templates -> Prescription Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 overflow-hidden pt-2 min-h-[420px]">
            {/* Left: Disease Groups */}
            <div className="md:col-span-4 overflow-y-auto space-y-1 pr-1 border-r border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                রোগের গ্রুপ ({filteredGroups.length}টি):
              </span>
              {filteredGroups.map((g, idx) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroupIdx(idx);
                    setSelectedSubIdx(0);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    selectedGroupIdx === idx
                      ? 'border-indigo-400 bg-indigo-50/80 text-indigo-950 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="text-xs font-bold truncate">{g.diseaseGroupBn}</div>
                    <div className="text-[10px] text-slate-500">{g.subTemplates.length}টি বয়স-ভিত্তিক সাব-টেমপ্লেট</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* Right: Sub-templates and Live Medicine Preview */}
            <div className="md:col-span-8 flex flex-col justify-between overflow-y-auto pl-1">
              {activeGroup && activeSub ? (
                <div className="space-y-3">
                  {/* Age Group Sub-Template Tabs */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">
                        {activeGroup.diseaseGroupBn} — বয়স অনুযায়ী নির্বাচন করুন:
                      </span>
                      {recommendedAgeTag && (
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          রোগীর বয়স অনুযায়ী প্রস্তাবিত: {recommendedAgeTag.label}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {activeGroup.subTemplates.map((sub, sIdx) => {
                        const isSelected = selectedSubIdx === sIdx;
                        const isMatch = sub.ageGroup === recommendedAgeTag.key;
                        return (
                          <button
                            key={sub.subId}
                            type="button"
                            onClick={() => setSelectedSubIdx(sIdx)}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                                : isMatch
                                ? 'bg-teal-50 text-teal-900 border-teal-300 font-bold'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {sub.ageRangeLabel}
                            {isMatch && !isSelected && ' ★'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Header with Edit Button */}
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-2.5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-indigo-950">{activeSub.titleBn}</h4>
                      <div className="text-[11px] text-slate-600">{activeSub.title}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTemplate({
                          ...activeSub,
                          category: activeGroup.systemCategory,
                          diseaseGroup: activeGroup.diseaseGroup,
                          tenantId: encounter.tenant_id,
                        })
                      }
                      className="text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 shadow-2xs transition-colors"
                      title="এই টেমপ্লেটটি এডিট ও কাস্টমাইজ করুন"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> এডিট করুন
                    </button>
                  </div>

                  {/* Medicines List */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      ওষুধের তালিকা ({activeSub.medicines.length}টি):
                    </span>
                    <div className="space-y-1.5">
                      {activeSub.medicines.map((m: TemplateMedicineItem, i: number) => (
                        <div
                          key={i}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-xs flex items-center justify-between shadow-2xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">
                              {m.dosage_form}. {m.brand_name} {m.strength}
                            </span>
                            {m.special_instructions && (
                              <div className="text-[10px] text-slate-500 mt-0.5">{m.special_instructions}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                              {m.schedule} ({m.meal_timing})
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{m.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice */}
                  {activeSub.advice && activeSub.advice.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                        রোগীর উপদেশ:
                      </span>
                      <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                        {activeSub.advice.map((adv: string, i: number) => (
                          <li key={i}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-400">কোনো টেমপ্লেট পাওয়া যায়নি।</div>
              )}

              {/* Apply Button */}
              <div className="pt-3 mt-2 border-t border-slate-200 flex justify-end">
                <Button
                  type="button"
                  disabled={loading || !activeSub}
                  onClick={handleApply}
                  className="h-9 px-5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  {applied ? (
                    <>
                      <Check className="h-4 w-4 mr-1 text-emerald-300" />
                      {appliedCount}টি ওষুধ প্রেসক্রিপশনে যুক্ত হয়েছে!
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1" />
                      ১-ক্লিকে প্রেসক্রিপশনে প্রয়োগ করুন
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      {editingTemplate && (
        <EditTemplateDialog
          open={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          template={editingTemplate}
        />
      )}
    </>
  );
}
