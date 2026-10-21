'use client';

/**
 * RxPad: the numbered list of prescription lines for the active draft
 * encounter. Medicine search hits the local Dexie catalog instantly; a row
 * is created in Dexie the moment a medicine is picked (offline-first).
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { db } from '@/db/localDb';
import { MedicineSearch } from './medicine-search';
import { RxRow } from './rx-row';
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
      schedule: '',
      meal_timing: 'Anytime',
      duration: '',
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
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">
          <span className="mr-1 font-serif text-lg text-emerald-800">℞</span> Prescription
        </h3>
        <span className="text-[10px] uppercase tracking-wide text-neutral-400">
          local-first · autosave
        </span>
      </div>

      <MedicineSearch
        value={search}
        onChange={setSearch}
        onPick={(med) => void addItem(med as MedicineCatalog | { freeText: true })}
        placeholder="Search catalog to add, or type brand + Enter"
      />

      {items === undefined && <Loader2 className="mx-auto h-5 w-5 animate-spin text-neutral-400" aria-hidden />}
      {items !== undefined && items.length === 0 && (
        <p className="rounded-md border border-dashed border-neutral-300 p-3 text-xs text-neutral-500">
          No medicines on today&apos;s pad yet. Search above to add — or expand a past visit
          and use “Copy Rx to Today”.
        </p>
      )}
      <ol className="flex flex-col gap-2">
        {(items ?? []).map((item, i) => (
          <li key={item.id}>
            <RxRow item={item} patient={patient} index={i} onRemove={(id) => void removeItem(id)} />
          </li>
        ))}
      </ol>
      {items !== undefined && items.length > 0 && (
        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
          <Trash2 className="h-3 w-3" aria-hidden /> Remove a line with the trash icon.
          <Plus className="ml-2 h-3 w-3" aria-hidden /> Add more with the search box.
        </div>
      )}
    </section>
  );
}
