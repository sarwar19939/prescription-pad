'use client';

/**
 * Client shell pieces for the dashboard layout: navigation sidebar and the
 * sync-badge header.
 */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import type { ReactNode } from 'react';

import { SyncStatusBadge } from '@/components/sync-status-badge';
import { db } from '@/db/localDb';
import { getCachedSession, getCurrentTenantId, logoutDoctor } from '@/services/auth';

const NAV_ITEMS = [
  { label: 'Queue / Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'Consultation', href: 'CONSULT', icon: ClipboardPlus },
  { label: 'Medicine Catalog', href: '/medicines', icon: Pill },
  { label: 'Settings', href: '/settings', icon: Settings },
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
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </>
  );
  if (disabled) {
    return (
      <span className="block cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-neutral-400">
        {content}
      </span>
    );
  }
  return (
    <Link
      href={resolved ?? '#'}
      className={
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
        (active ? 'bg-primary/10 text-primary' : 'text-neutral-600 hover:bg-neutral-100')
      }
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
  const session = getCachedSession();

  const handleLogout = async () => {
    await logoutDoctor();
    router.push('/login');
  };

  return (
    <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-4">
        <Link href="/patients" className="flex items-center gap-2 px-1">
          <Stethoscope className="h-6 w-6 text-emerald-700" aria-hidden />
          <span className="text-lg font-semibold">MedRecord</span>
        </Link>
        <nav className="flex flex-col gap-1">
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

      <div className="border-t border-neutral-100 pt-3">
        <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
          <div className="truncate">
            <div className="font-semibold text-neutral-900 truncate">
              {session?.doctorName || 'Dr. Verma'}
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              {session?.clinicName || 'Demo Clinic'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Switch Doctor / Sign Out"
            className="rounded p-1 text-neutral-400 hover:text-red-600 hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
      <span className="text-sm font-medium text-neutral-500">MedRecord Clinic Workspace</span>
      <SyncStatusBadge />
    </header>
  );
}
