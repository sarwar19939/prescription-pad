'use client';

/**
 * RxPad: the numbered list of prescription lines for the active draft encounter.
 * Enhanced with AnimatedList and AnimatedListItem for smooth layout transitions,
 * plus 1-click unlisted custom medicine & preparation creation auto-saved to catalog.
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';

import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import { calculateSmartDose } from '@/services/dosingEngine';
import { getDrugGuideline } from '@/services/drugGuidelinesService';
import { toBengaliNumerals } from '@/lib/prescriptionFormatters';
import { MedicineSearch } from './medicine-search';
import { ProtocolTemplatesDialog } from './protocol-templates-dialog';
import { SaveAsTemplateDialog } from './save-as-template-dialog';
import { AddCustomMedicineDialog } from './add-custom-medicine-dialog';
import { RxRow } from './rx-row';
import { AnimatedList, AnimatedListItem } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import type { MedicineCatalog, Patient, PrescriptionItem } from '@/types/schema';

export function RxPad({ patient, encounterId }: { patient: Patient; encounterId: string }) {
  const [search, setSearch] = useState('');
  const [customMedOpen, setCustomMedOpen] = useState(false);
  const [customMedInitial, setCustomMedInitial] = useState('');

  const encounter = useLiveQuery(
    () => db.encounters.get(encounterId),
    [encounterId],
  );

  const items = useLiveQuery(
    async () => {
      const rows = await db.prescription_items
        .where('encounter_id')
        .equals(encounterId)
        .toArray();
      return rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
    },
    [encounterId],
  );

  const addItem = async (med: MedicineCatalog) => {
    const ts = new Date().toISOString();
    const brand = med.brand_name;
    const generic = med.generic_name;
    const form = med.dosage_form;
    const str = med.strength;

    // AI & Clinical Rule Auto-Dosing based on patient age, weight & live vitals
    const smart = calculateSmartDose(
      { brand_name: brand, generic_name: generic, dosage_form: form, strength: str },
      patient,
      encounter?.vitals,
    );

    // Synchronize MedEx patient administration guidelines (when & how to take)
    const guide = getDrugGuideline(brand || generic);

    const initialSchedule = smart.hasAdjustment && smart.schedule
      ? smart.schedule
      : (guide?.standardSchedule || '1+0+1');

    const initialMealTiming = smart.hasAdjustment && smart.meal_timing
      ? smart.meal_timing
      : (guide?.standardMealTiming || 'After Meal');

    const initialInstructions = smart.hasAdjustment && smart.special_instructions
      ? smart.special_instructions
      : '';

    const row: PrescriptionItem = {
      id: generateUUID(),
      tenant_id: patient.tenant_id,
      encounter_id: encounterId,
      patient_id: patient.id,
      brand_name: brand,
      generic_name: generic,
      dosage_form: smart.hasAdjustment && smart.dosage_form ? smart.dosage_form : form,
      strength: smart.hasAdjustment && smart.strength ? smart.strength : str,
      schedule: initialSchedule,
      meal_timing: initialMealTiming,
      duration: smart.hasAdjustment && smart.duration ? smart.duration : '7 Days',
      special_instructions: '',
      created_at: ts,
      updated_at: ts,
      sync_status: 'pending',
    };

    await db.prescription_items.put(row);
    setSearch('');
  };

  const removeItem = async (id: string) => {
    await db.prescription_items.delete(id);
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-teal-700">℞</span>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Prescription Pad</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setCustomMedInitial(search.trim());
              setCustomMedOpen(true);
            }}
            className="h-8 gap-1 rounded-lg border-teal-300 bg-teal-50/70 text-teal-900 hover:bg-teal-100 font-bold text-xs shadow-2xs transition-colors"
            title="লিস্টের বাইরের যেকোনো নতুন ওষুধ বা প্রিপারেশন যোগ করুন"
          >
            <Plus className="h-3.5 w-3.5 text-teal-700" />
            <span>+ নতুন ওষুধ / প্রিপারেশন</span>
          </Button>

          {encounter && (
            <ProtocolTemplatesDialog encounter={encounter} patient={patient} />
          )}

          {encounter && items && items.length > 0 && (
            <SaveAsTemplateDialog
              encounter={encounter}
              patient={patient}
              prescriptionItems={items}
            />
          )}

          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {items?.length || 0} {items?.length === 1 ? 'Medication' : 'Medications'}
          </span>
        </div>
      </div>

      {items === undefined && (
        <div className="flex h-24 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-hidden />
        </div>
      )}

      {/* 1. Prescribed Medicines List */}
      <AnimatedList className="flex flex-col gap-3">
        {(items ?? []).map((item, i) => (
          <AnimatedListItem key={item.id}>
            <RxRow
              item={item}
              patient={patient}
              vitals={encounter?.vitals}
              index={i}
              onRemove={(id) => void removeItem(id)}
            />
          </AnimatedListItem>
        ))}
      </AnimatedList>

      {/* 2. Active Next Medicine Search Row (Always placed below already prescribed medicines) */}
      <div className="rounded-2xl border-2 border-teal-300/80 bg-teal-50/25 p-3.5 shadow-2xs transition-all focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
        <div className="mb-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-teal-950">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white font-mono shadow-xs">
              {toBengaliNumerals((items?.length || 0) + 1)}
            </span>
            <span>
              {(items?.length || 0) === 0
                ? 'প্রথম ওষুধ নির্বাচন বা সার্চ করুন:'
                : `${toBengaliNumerals((items?.length || 0) + 1)} নম্বর ওষুধ নির্বাচন বা সার্চ করুন:`}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            ব্র্যান্ড বা জেনেরিক নাম লিখে Enter চাপুন
          </span>
        </div>
        <MedicineSearch
          value={search}
          onChange={setSearch}
          onPick={(med) => {
            if ('freeText' in med) {
              setCustomMedInitial(search.trim());
              setCustomMedOpen(true);
            } else {
              void addItem(med);
            }
          }}
          onCustomClick={(query) => {
            setCustomMedInitial(query);
            setCustomMedOpen(true);
          }}
          placeholder="ওষুধের ব্র্যান্ড (যেমন: Napa, Seclo, Maxpro...) বা জেনেরিক (যেমন: Paracetamol) লিখুন..."
        />
      </div>

      {/* Add Custom Medicine Modal */}
      {customMedOpen && (
        <AddCustomMedicineDialog
          open={customMedOpen}
          onClose={() => {
            setCustomMedOpen(false);
            setSearch('');
          }}
          initialBrand={customMedInitial}
          encounterId={encounterId}
          patient={patient}
          onAdded={() => setSearch('')}
        />
      )}
    </section>
  );
}
