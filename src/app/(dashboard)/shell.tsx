'use client';

/**
 * Client shell pieces for the dashboard layout:
 * - DashboardSidebar: Ergonomic 64-width navigation sidebar with high-contrast active states.
 * - DashboardHeader: Sticky header carrying the workspace title and sync engine controls.
 */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ClipboardPlus,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Pill,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';

import { SyncStatusBadge } from '@/components/sync-status-badge';
import { db } from '@/db/localDb';
import { seedInitialData } from '@/db/seed';
import { getCachedSession, getCurrentTenantId, logoutDoctor } from '@/services/auth';
import { ensureMedexSeeded } from '@/services/medexService';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Queue / Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patients Directory', href: '/patients', icon: Users },
  { label: 'Consultation Suite', href: 'CONSULT', icon: ClipboardPlus },
  { label: 'Medicine Catalog', href: '/medicines', icon: Pill },
  { label: 'Settings & Pad Setup', href: '/settings', icon: Settings },
  { label: 'Billing & Plans', href: '/settings/billing', icon: CreditCard },
] as const;

/** Most recently registered patient for this tenant (null → no patient). */
function useConsultationHref() {
  const tenantId = getCurrentTenantId();
  const lastPatient = useLiveQuery(
    async () =>
      (
        await db.patients
          .where('tenant_id')
          .equals(tenantId)
          .sortBy('created_at')
      ).at(-1),
    [tenantId],
    undefined,
  );
  return lastPatient ? `/consultation/${lastPatient.id}` : null;
}

interface NavItemProps {
  label: string;
  href: string;
  icon: typeof Users;
  active: boolean;
  consultHref: string | null;
}

function NavItem({ label, href, icon: Icon, active, consultHref }: NavItemProps) {
  const resolved = href === 'CONSULT' ? consultHref : href;
  const disabled = href === 'CONSULT' && !consultHref;
  const content: ReactNode = (
    <>
      <Icon className={cn('h-5 w-5 shrink-0 transition-colors', active ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600')} aria-hidden />
      <span className="truncate">{label}</span>
    </>
  );

  if (disabled) {
    return (
      <span className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-slate-300 cursor-not-allowed">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={resolved ?? '#'}
      className={cn(
        'group flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-all focus:ring-2 focus:ring-teal-500/30 outline-none',
        active
          ? 'bg-teal-50 font-bold text-teal-900 border border-teal-200/80 shadow-2xs'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      {content}
    </Link>
  );
}

const isActiveHref = (href: string, pathname: string) =>
  href !== 'CONSULT' && (pathname === href || pathname.startsWith(href + '/'));

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const consultHref = useConsultationHref();
  const tenantId = getCurrentTenantId();
  const tenant = useLiveQuery(() => db.tenants.get(tenantId), [tenantId]);
  const session = getCachedSession();

  const handleLogout = async () => {
    await logoutDoctor();
    router.push('/login');
  };

  const doctorDisplayName = tenant?.doctor_name || session?.doctorName || 'ডাঃ গোলাম সারোয়ার';
  const clinicDisplayName = tenant?.clinic_name || session?.clinicName || 'বসিরবানিয়া চেম্বার';

  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white p-5">
      <div className="flex flex-col gap-6">
        <Link href="/patients" className="flex items-center gap-2.5 px-1 py-1 focus:outline-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
            <Stethoscope className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-950 tracking-tight block leading-none">MedRecord</span>
            <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block mt-1">
              Offline-First EHR
            </span>
          </div>
        </Link>

        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              active={isActiveHref(item.href, pathname)}
              consultHref={consultHref}
            />
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3">
          <div className="min-w-0 pr-2">
            <div className="truncate text-sm font-bold text-slate-900">
              {doctorDisplayName}
            </div>
            <div className="truncate text-xs font-medium text-slate-500">
              {clinicDisplayName}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Switch Doctor / Sign Out"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:ring-2 focus:ring-teal-500/30"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function DashboardHeader() {
  const tenantId = getCurrentTenantId();

  useEffect(() => {
    void ensureMedexSeeded(tenantId);
    void seedInitialData();
  }, [tenantId]);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-8 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-slate-900 tracking-tight">Clinical Suite</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-medium text-slate-500">Practice Chamber</span>
      </div>
      <SyncStatusBadge />
    </header>
  );
}
