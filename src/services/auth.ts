/**
 * MedRecord — Multi-Doctor Auth & Session Management.
 *
 * Supports online Supabase authentication with client-side session caching.
 * If the device goes offline after logging in once, the cached session and
 * tenant_id persist in localStorage so the doctor is never locked out.
 */
import { getSupabaseClient } from '@/db/supabase';
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import { DEFAULT_TENANT_ID } from '@/db/seedData';
import type { Tenant } from '@/types/schema';

const SESSION_STORAGE_KEY = 'medrecord_auth_session';

export interface AuthSession {
  userId: string;
  email: string;
  tenantId: string;
  doctorName?: string;
  clinicName?: string;
  cachedAt: string;
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
 * Signs in a doctor using Supabase Auth or offline cached credentials.
 */
export async function loginDoctor(email: string, password: string): Promise<AuthSession> {
  const client = getSupabaseClient();

  if (!client || !navigator.onLine) {
    // Offline authentication fallback
    const cached = getCachedSession();
    if (cached && cached.email.toLowerCase() === email.toLowerCase()) {
      return cached;
    }
    // If logging into demo tenant offline
    const session: AuthSession = {
      userId: DEFAULT_TENANT_ID,
      email,
      tenantId: DEFAULT_TENANT_ID,
      doctorName: 'Dr. A. Verma',
      clinicName: 'MedRecord Clinic (Offline)',
      cachedAt: new Date().toISOString(),
    };
    saveCachedSession(session);
    return session;
  }

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('No user returned from Supabase Auth');

  const tenantId = (data.user.user_metadata?.tenant_id as string) || data.user.id;
  const session: AuthSession = {
    userId: data.user.id,
    email: data.user.email || email,
    tenantId,
    doctorName: data.user.user_metadata?.doctor_name,
    clinicName: data.user.user_metadata?.clinic_name,
    cachedAt: new Date().toISOString(),
  };

  saveCachedSession(session);
  return session;
}

/**
 * Signs up a new doctor, creating a dedicated multi-tenant record locally & cloud.
 */
export async function signUpDoctor(
  email: string,
  password: string,
  clinicName: string,
  doctorName: string,
  specialty: string = 'General Physician',
): Promise<AuthSession> {
  const client = getSupabaseClient();
  const newTenantId = generateUUID();
  const ts = new Date().toISOString();

  // Create local tenant immediately in Dexie (offline-first)
  const localTenant: Tenant = {
    id: newTenantId,
    tenant_id: newTenantId,
    clinic_name: clinicName,
    doctor_name: doctorName,
    degrees: 'MBBS',
    specialty,
    phone: '',
    address: '',
    subscription_plan: 'free',
    print_margin_top_mm: 12,
    print_margin_left_mm: 15,
    sync_status: client ? 'pending' : 'synced',
    created_at: ts,
    updated_at: ts,
  };
  await db.tenants.put(localTenant);

  const session: AuthSession = {
    userId: newTenantId,
    email,
    tenantId: newTenantId,
    doctorName,
    clinicName,
    cachedAt: ts,
  };

  if (client && navigator.onLine) {
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            tenant_id: newTenantId,
            clinic_name: clinicName,
            doctor_name: doctorName,
            specialty,
          },
        },
      });
      if (error) console.warn('Supabase sign-up warning:', error.message);
      if (data?.user) session.userId = data.user.id;
    } catch (e) {
      console.warn('Could not contact Supabase cloud during signup:', e);
    }
  }

  saveCachedSession(session);
  return session;
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

/**
 * Signs out the doctor and optionally clears cached local session.
 */
export async function logoutDoctor(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch {
      // offline logout ignore
    }
  }
  clearCachedSession();
}
