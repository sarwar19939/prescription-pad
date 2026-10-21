/**
 * MedRecord — One-Click Local Database Backup & Restore Service.
 *
 * Provides doctors with instant, self-sovereign offline data protection:
 * - Export: dumps all Dexie tables into a timestamped JSON file (clinic-backup-YYYY-MM-DD.json).
 * - Restore: parses, validates, and safely bulk-restores records into Dexie.js.
 */
import { format } from 'date-fns';

import { db, TABLE_NAMES } from '@/db/localDb';
import { getCurrentTenantId } from './auth';
import type {
  Encounter,
  InvestigationReport,
  MedicineCatalog,
  Patient,
  PrescriptionItem,
  Tenant,
} from '@/types/schema';

export interface DatabaseBackupPayload {
  version: number;
  appName: 'MedRecord';
  exportDate: string;
  tenantId: string;
  summary: Record<string, number>;
  data: {
    tenants: Tenant[];
    patients: Patient[];
    encounters: Encounter[];
    prescription_items: PrescriptionItem[];
    investigation_reports: Array<Omit<InvestigationReport, 'local_file_blob'>>;
    medicine_catalog: MedicineCatalog[];
  };
}

export interface RestoreResult {
  success: boolean;
  restoredCounts: Record<string, number>;
  error?: string;
}

/**
 * Dumps all clinic records from IndexedDB and triggers a .json download in the browser.
 */
export async function exportDatabaseBackup(): Promise<string> {
  const tenantId = getCurrentTenantId();
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const filename = `clinic-backup-${dateStr}.json`;

  const [tenants, patients, encounters, prescription_items, reportsRaw, medicine_catalog] =
    await Promise.all([
      db.tenants.toArray(),
      db.patients.toArray(),
      db.encounters.toArray(),
      db.prescription_items.toArray(),
      db.investigation_reports.toArray(),
      db.medicine_catalog.toArray(),
    ]);

  // Strip non-serializable Blobs for clean JSON portability
  const investigation_reports = reportsRaw.map((r) => {
    const { local_file_blob, ...rest } = r;
    return rest;
  });

  const payload: DatabaseBackupPayload = {
    version: 1,
    appName: 'MedRecord',
    exportDate: new Date().toISOString(),
    tenantId,
    summary: {
      tenants: tenants.length,
      patients: patients.length,
      encounters: encounters.length,
      prescription_items: prescription_items.length,
      investigation_reports: investigation_reports.length,
      medicine_catalog: medicine_catalog.length,
    },
    data: {
      tenants,
      patients,
      encounters,
      prescription_items,
      investigation_reports,
      medicine_catalog,
    },
  };

  const jsonBlob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(jsonBlob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Validates and restores clinic records from an uploaded JSON backup file.
 */
export async function restoreDatabaseFromJSON(jsonText: string): Promise<RestoreResult> {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      success: false,
      restoredCounts: {},
      error: 'Invalid JSON file: file content could not be parsed.',
    };
  }

  if (!parsed || parsed.appName !== 'MedRecord' || !parsed.data) {
    return {
      success: false,
      restoredCounts: {},
      error: 'Invalid backup file: missing MedRecord schema signature.',
    };
  }

  const { data } = parsed as DatabaseBackupPayload;
  const restoredCounts: Record<string, number> = {};

  try {
    await db.transaction('rw', TABLE_NAMES.map((t) => db[t]), async () => {
      if (Array.isArray(data.tenants) && data.tenants.length > 0) {
        await db.tenants.bulkPut(data.tenants);
        restoredCounts.tenants = data.tenants.length;
      }
      if (Array.isArray(data.patients) && data.patients.length > 0) {
        await db.patients.bulkPut(data.patients);
        restoredCounts.patients = data.patients.length;
      }
      if (Array.isArray(data.encounters) && data.encounters.length > 0) {
        await db.encounters.bulkPut(data.encounters);
        restoredCounts.encounters = data.encounters.length;
      }
      if (Array.isArray(data.prescription_items) && data.prescription_items.length > 0) {
        await db.prescription_items.bulkPut(data.prescription_items);
        restoredCounts.prescription_items = data.prescription_items.length;
      }
      if (Array.isArray(data.investigation_reports) && data.investigation_reports.length > 0) {
        await db.investigation_reports.bulkPut(data.investigation_reports);
        restoredCounts.investigation_reports = data.investigation_reports.length;
      }
      if (Array.isArray(data.medicine_catalog) && data.medicine_catalog.length > 0) {
        await db.medicine_catalog.bulkPut(data.medicine_catalog);
        restoredCounts.medicine_catalog = data.medicine_catalog.length;
      }
    });

    return {
      success: true,
      restoredCounts,
    };
  } catch (err) {
    return {
      success: false,
      restoredCounts,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
