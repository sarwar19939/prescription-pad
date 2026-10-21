/**
 * "Copy Rx to Today" — clones a past encounter's prescription items into the
 * patient's active draft encounter for today. Offline-first: everything is
 * local Dexie writes with freshly generated UUIDs and sync_status 'pending'.
 */
import { format } from 'date-fns';

import { db } from '@/db/localDb';
import type { Encounter, Patient, PrescriptionItem } from '@/types/schema';

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export async function findTodayEncounter(patientId: string): Promise<Encounter | undefined> {
  const today = todayKey();
  return db.encounters
    .where('patient_id')
    .equals(patientId)
    .and((e) => e.visit_date === today)
    .first();
}

export function buildDraftEncounter(patient: Patient): Encounter {
  const ts = new Date().toISOString();
  const today = todayKey();
  return {
    id: crypto.randomUUID(),
    tenant_id: patient.tenant_id,
    patient_id: patient.id,
    visit_date: today,
    chief_complaints: [],
    vitals: { bp: '', pulse: '', temp: '', weight: '', spo2: '' },
    clinical_findings: '',
    diagnosis: [],
    advice: [],
    follow_up_date: null,
    ai_suggested_notes: null,
    created_at: ts,
    updated_at: ts,
    sync_status: 'pending',
  };
}

export async function ensureTodayEncounter(patient: Patient): Promise<Encounter> {
  const existing = await findTodayEncounter(patient.id);
  if (existing) return existing;
  const draft = buildDraftEncounter(patient);
  await db.encounters.put(draft);
  return draft;
}

export interface CopyRxResult {
  todayEncounter: Encounter;
  copied: number;
  sourceEncounter: Encounter | undefined;
}

/**
 * Copies every PrescriptionItem from `sourceEncounterId` into today's draft
 * encounter for the same patient. Items already present today (same
 * brand + strength + form) are skipped to avoid duplicate rows.
 */
export async function copyRxToToday(
  patient: Patient,
  sourceEncounterId: string,
): Promise<CopyRxResult | null> {
  const source = await db.encounters.get(sourceEncounterId);
  if (!source || source.patient_id !== patient.id) return null;

  const todayEncounter = await ensureTodayEncounter(patient);
  const sourceItems = await db.prescription_items
    .where('encounter_id')
    .equals(sourceEncounterId)
    .toArray();
  const currentItems = await db.prescription_items
    .where('encounter_id')
    .equals(todayEncounter.id)
    .toArray();

  const keyOf = (i: PrescriptionItem) => `${i.brand_name}|${i.strength}|${i.dosage_form}`;
  const present = new Set(currentItems.map(keyOf));

  const clones: PrescriptionItem[] = [];
  for (const item of sourceItems) {
    if (present.has(keyOf(item))) continue;
    const ts = new Date().toISOString();
    clones.push({
      ...item,
      id: crypto.randomUUID(),
      encounter_id: todayEncounter.id,
      created_at: ts,
      updated_at: ts,
      sync_status: 'pending',
    });
    present.add(keyOf(item));
  }
  if (clones.length) await db.prescription_items.bulkPut(clones);
  return { todayEncounter, copied: clones.length, sourceEncounter: source };
}
