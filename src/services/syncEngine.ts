/**
 * MedRecord — Bidirectional Offline-to-Cloud Sync Engine.
 *
 * Synchronizes local Dexie.js (IndexedDB) with Supabase (PostgreSQL).
 * - Push: drains pending local records to Supabase using upsert.
 * - Pull: downloads remote changes since last_sync_timestamp with conflict resolution.
 * - Conflict resolution: local 'pending' records with newer timestamps take priority.
 */
import { db } from '@/db/localDb';
import { getSupabaseClient } from '@/db/supabase';
import { getCurrentTenantId } from './auth';
import type {
  Encounter,
  InvestigationReport,
  Patient,
  PrescriptionItem,
  PrescriptionTemplate,
  Tenant,
} from '@/types/schema';
import {
  FIVE_MINUTES_MS,
  getLastSyncTimestamp,
  setLastSyncTimestamp,
  type SyncResult,
} from './syncTypes';

export * from './syncTypes';

let isSyncRunning = false;
let syncIntervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<(result: SyncResult | { syncing: boolean }) => void>();

export function subscribeSyncState(fn: (state: any) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(data: any) {
  listeners.forEach((l) => l(data));
}

/**
 * Merges pulled remote records into local Dexie while respecting local pending changes.
 */
async function mergeRemoteRecords<T extends { id: string; updated_at?: string; sync_status?: any }>(
  table: any,
  remoteRecords: T[],
): Promise<number> {
  if (!remoteRecords || remoteRecords.length === 0) return 0;

  const ids = remoteRecords.map((r) => r.id);
  const localExisting = await table.where('id').anyOf(ids).toArray();
  const localMap = new Map<string, T>(localExisting.map((l: T) => [l.id, l]));

  const toPut: T[] = [];
  for (const remote of remoteRecords) {
    const local = localMap.get(remote.id);
    if (local && local.sync_status === 'pending') {
      // Local has unpushed offline changes: keep local if newer or equal
      const localTime = local.updated_at ? new Date(local.updated_at).getTime() : 0;
      const remoteTime = remote.updated_at ? new Date(remote.updated_at).getTime() : 0;
      if (localTime >= remoteTime) continue;
    }
    toPut.push({ ...remote, sync_status: 'synced' as const });
  }

  if (toPut.length > 0) {
    await table.bulkPut(toPut);
  }
  return toPut.length;
}

/**
 * Runs a full bidirectional sync cycle.
 */
export async function runSync(options?: { force?: boolean }): Promise<SyncResult> {
  if (isSyncRunning) {
    return {
      success: false,
      pushedCount: 0,
      pulledCount: 0,
      errors: ['Sync is already in progress.'],
      timestamp: new Date().toISOString(),
    };
  }

  const client = getSupabaseClient();
  if (!client || (!navigator.onLine && !options?.force)) {
    return {
      success: false,
      pushedCount: 0,
      pulledCount: 0,
      errors: ['Offline or Supabase client not configured.'],
      timestamp: new Date().toISOString(),
    };
  }

  isSyncRunning = true;
  notify({ syncing: true });

  const tenantId = getCurrentTenantId();
  const errors: string[] = [];
  let pushedCount = 0;
  let pulledCount = 0;
  const syncStartTime = new Date().toISOString();

  try {
    // -------------------------------------------------------------
    // 1. PUSH PHASE: local 'pending' -> cloud (tenant-isolated)
    // -------------------------------------------------------------
    const pendingTenants = await db.tenants
      .where('id')
      .equals(tenantId)
      .and((t) => t.sync_status === 'pending')
      .toArray();

    const pendingPatients = await db.patients
      .where('tenant_id')
      .equals(tenantId)
      .and((p) => p.sync_status === 'pending')
      .toArray();

    const pendingEncounters = await db.encounters
      .where('tenant_id')
      .equals(tenantId)
      .and((e) => e.sync_status === 'pending')
      .toArray();

    const pendingRxItems = await db.prescription_items
      .where('tenant_id')
      .equals(tenantId)
      .and((i) => i.sync_status === 'pending')
      .toArray();

    const pendingReports = await db.investigation_reports
      .where('tenant_id')
      .equals(tenantId)
      .and((r) => r.sync_status === 'pending')
      .toArray();

    const pendingTemplates = await db.prescription_templates
      .where('tenant_id')
      .equals(tenantId)
      .and((t) => t.sync_status === 'pending')
      .toArray();

    // Push Tenants
    if (pendingTenants.length > 0) {
      const { error } = await client.from('tenants').upsert(pendingTenants);
      if (error) errors.push(`Tenants push error: ${error.message}`);
      else {
        await db.tenants.where('id').anyOf(pendingTenants.map((t) => t.id)).modify({ sync_status: 'synced' });
        pushedCount += pendingTenants.length;
      }
    }

    // Push Patients
    if (pendingPatients.length > 0) {
      const { error } = await client.from('patients').upsert(pendingPatients);
      if (error) errors.push(`Patients push error: ${error.message}`);
      else {
        await db.patients.where('id').anyOf(pendingPatients.map((p) => p.id)).modify({ sync_status: 'synced' });
        pushedCount += pendingPatients.length;
      }
    }

    // Push Encounters
    if (pendingEncounters.length > 0) {
      const { error } = await client.from('encounters').upsert(pendingEncounters);
      if (error) errors.push(`Encounters push error: ${error.message}`);
      else {
        await db.encounters.where('id').anyOf(pendingEncounters.map((e) => e.id)).modify({ sync_status: 'synced' });
        pushedCount += pendingEncounters.length;
      }
    }

    // Push Prescription Items
    if (pendingRxItems.length > 0) {
      const { error } = await client.from('prescription_items').upsert(pendingRxItems);
      if (error) errors.push(`Prescription items push error: ${error.message}`);
      else {
        await db.prescription_items.where('id').anyOf(pendingRxItems.map((r) => r.id)).modify({ sync_status: 'synced' });
        pushedCount += pendingRxItems.length;
      }
    }

    // Push Investigation Reports (strip Blob)
    if (pendingReports.length > 0) {
      const sanitizedReports = pendingReports.map((r) => {
        const { local_file_blob, ...rest } = r;
        return rest;
      });
      const { error } = await client.from('investigation_reports').upsert(sanitizedReports);
      if (error) errors.push(`Investigation reports push error: ${error.message}`);
      else {
        await db.investigation_reports.where('id').anyOf(pendingReports.map((r) => r.id)).modify({ sync_status: 'synced' });
        pushedCount += pendingReports.length;
      }
    }

    // Push Prescription Templates
    if (pendingTemplates.length > 0) {
      const { error } = await client.from('prescription_templates').upsert(pendingTemplates);
      if (error) errors.push(`Templates push error: ${error.message}`);
      else {
        await db.prescription_templates.where('id').anyOf(pendingTemplates.map((t) => t.id)).modify({ sync_status: 'synced' });
        pushedCount += pendingTemplates.length;
      }
    }

    // -------------------------------------------------------------
    // 2. PULL PHASE: cloud records updated > last_sync -> local Dexie
    // -------------------------------------------------------------
    const lastSync = getLastSyncTimestamp(tenantId);

    // Pull Tenant profile
    const { data: remoteTenant, error: errTenant } = await client
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .gt('updated_at', lastSync)
      .maybeSingle();

    if (errTenant) errors.push(`Tenant pull error: ${errTenant.message}`);
    else if (remoteTenant) {
      await db.tenants.put({ ...(remoteTenant as Tenant), sync_status: 'synced' as const });
      pulledCount += 1;
    }

    // Pull Patients
    const { data: remotePatients, error: errPatients } = await client
      .from('patients')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);
    if (errPatients) errors.push(`Patients pull error: ${errPatients.message}`);
    else if (remotePatients) pulledCount += await mergeRemoteRecords(db.patients, remotePatients as Patient[]);

    // Pull Encounters
    const { data: remoteEncounters, error: errEncounters } = await client
      .from('encounters')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);
    if (errEncounters) errors.push(`Encounters pull error: ${errEncounters.message}`);
    else if (remoteEncounters) pulledCount += await mergeRemoteRecords(db.encounters, remoteEncounters as Encounter[]);

    // Pull Prescription Items
    const { data: remoteItems, error: errItems } = await client
      .from('prescription_items')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);
    if (errItems) errors.push(`Prescription items pull error: ${errItems.message}`);
    else if (remoteItems) pulledCount += await mergeRemoteRecords(db.prescription_items, remoteItems as PrescriptionItem[]);

    // Pull Investigation Reports
    const { data: remoteReports, error: errReports } = await client
      .from('investigation_reports')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);
    if (errReports) errors.push(`Investigation reports pull error: ${errReports.message}`);
    else if (remoteReports) pulledCount += await mergeRemoteRecords(db.investigation_reports, remoteReports as InvestigationReport[]);

    // Pull Prescription Templates
    const { data: remoteTemplates, error: errTemplates } = await client
      .from('prescription_templates')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);
    if (errTemplates) errors.push(`Templates pull error: ${errTemplates.message}`);
    else if (remoteTemplates) pulledCount += await mergeRemoteRecords(db.prescription_templates, remoteTemplates as PrescriptionTemplate[]);

    setLastSyncTimestamp(tenantId, syncStartTime);
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  } finally {
    isSyncRunning = false;
    const finalResult: SyncResult = {
      success: errors.length === 0,
      pushedCount,
      pulledCount,
      errors,
      timestamp: syncStartTime,
    };
    notify(finalResult);
    return finalResult;
  }
}

/**
 * Initializes automatic background synchronization.
 */
export function startSyncScheduler(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {
    void runSync();
  };

  window.addEventListener('online', handleOnline);

  if (!syncIntervalId) {
    syncIntervalId = setInterval(() => {
      if (navigator.onLine) void runSync();
    }, FIVE_MINUTES_MS);
  }

  if (navigator.onLine) {
    void runSync();
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
      syncIntervalId = null;
    }
  };
}
