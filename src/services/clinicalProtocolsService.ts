/**
 * Clinical Disease Protocol & Prescription Template Service.
 * Matches patient diagnosis with evidence-based disease protocols,
 * automatically adapts dosing by age and weight, and inserts them into Dexie.
 */
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import type { Patient, PrescriptionItem, Vitals } from '@/types/schema';
import {
  DISEASE_PROTOCOL_TEMPLATES,
  type DiseaseProtocolTemplate,
  type ProtocolMedicineDef,
} from './protocolTemplatesData';

function parseWeight(vitals?: Partial<Vitals> | null): number | null {
  if (!vitals?.weight) return null;
  const match = String(vitals.weight).match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}

/**
 * Searches for protocols matching any diagnosis string entered by the doctor.
 * Safe against casing, leading/trailing whitespace, and multi-word phrases.
 */
export function matchProtocolsForDiagnosis(diagnoses?: string[] | null): DiseaseProtocolTemplate[] {
  if (!diagnoses || !Array.isArray(diagnoses) || diagnoses.length === 0) return [];
  const cleanDiagnoses = diagnoses.map((d) => String(d).toLowerCase().trim()).filter((d) => d.length > 0);

  const matched: DiseaseProtocolTemplate[] = [];
  const seenIds = new Set<string>();

  for (const diag of cleanDiagnoses) {
    for (const proto of DISEASE_PROTOCOL_TEMPLATES) {
      if (seenIds.has(proto.id)) continue;
      const hasMatch = proto.diagnosisMatch.some((key) => {
        const k = key.toLowerCase();
        return diag === k || diag.includes(k) || (diag.length >= 4 && k.includes(diag));
      });
      if (hasMatch) {
        matched.push(proto);
        seenIds.add(proto.id);
      }
    }
  }

  return matched;
}

/**
 * Converts a medicine definition into an age- and weight-calibrated prescription item.
 */
export function adaptMedicineForPatient(
  med: ProtocolMedicineDef,
  patient: Patient,
  encounterId: string,
  weightKg: number | null,
): PrescriptionItem {
  const patientAge = patient?.age ?? 30;
  const isPediatric = patientAge < 12;
  const usePed = isPediatric && med.pediatric ? med.pediatric : med.adult;

  let finalStrength = usePed.strength;
  let finalSchedule = usePed.schedule;
  let finalInstructions = usePed.special_instructions;

  // Weight-based calculation for pediatric liquid dosing
  if (isPediatric && med.pediatric?.perKgDoseMg && weightKg !== null && med.pediatric.concentrationMgPerMl) {
    const doseMg = Math.round(weightKg * med.pediatric.perKgDoseMg);
    const ml = Math.round((doseMg / med.pediatric.concentrationMgPerMl) * 10) / 10;
    finalStrength = `${med.pediatric.concentrationMgPerMl * 5}mg/5ml`;
    finalInstructions = `ওজনভিত্তিক মাত্রা (${weightKg} কেজি): প্রতিবারে ~${ml} মিলি (${doseMg} মি.গ্রা.)`;
  }

  const ts = new Date().toISOString();

  return {
    id: generateUUID(),
    tenant_id: patient.tenant_id,
    encounter_id: encounterId,
    patient_id: patient.id,
    brand_name: med.brand_name,
    generic_name: med.generic_name,
    dosage_form: usePed.dosage_form,
    strength: finalStrength,
    schedule: finalSchedule,
    meal_timing: usePed.meal_timing,
    duration: usePed.duration,
    special_instructions: finalInstructions,
    created_at: ts,
    updated_at: ts,
    sync_status: 'pending',
  };
}

export interface ApplyProtocolResult {
  medicinesCount: number;
  adviceCount: number;
  alreadyPrescribed: number;
}

/**
 * Applies a protocol template to the encounter:
 * 1. Safely checks for duplicate medications already prescribed.
 * 2. Bulk adds age/weight adapted medicines into prescription_items.
 * 3. Merges protocol clinical advice into the encounter advice array.
 */
export async function applyProtocolToEncounter(
  encounterId: string,
  template: DiseaseProtocolTemplate,
  patient: Patient,
  vitals?: Partial<Vitals> | null,
): Promise<ApplyProtocolResult> {
  const weightKg = parseWeight(vitals);

  // Avoid duplicate lines for the same brand in this encounter
  const existingItems = await db.prescription_items
    .where('encounter_id')
    .equals(encounterId)
    .toArray();

  const existingKeys = new Set(
    existingItems.map((i) => `${i.brand_name.toLowerCase().trim()}|${i.dosage_form.toLowerCase().trim()}`),
  );

  const itemsToAdd: PrescriptionItem[] = [];
  let skipped = 0;

  for (const med of template.medicines) {
    const isPediatric = (patient?.age ?? 30) < 12 || (weightKg !== null && weightKg <= 35);
    const usePed = isPediatric && med.pediatric ? med.pediatric : med.adult;
    const key = `${med.brand_name.toLowerCase().trim()}|${usePed.dosage_form.toLowerCase().trim()}`;
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }
    const item = adaptMedicineForPatient(med, patient, encounterId, weightKg);
    itemsToAdd.push(item);
    existingKeys.add(key);
  }

  // 1. Insert newly adapted medicines into Dexie
  if (itemsToAdd.length > 0) {
    await db.prescription_items.bulkPut(itemsToAdd);
  }

  // 2. Merge clinical advice into encounter
  const encounter = await db.encounters.get(encounterId);
  if (encounter) {
    const existingAdvice = new Set(encounter.advice || []);
    for (const adv of template.adviceBn) {
      existingAdvice.add(adv);
    }
    await db.encounters.update(encounterId, {
      advice: Array.from(existingAdvice),
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  }

  return {
    medicinesCount: itemsToAdd.length,
    adviceCount: template.adviceBn.length,
    alreadyPrescribed: skipped,
  };
}

export { DISEASE_PROTOCOL_TEMPLATES };
