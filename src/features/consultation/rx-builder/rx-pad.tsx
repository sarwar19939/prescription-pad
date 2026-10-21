'use client';

/**
 * RxPad: the numbered list of prescription lines for the active draft encounter.
 * Enhanced with AnimatedList and AnimatedListItem for smooth layout transitions.
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';

import { db } from '@/db/localDb';
import { MedicineSearch } from './medicine-search';
import { RxRow } from './rx-row';
import { AnimatedList, AnimatedListItem } from '@/components/ui/motion';
import type { MedicineCatalog, Patient, PrescriptionItem } from '@/types/schema';

export function RxPad({ patient, encounterId }: { patient: Patient; encounterId: string }) {
  const [search, setSearch] = useState('');
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

  const addItem = async (med: MedicineCatalog | { freeText: true }) => {
    const ts = new Date().toISOString();
    const row: PrescriptionItem = {
      id: crypto.randomUUID(),
      tenant_id: patient.tenant_id,
      encounter_id: encounterId,
      patient_id: patient.id,
      brand_name: 'freeText' in med ? (search.trim() || 'New Medicine') : med.brand_name,
      generic_name: 'freeText' in med ? '' : med.generic_name,
      dosage_form: 'freeText' in med ? 'Tab' : med.dosage_form,
      strength: 'freeText' in med ? '' : med.strength,
      schedule: '1+0+1',
      meal_timing: 'After Meal',
      duration: '7 Days',
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
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-teal-700">℞</span>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Prescription Pad</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {items?.length || 0} {items?.length === 1 ? 'Medication' : 'Medications'}
        </span>
      </div>

      <MedicineSearch
        value={search}
        onChange={setSearch}
        onPick={(med) => void addItem(med as MedicineCatalog | { freeText: true })}
        placeholder="Type brand name (Napa, Seclo, Maxpro...) or generic to add..."
      />

      {items === undefined && (
        <div className="flex h-24 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-hidden />
        </div>
      )}

      {items !== undefined && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">No medications prescribed yet.</p>
          <p className="text-xs text-slate-400">
            Search from 21,000+ MedEx drugs above, use AI Co-Pilot suggestions, or copy from a past visit.
          </p>
        </div>
      )}

      <AnimatedList className="flex flex-col gap-3">
        {(items ?? []).map((item, i) => (
          <AnimatedListItem key={item.id}>
            <RxRow item={item} patient={patient} index={i} onRemove={(id) => void removeItem(id)} />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </section>
  );
}
