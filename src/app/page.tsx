'use client';

/**
 * Root page router:
 * If an active doctor session is cached, routes directly to /patients.
 * Otherwise, routes to /login for doctor sign-in / registration.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCachedSession } from '@/services/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getCachedSession();
    if (session && session.tenantId) {
      router.replace('/patients');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-xs">
      লোড হচ্ছে…
    </div>
  );
}
