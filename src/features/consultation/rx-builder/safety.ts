/**
 * Real-time allergy & contraindication check for each Rx row.
 * Compares a medicine's brand/generic names and catalog contraindications
 * against the patient's recorded allergies and chronic conditions.
 */
import type { MedicineCatalog, Patient } from '@/types/schema';

export interface SafetyWarning {
  severity: 'red' | 'yellow';
  message: string;
}

const WORD_RE = /[a-z0-9]+/g;

function words(text: string): Set<string> {
  const out = new Set<string>();
  for (const w of text.toLowerCase().match(WORD_RE) ?? []) {
    out.add(w);
    // singularize cheap trailing 's' so "steroids" matches "steroid"
    if (w.endsWith('s') && w.length > 3) out.add(w.slice(0, -1));
  }
  return out;
}

/** Direct token overlap to catch e.g. generic "Amoxicillin" vs allergy "Amox". */
function overlaps(a: string, b: string): boolean {
  const setB = words(b);
  for (const w of words(a)) {
    if (setB.has(w)) return true;
  }
  return false;
}

export function checkMedicine(
  item: { brand_name: string; generic_name: string; contraindications?: string[] },
  patient: Patient,
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  for (const allergy of patient.allergies) {
    if (overlaps(allergy, item.generic_name) || overlaps(allergy, item.brand_name)) {
      warnings.push({
        severity: 'red',
        message: `ALLERGY RISK: patient is allergic to “${allergy}” — medicine is “${item.brand_name} ${item.generic_name}”.`,
      });
    }
  }

  const conditions = patient.chronic_conditions;
  for (const contra of item.contraindications ?? []) {
    for (const condition of conditions) {
      if (overlaps(contra, condition)) {
        warnings.push({
          severity: 'yellow',
          message: `CAUTION: “${contra}” may conflict with chronic condition “${condition}”.`,
        });
      }
    }
  }

  return warnings;
}

export function checkMedicineWithCatalog(
  row: { brand_name: string; generic_name: string },
  patient: Patient,
  catalogEntry: MedicineCatalog | undefined,
): SafetyWarning[] {
  return checkMedicine(
    {
      brand_name: row.brand_name,
      generic_name: row.generic_name,
      contraindications: catalogEntry?.contraindications,
    },
    patient,
  );
}
