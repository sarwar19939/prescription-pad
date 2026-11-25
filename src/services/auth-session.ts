/**
 * MedRecord — Session & Tenant Persistence Layer for Auth
 */
import { db } from '@/db/localDb';
import { DEFAULT_TENANT_ID } from '@/db/seedData';
import type { Tenant } from '@/types/schema';

export const SESSION_STORAGE_KEY = 'medrecord_auth_session';

export interface AuthSession {
  userId: string;
  email: string;
  tenantId: string;
  doctorName?: string;
  clinicName?: string;
  cachedAt: string;
}

/**
 * Safely persists a tenant to local Dexie without ever wiping local clinical data.
 */
export async function safePutTenant(tenant: Tenant): Promise<void> {
  try {
    await db.tenants.put(tenant);
  } catch (err: any) {
    console.warn('Could not write tenant to local Dexie:', err);
    if (err?.name === 'QuotaExceededError' || err?.message?.includes('backing store')) {
      console.error('Browser storage quota reached. Please free disk space on drive C:.');
    }
  }
}

/**
 * Safely reads a tenant from local Dexie.
 */
export async function safeGetTenant(tenantId: string): Promise<Tenant | undefined> {
  try {
    return await db.tenants.get(tenantId);
  } catch (err: any) {
    console.warn('Could not read tenant from local Dexie:', err);
    return undefined;
  }
}

/**
 * Returns the currently active tenant ID.
 * Falls back to cached session or DEFAULT_TENANT_ID.
 */
export function getCurrentTenantId(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT_ID;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthSession;
      if (parsed.tenantId) return parsed.tenantId;
    }
  } catch {
    // fallback
  }
  return DEFAULT_TENANT_ID;
}

export function hasActiveSession(): boolean {
  if (typeof window === 'undefined') return false;
  return getCachedSession() !== null;
}

export function getCachedSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveCachedSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearCachedSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Returns active tenant AI configuration (API keys and preferred provider).
 */
export async function getActiveTenantAiConfig(): Promise<{
  ai_api_key?: string;
  nvidia_api_key?: string;
  ollama_base_url?: string;
  ai_provider?: 'cloud' | 'local';
}> {
  try {
    const tid = getCurrentTenantId();
    const tenant = (await db.tenants.get(tid)) || (await db.tenants.toCollection().first());
    return {
      ai_api_key: tenant?.ai_api_key,
      nvidia_api_key: tenant?.nvidia_api_key,
      ollama_base_url: tenant?.ollama_base_url,
      ai_provider: tenant?.ai_provider,
    };
  } catch {
    return {};
  }
}
