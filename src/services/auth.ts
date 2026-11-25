/**
 * MedRecord — Multi-Doctor Auth & Operations.
 *
 * Supports online Supabase authentication with offline-first session persistence.
 */
import { getSupabaseClient } from '@/db/supabase';
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import { DEFAULT_TENANT_ID } from '@/db/seedData';
import type { Tenant } from '@/types/schema';
import {
  type AuthSession,
  clearCachedSession,
  getCachedSession,
  safeGetTenant,
  safePutTenant,
  saveCachedSession,
} from './auth-session';

export * from './auth-session';

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
 * Allows doctors to immediately enter their local chamber offline without waiting for
 * cloud email verification (e.g. during offline use, testing, or email delay).
 */
export async function loginOfflineFallback(
  email: string,
  doctorName?: string,
  clinicName?: string,
): Promise<AuthSession> {
  const trimmedEmail = email.trim().toLowerCase();
  const cached = getCachedSession();
  if (cached && cached.email.toLowerCase() === trimmedEmail) {
    return cached;
  }

  // Find existing tenant for this specific email if previously cached or create one
  const tenantId = generateUUID();
  const docName = doctorName || 'ডাঃ ' + (trimmedEmail.split('@')[0] || 'চিকিৎসক');
  const clName = clinicName || 'আমার চেম্বার';
  const ts = new Date().toISOString();

  const tenant: Tenant = {
    id: tenantId,
    tenant_id: tenantId,
    clinic_name: clName,
    doctor_name: docName,
    degrees: 'MBBS',
    specialty: 'General Physician',
    phone: '',
    address: '',
    subscription_plan: 'free',
    print_margin_top_mm: 12,
    print_margin_bottom_mm: 12,
    print_margin_left_mm: 14,
    print_margin_right_mm: 14,
    pad_font_size: 'standard',
    sync_status: 'pending',
    created_at: ts,
    updated_at: ts,
  };
  await safePutTenant(tenant);

  const session: AuthSession = {
    userId: tenantId,
    email: trimmedEmail,
    tenantId,
    doctorName: docName,
    clinicName: clName,
    cachedAt: ts,
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

  // Explicit demo doctor bypass
  if (trimmedEmail === 'sarwar@medrecord.local' && (password === 'sarwar123' || password === 'demo')) {
    return loginAsDrSarwar();
  }

  if (!client || !navigator.onLine) {
    const cached = getCachedSession();
    if (cached && cached.email.toLowerCase() === trimmedEmail) {
      return cached;
    }
    throw new Error('অফলাইনে লগইন করতে পূর্বে অন্তত একবার এই ডিভাইসে লগইন করা থাকতে হবে।');
  }

  const { data, error } = await client.auth.signInWithPassword({ email: trimmedEmail, password });
  if (error) throw error;
  if (!data.user) throw new Error('লগইন ব্যর্থ হয়েছে: কোনো ইউজার পাওয়া যায়নি।');

  const tenantId = (data.user.user_metadata?.tenant_id as string) || data.user.id;
  const metaDoctorName = (data.user.user_metadata?.doctor_name as string) || 'ডাঃ ' + (data.user.email?.split('@')[0] || '');
  const metaClinicName = (data.user.user_metadata?.clinic_name as string) || 'আমার চেম্বার';

  let tenant = await safeGetTenant(tenantId);
  if (!tenant) {
    const { data: remoteTenant } = await client
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle();

    if (remoteTenant) {
      tenant = remoteTenant as Tenant;
      await safePutTenant(tenant);
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
      await safePutTenant(tenant);
      try {
        await client.from('tenants').upsert(tenant);
      } catch (upsertErr) {
        console.warn('Could not upsert tenant to Supabase:', upsertErr);
      }
    }
  }

  const session: AuthSession = {
    userId: data.user.id,
    email: data.user.email || trimmedEmail,
    tenantId,
    doctorName: tenant?.doctor_name || metaDoctorName,
    clinicName: tenant?.clinic_name || metaClinicName,
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
  const trimmedEmail = email.trim().toLowerCase();

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

  const session: AuthSession = {
    userId: newTenantId,
    email: trimmedEmail,
    tenantId: newTenantId,
    doctorName: localTenant.doctor_name,
    clinicName: localTenant.clinic_name,
    cachedAt: ts,
  };

  if (client && navigator.onLine) {
    const { data, error } = await client.auth.signUp({
      email: trimmedEmail,
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

    if (error) throw error;
    if (data?.user) session.userId = data.user.id;

    try {
      const { error: tenantErr } = await client.from('tenants').upsert(localTenant);
      if (tenantErr) {
        console.warn('Could not insert tenant to Supabase:', tenantErr.message);
        localTenant.sync_status = 'pending';
      }
    } catch (e) {
      console.warn('Could not contact Supabase cloud during signup:', e);
      localTenant.sync_status = 'pending';
    }
  }

  await safePutTenant(localTenant);
  saveCachedSession(session);
  return session;
}

/**
 * Resends signup confirmation email to the user.
 */
export async function resendConfirmationEmail(email: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('ক্লাউড কানেকশন সক্রিয় নয় বা Supabase কনফিগার করা নেই।');
  const trimmed = email.trim().toLowerCase();
  const { error } = await client.auth.resend({
    type: 'signup',
    email: trimmed,
  });
  if (error) throw error;
}

/**
 * Sends a password reset email via Supabase Auth.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('ক্লাউড কানেকশন সক্রিয় নয় বা Supabase কনফিগার করা নেই।');
  const trimmed = email.trim().toLowerCase();
  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/login?mode=update-password` : undefined;
  const { error } = await client.auth.resetPasswordForEmail(trimmed, {
    redirectTo: redirectUrl,
  });
  if (error) throw error;
}

/**
 * Updates user password once they are logged in or arriving via password reset token.
 */
export async function updatePassword(newPassword: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('ক্লাউড কানেকশন সক্রিয় নয় বা Supabase কনফিগার করা নেই।');
  const { error } = await client.auth.updateUser({ password: newPassword });
  if (error) throw error;
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
