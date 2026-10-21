/**
 * MedRecord — MedEx Bangladesh Pharmaceutical Database Importer.
 *
 * Imports 21,000+ verified Bangladeshi medicines (Square, Beximco, Incepta,
 * Renata, Acme, Opsonin, Eskayef, etc.) from /data/medex-medicines.json
 * into local Dexie.js IndexedDB with 0ms offline query speed.
 */
import { db } from '@/db/localDb';
import type { DosageForm, MedicineCatalog } from '@/types/schema';

export interface RawMedexItem {
  brand_name: string;
  generic_name: string;
  dosage_form: DosageForm;
  strength: string;
  manufacturer: string;
}

const BATCH_SIZE = 500;

/**
 * Fetches the raw MedEx medicines dataset from /data/medex-medicines.json.
 */
export async function fetchMedexDataset(): Promise<RawMedexItem[]> {
  const res = await fetch('/data/medex-medicines.json');
  if (!res.ok) {
    throw new Error(`Failed to load MedEx database file (${res.status})`);
  }
  return res.json() as Promise<RawMedexItem[]>;
}

/**
 * Imports the entire MedEx Bangladesh catalog into Dexie IndexedDB in optimized batches.
 */
export async function importMedexIntoDexie(
  tenantId: string,
  onProgress?: (imported: number, total: number, percent: number) => void,
): Promise<number> {
  const items = await fetchMedexDataset();
  const total = items.length;
  const ts = new Date().toISOString();
  let count = 0;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const records: MedicineCatalog[] = batch.map((item) => ({
      id: crypto.randomUUID(),
      tenant_id: tenantId,
      brand_name: item.brand_name,
      generic_name: item.generic_name,
      dosage_form: item.dosage_form,
      strength: item.strength,
      manufacturer: item.manufacturer,
      contraindications: [],
      sync_status: 'synced',
      created_at: ts,
      updated_at: ts,
    }));

    await db.medicine_catalog.bulkPut(records);
    count += records.length;
    if (onProgress) {
      onProgress(count, total, Math.round((count / total) * 100));
    }
  }

  return count;
}
