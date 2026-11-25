/**
 * MedRecord — Sync Engine Types & Constants
 */
export interface SyncResult {
  success: boolean;
  pushedCount: number;
  pulledCount: number;
  errors: string[];
  timestamp: string;
}

export const SYNC_TIMESTAMP_PREFIX = 'medrecord_last_sync_';
export const FIVE_MINUTES_MS = 5 * 60 * 1000;

export function getLastSyncTimestamp(tenantId: string): string {
  if (typeof window === 'undefined') return new Date(0).toISOString();
  return localStorage.getItem(`${SYNC_TIMESTAMP_PREFIX}${tenantId}`) || new Date(0).toISOString();
}

export function setLastSyncTimestamp(tenantId: string, ts: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${SYNC_TIMESTAMP_PREFIX}${tenantId}`, ts);
}
