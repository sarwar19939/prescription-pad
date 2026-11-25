/**
 * MedRecord — MedEx Bangladesh Pharmaceutical Database Importer & Maintenance.
 *
 * Imports 23,600+ verified Bangladeshi medicines (Square, Beximco, Incepta,
 * Renata, Acme, Opsonin, Eskayef, etc.) including complementary Cap & Tab forms
 * from /data/medex-medicines.json into local Dexie.js IndexedDB with 0ms offline speed.
 * Safely preserves doctor-added custom medicines while purging duplicate imports.
 */
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import { DEFAULT_TENANT_ID } from '@/db/seedData';
import type { DosageForm, MedicineCatalog } from '@/types/schema';

export interface RawMedexItem {
  brand_name: string;
  generic_name: string;
  dosage_form: DosageForm;
  strength: string;
  manufacturer: string;
}

const BATCH_SIZE = 1000;
let seedingPromise: Promise<number> | null = null;

export function isCustomMedicine(m: MedicineCatalog): boolean {
  return m.sync_status === 'pending' || (m.manufacturer || '').toLowerCase().includes('custom');
}

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
 * Imports MedEx Bangladesh catalog into Dexie IndexedDB.
 * Safely preserves any custom medicines added by the doctor.
 */
export async function importMedexIntoDexie(
  tenantId: string,
  onProgress?: (imported: number, total: number, percent: number) => void,
  replaceExisting = true,
): Promise<number> {
  const items = await fetchMedexDataset();
  const total = items.length;
  const ts = new Date().toISOString();

  if (replaceExisting) {
    // Delete only synced MedEx records, PRESERVING any custom medicines created by the doctor!
    await db.medicine_catalog
      .where('tenant_id')
      .equals(tenantId)
      .filter((m) => !isCustomMedicine(m))
      .delete();

    if (tenantId !== DEFAULT_TENANT_ID) {
      await db.medicine_catalog
        .where('tenant_id')
        .equals(DEFAULT_TENANT_ID)
        .filter((m) => !isCustomMedicine(m))
        .delete();
    }
  }

  let count = 0;
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const records: MedicineCatalog[] = batch.map((item) => ({
      id: generateUUID(),
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

/**
 * Deduplicates the medicine catalog in Dexie IndexedDB.
 * Retains only one canonical copy per unique (brand_name, strength, dosage_form, manufacturer).
 * Custom medicines added by doctors are prioritized and NEVER lost.
 */
export async function deduplicateMedicineCatalog(
  tenantId: string,
  onProgress?: (processed: number, removed: number) => void,
): Promise<{ removed: number; remaining: number }> {
  const allMeds = await db.medicine_catalog.toArray();
  if (allMeds.length === 0) {
    return { removed: 0, remaining: 0 };
  }

  // Sorting priority:
  // 1. Doctor's custom-added medicines ALWAYS come first!
  // 2. Active tenant's records come next.
  // 3. Duplicate or legacy tenant records come last.
  allMeds.sort((a, b) => {
    const aCustom = isCustomMedicine(a);
    const bCustom = isCustomMedicine(b);
    if (aCustom && !bCustom) return -1;
    if (!aCustom && bCustom) return 1;

    if (a.tenant_id === tenantId && b.tenant_id !== tenantId) return -1;
    if (b.tenant_id === tenantId && a.tenant_id !== tenantId) return 1;
    return 0;
  });

  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const needTenantUpdate: MedicineCatalog[] = [];

  for (const m of allMeds) {
    const brand = (m.brand_name || '').trim().toLowerCase();
    const strength = (m.strength || '').trim().toLowerCase();
    const form = (m.dosage_form || '').trim().toLowerCase();
    const mfg = (m.manufacturer || '').trim().toLowerCase();
    const key = `${brand}|${strength}|${form}|${mfg}`;

    if (seen.has(key)) {
      // Never delete a custom doctor medicine if a duplicate exists; only delete the non-custom copy
      if (!isCustomMedicine(m)) {
        duplicateIds.push(m.id);
      }
    } else {
      seen.add(key);
      if (m.tenant_id !== tenantId && !isCustomMedicine(m)) {
        needTenantUpdate.push({
          ...m,
          tenant_id: tenantId,
        });
      }
    }
  }

  // Delete duplicate records in chunks
  const CHUNK_SIZE = 5000;
  for (let i = 0; i < duplicateIds.length; i += CHUNK_SIZE) {
    const chunk = duplicateIds.slice(i, i + CHUNK_SIZE);
    await db.medicine_catalog.bulkDelete(chunk);
    if (onProgress) {
      onProgress(Math.min(i + CHUNK_SIZE, duplicateIds.length), duplicateIds.length);
    }
  }

  // Re-assign remaining records to active tenant in chunks
  if (needTenantUpdate.length > 0) {
    for (let i = 0; i < needTenantUpdate.length; i += CHUNK_SIZE) {
      const chunk = needTenantUpdate.slice(i, i + CHUNK_SIZE);
      await db.medicine_catalog.bulkPut(chunk);
    }
  }

  const remaining = await db.medicine_catalog.count();
  return { removed: duplicateIds.length, remaining };
}

/**
 * Ensures MedEx Bangladesh dataset is populated in the background on startup.
 * Automatically deduplicates if bloated by duplicate uploads (> 30,000 items) or seeds if empty.
 */
export async function ensureMedexSeeded(tenantId: string): Promise<number> {
  const totalInDb = await db.medicine_catalog.count();

  // If duplicate batch uploads occurred (> 30,000 records), auto-deduplicate
  if (totalInDb > 30000) {
    console.info(`[MedEx] Detected duplicate uploaded batches (${totalInDb} records). Auto-deduplicating...`);
    const { removed, remaining } = await deduplicateMedicineCatalog(tenantId);
    console.info(`[MedEx] Deduplication complete: removed ${removed} duplicates, ${remaining} remaining.`);
    return remaining;
  }

  const tenantCount = await db.medicine_catalog.where('tenant_id').equals(tenantId).count();
  if (tenantCount >= 23000) return tenantCount;

  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    try {
      return await importMedexIntoDexie(tenantId, undefined, true);
    } catch (err) {
      console.warn('Auto MedEx background seeding deferred:', err);
      return tenantCount;
    } finally {
      seedingPromise = null;
    }
  })();

  return seedingPromise;
}
