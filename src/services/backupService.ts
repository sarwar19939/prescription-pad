/**
 * MedRecord — Offline-First Database Backup & Disaster Recovery.
 *
 * Provides single-click offline JSON export and schema-validated restore for IndexedDB.
 * Enforces strict multi-tenant isolation: only the active doctor's records are exported
 * or restored to prevent data leakage.
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
  summary: {
    tenants: number;
    patients: number;
    encounters: number;
    prescription_items: number;
    investigation_reports: number;
    medicine_catalog: number;
  };
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
 * Dumps all clinic records for the ACTIVE TENANT from IndexedDB and triggers a .json download.
 */
export async function exportDatabaseBackup(): Promise<string> {
  const tenantId = getCurrentTenantId();
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const filename = `clinic-backup-${dateStr}.json`;

  const [tenants, patients, encounters, prescription_items, reportsRaw, medicine_catalog] =
    await Promise.all([
      db.tenants.where('id').equals(tenantId).or('tenant_id').equals(tenantId).toArray(),
      db.patients.where('tenant_id').equals(tenantId).toArray(),
      db.encounters.where('tenant_id').equals(tenantId).toArray(),
      db.prescription_items.where('tenant_id').equals(tenantId).toArray(),
      db.investigation_reports.where('tenant_id').equals(tenantId).toArray(),
      db.medicine_catalog.where('tenant_id').equals(tenantId).toArray(),
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
 * Safely scopes restored records to the current active tenant.
 */
export async function restoreDatabaseFromJSON(jsonText: string): Promise<RestoreResult> {
  const currentTenantId = getCurrentTenantId();
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
      // 1. Tenants (update current tenant details if matching)
      if (Array.isArray(data.tenants) && data.tenants.length > 0) {
        const scopedTenants = data.tenants.map((t) => ({
          ...t,
          id: currentTenantId,
          tenant_id: currentTenantId,
        }));
        await db.tenants.bulkPut(scopedTenants);
        restoredCounts.tenants = scopedTenants.length;
      }

      // 2. Patients (ensure tenant_id belongs to current session)
      if (Array.isArray(data.patients) && data.patients.length > 0) {
        const scopedPatients = data.patients.map((p) => ({
          ...p,
          tenant_id: currentTenantId,
        }));
        await db.patients.bulkPut(scopedPatients);
        restoredCounts.patients = scopedPatients.length;
      }

      // 3. Encounters
      if (Array.isArray(data.encounters) && data.encounters.length > 0) {
        const scopedEncounters = data.encounters.map((e) => ({
          ...e,
          tenant_id: currentTenantId,
        }));
        await db.encounters.bulkPut(scopedEncounters);
        restoredCounts.encounters = scopedEncounters.length;
      }

      // 4. Prescription Items
      if (Array.isArray(data.prescription_items) && data.prescription_items.length > 0) {
        const scopedRx = data.prescription_items.map((r) => ({
          ...r,
          tenant_id: currentTenantId,
        }));
        await db.prescription_items.bulkPut(scopedRx);
        restoredCounts.prescription_items = scopedRx.length;
      }

      // 5. Investigation Reports
      if (Array.isArray(data.investigation_reports) && data.investigation_reports.length > 0) {
        const scopedReports = data.investigation_reports.map((r) => ({
          ...r,
          tenant_id: currentTenantId,
        }));
        await db.investigation_reports.bulkPut(scopedReports);
        restoredCounts.investigation_reports = scopedReports.length;
      }

      // 6. Medicine Catalog
      if (Array.isArray(data.medicine_catalog) && data.medicine_catalog.length > 0) {
        const scopedMeds = data.medicine_catalog.map((m) => ({
          ...m,
          tenant_id: currentTenantId,
        }));
        await db.medicine_catalog.bulkPut(scopedMeds);
        restoredCounts.medicine_catalog = scopedMeds.length;
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
