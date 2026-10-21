/**
 * MedRecord — Supabase client stub (cloud side of the offline-first stack).
 * The app never writes here directly: writes land in Dexie first
 * (sync_status: 'pending') and a later sync phase uses this client to drain
 * pending rows. Imported lazily on the client only, so server rendering
 * doesn't touch IndexedDB-dependent code paths.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL_ENV = 'NEXT_PUBLIC_SUPABASE_URL';
export const SUPABASE_ANON_KEY_ENV = 'NEXT_PUBLIC_SUPABASE_ANON_KEY';

interface Auth {
  tenantId: string;
}

/**
 * Returns a Supabase client if both public env vars are configured, else null.
 * Callers must treat null as "cloud not configured / offline mode".
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: true } });
}

/**
 * Placeholder for the future sync phase: the tenant the signed-in user
 * belongs to. Until auth is wired (next phase), derive from the seeded
 * default tenant.
 */
export function currentAuthPlaceholder(): Auth {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('medrecord_auth_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.tenantId) return { tenantId: parsed.tenantId };
      }
    } catch {
      // ignore
    }
  }
  return { tenantId: '00000000-0000-0000-0000-000000000001' };
}
