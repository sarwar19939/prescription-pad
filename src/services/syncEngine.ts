/**
 * MedRecord — Bidirectional Offline-to-Cloud Sync Engine.
 *
 * Synchronizes local Dexie.js (IndexedDB) with Supabase (PostgreSQL).
 * - Push: drains pending local records to Supabase using upsert.
 * - Pull: downloads remote changes since last_sync_timestamp for the current tenant.
 * - Lifecycle: runs on 'online' event, every 5 minutes, and on manual 'Sync Now'.
 */
import { db } from '@/db/localDb';
import { getSupabaseClient } from '@/db/supabase';
import { getCurrentTenantId } from './auth';
import type {
  Encounter,
  InvestigationReport,
  Patient,
  PrescriptionItem,
  Tenant,
} from '@/types/schema';

export interface SyncResult {
  success: boolean;
  pushedCount: number;
  pulledCount: number;
  errors: string[];
  timestamp: string;
}

const SYNC_TIMESTAMP_PREFIX = 'medrecord_last_sync_';
const FIVE_MINUTES_MS = 5 * 60 * 1000;

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

function getLastSyncTimestamp(tenantId: string): string {
  if (typeof window === 'undefined') return new Date(0).toISOString();
  return localStorage.getItem(`${SYNC_TIMESTAMP_PREFIX}${tenantId}`) || new Date(0).toISOString();
}

function setLastSyncTimestamp(tenantId: string, ts: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${SYNC_TIMESTAMP_PREFIX}${tenantId}`, ts);
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
    // 1. PUSH PHASE: local 'pending' -> cloud
    // -------------------------------------------------------------
    const pendingTenants = await db.tenants.where('sync_status').equals('pending').toArray();
    const pendingPatients = await db.patients.where('sync_status').equals('pending').toArray();
    const pendingEncounters = await db.encounters.where('sync_status').equals('pending').toArray();
    const pendingRxItems = await db.prescription_items.where('sync_status').equals('pending').toArray();
    const pendingReports = await db.investigation_reports.where('sync_status').equals('pending').toArray();

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

    // Push Investigation Reports (omit Blob from Postgres upsert)
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

    // -------------------------------------------------------------
    // 2. PULL PHASE: cloud records updated > last_sync -> local Dexie
    // -------------------------------------------------------------
    const lastSync = getLastSyncTimestamp(tenantId);

    // Pull Patients
    const { data: remotePatients, error: errPatients } = await client
      .from('patients')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);

    if (errPatients) errors.push(`Patients pull error: ${errPatients.message}`);
    else if (remotePatients && remotePatients.length > 0) {
      const rows = (remotePatients as Patient[]).map((p) => ({ ...p, sync_status: 'synced' as const }));
      await db.patients.bulkPut(rows);
      pulledCount += rows.length;
    }

    // Pull Encounters
    const { data: remoteEncounters, error: errEncounters } = await client
      .from('encounters')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);

    if (errEncounters) errors.push(`Encounters pull error: ${errEncounters.message}`);
    else if (remoteEncounters && remoteEncounters.length > 0) {
      const rows = (remoteEncounters as Encounter[]).map((e) => ({ ...e, sync_status: 'synced' as const }));
      await db.encounters.bulkPut(rows);
      pulledCount += rows.length;
    }

    // Pull Prescription Items
    const { data: remoteItems, error: errItems } = await client
      .from('prescription_items')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);

    if (errItems) errors.push(`Prescription items pull error: ${errItems.message}`);
    else if (remoteItems && remoteItems.length > 0) {
      const rows = (remoteItems as PrescriptionItem[]).map((i) => ({ ...i, sync_status: 'synced' as const }));
      await db.prescription_items.bulkPut(rows);
      pulledCount += rows.length;
    }

    // Pull Investigation Reports
    const { data: remoteReports, error: errReports } = await client
      .from('investigation_reports')
      .select('*')
      .eq('tenant_id', tenantId)
      .gt('updated_at', lastSync);

    if (errReports) errors.push(`Investigation reports pull error: ${errReports.message}`);
    else if (remoteReports && remoteReports.length > 0) {
      const rows = (remoteReports as InvestigationReport[]).map((r) => ({ ...r, sync_status: 'synced' as const }));
      await db.investigation_reports.bulkPut(rows);
      pulledCount += rows.length;
    }

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
 * Initializes automatic background synchronization:
 * 1. Online event trigger
 * 2. 5-minute recurring timer
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

  // Initial sync attempt on app mount if online
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
