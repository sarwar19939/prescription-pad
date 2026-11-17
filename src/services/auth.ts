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
 * 1-Click quick login as Dr. Golam Sarowar for testing or owner convenience.
 */
export async function loginAsDrSarwar(): Promise<AuthSession> {
  const session: AuthSession = {
    userId: DEFAULT_TENANT_ID,
    email: 'sarwar@medrecord.local',
    tenantId: DEFAULT_TENANT_ID,
    doctorName: 'ডাঃ গোলাম সারোয়ার',
    clinicName: 'বসিরবানিয়া চেম্বার',
    cachedAt: new Date().toISOString(),
  };
  saveCachedSession(session);
  return session;
}

/**
 * Signs in a doctor using Supabase Auth or offline cached credentials.
 */
export async function loginDoctor(email: string, password: string): Promise<AuthSession> {
  const client = getSupabaseClient();
  const trimmedEmail = email.trim().toLowerCase();

  // Quick bypass for Dr. Golam Sarowar demo login
  if (
    trimmedEmail === 'sarwar@medrecord.local' ||
    (trimmedEmail.includes('sarwar') && (password === 'demo' || password === 'sarwar123'))
  ) {
    return loginAsDrSarwar();
  }

  if (!client || !navigator.onLine) {
    // Offline authentication fallback: match cached session
    const cached = getCachedSession();
    if (cached && cached.email.toLowerCase() === trimmedEmail) {
      return cached;
    }
    // Check if there is an existing tenant matching in local Dexie
    const localTenants = await db.tenants.toArray();
    const matching = localTenants.find((t) => t.id !== DEFAULT_TENANT_ID);
    if (matching) {
      const session: AuthSession = {
        userId: matching.id,
        email: trimmedEmail,
        tenantId: matching.id,
        doctorName: matching.doctor_name,
        clinicName: matching.clinic_name,
        cachedAt: new Date().toISOString(),
      };
      saveCachedSession(session);
      return session;
    }
    throw new Error('অফলাইনে লগইন করতে পূর্বে অন্তত একবার এই ডিভাইসে লগইন করা থাকতে হবে।');
  }

  const { data, error } = await client.auth.signInWithPassword({ email: trimmedEmail, password });
  if (error) throw error;
  if (!data.user) throw new Error('লগইন ব্যর্থ হয়েছে: কোনো ইউজার পাওয়া যায়নি।');

  const tenantId = (data.user.user_metadata?.tenant_id as string) || data.user.id;
  const metaDoctorName = (data.user.user_metadata?.doctor_name as string) || 'ডাঃ ' + (data.user.email?.split('@')[0] || '');
  const metaClinicName = (data.user.user_metadata?.clinic_name as string) || 'আমার চেম্বার';

  // Ensure this doctor's tenant is present in local Dexie!
  let tenant = await db.tenants.get(tenantId);
  if (!tenant) {
    // Fetch from Supabase tenants table
    const { data: remoteTenant } = await client
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle();

    if (remoteTenant) {
      tenant = remoteTenant as Tenant;
      await db.tenants.put(tenant);
    } else {
      const ts = new Date().toISOString();
      tenant = {
        id: tenantId,
        tenant_id: tenantId,
        clinic_name: metaClinicName,
        doctor_name: metaDoctorName,
        degrees: (data.user.user_metadata?.degrees as string) || 'MBBS',
        specialty: (data.user.user_metadata?.specialty as string) || 'General Physician',
        phone: '',
        address: '',
        subscription_plan: 'free',
        print_margin_top_mm: 12,
        print_margin_bottom_mm: 12,
        print_margin_left_mm: 14,
        print_margin_right_mm: 14,
        pad_font_size: 'standard',
        sync_status: 'synced',
        created_at: ts,
        updated_at: ts,
      };
      await db.tenants.put(tenant);
      await client.from('tenants').upsert(tenant);
    }
  }

  const session: AuthSession = {
    userId: data.user.id,
    email: data.user.email || trimmedEmail,
    tenantId,
    doctorName: tenant.doctor_name || metaDoctorName,
    clinicName: tenant.clinic_name || metaClinicName,
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
    clinic_name: clinicName.trim() || 'আমার চেম্বার',
    doctor_name: doctorName.trim() || 'চিকিৎসক',
    degrees: specialty.includes('MBBS') ? specialty : `MBBS, ${specialty}`,
    specialty: specialty.trim() || 'General Physician',
    phone: '',
    address: '',
    subscription_plan: 'free',
    print_margin_top_mm: 12,
    print_margin_bottom_mm: 12,
    print_margin_left_mm: 14,
    print_margin_right_mm: 14,
    pad_font_size: 'standard',
    sync_status: client && navigator.onLine ? 'synced' : 'pending',
    created_at: ts,
    updated_at: ts,
  };
  await db.tenants.put(localTenant);

  const session: AuthSession = {
    userId: newTenantId,
    email: email.trim().toLowerCase(),
    tenantId: newTenantId,
    doctorName: localTenant.doctor_name,
    clinicName: localTenant.clinic_name,
    cachedAt: ts,
  };

  if (client && navigator.onLine) {
    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            tenant_id: newTenantId,
            clinic_name: localTenant.clinic_name,
            doctor_name: localTenant.doctor_name,
            specialty: localTenant.specialty,
            degrees: localTenant.degrees,
          },
        },
      });
      if (error) console.warn('Supabase sign-up warning:', error.message);
      if (data?.user) session.userId = data.user.id;

      // Upsert into Supabase tenants table immediately
      const { error: tenantErr } = await client.from('tenants').upsert(localTenant);
      if (tenantErr) {
        console.warn('Could not insert tenant to Supabase:', tenantErr.message);
      }
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
