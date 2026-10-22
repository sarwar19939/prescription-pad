/**
 * Clinical Disease Protocol & Prescription Template Service.
 * Matches patient diagnosis with evidence-based disease protocols,
 * automatically adapts dosing by age and weight, and inserts them into Dexie.
 */
import { db } from '@/db/localDb';
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
 */
export function matchProtocolsForDiagnosis(diagnoses: string[]): DiseaseProtocolTemplate[] {
  if (!diagnoses || diagnoses.length === 0) return [];
  const cleanDiagnoses = diagnoses.map((d) => d.toLowerCase().trim()).filter(Boolean);

  const matched: DiseaseProtocolTemplate[] = [];
  const seenIds = new Set<string>();

  for (const diag of cleanDiagnoses) {
    for (const proto of DISEASE_PROTOCOL_TEMPLATES) {
      if (seenIds.has(proto.id)) continue;
      const hasMatch = proto.diagnosisMatch.some(
        (key) => diag.includes(key) || key.includes(diag),
      );
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
  const isPediatric = patient.age < 12 || (weightKg !== null && weightKg <= 35);
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
    id: crypto.randomUUID(),
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

/**
 * Applies a protocol template to the encounter:
 * 1. Bulk adds age/weight adapted medicines into prescription_items.
 * 2. Merges protocol clinical advice into the encounter advice array.
 */
export async function applyProtocolToEncounter(
  encounterId: string,
  template: DiseaseProtocolTemplate,
  patient: Patient,
  vitals?: Partial<Vitals> | null,
): Promise<{ medicinesCount: number; adviceCount: number }> {
  const weightKg = parseWeight(vitals);

  const items: PrescriptionItem[] = template.medicines.map((med) =>
    adaptMedicineForPatient(med, patient, encounterId, weightKg),
  );

  // 1. Insert medicines into Dexie
  if (items.length > 0) {
    await db.prescription_items.bulkPut(items);
  }

  // 2. Merge advice into encounter
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

  return { medicinesCount: items.length, adviceCount: template.adviceBn.length };
}

export { DISEASE_PROTOCOL_TEMPLATES };
