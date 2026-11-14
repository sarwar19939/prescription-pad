import { Suspense, type ComponentProps } from 'react';

import { DashboardSidebar, DashboardHeader } from './shell';

/**
 * Clinical dashboard shell:
 * Spacious ergonomic sidebar and a sticky header carrying the sync badge and quick actions.
 */
export default function DashboardLayout({ children }: ComponentProps<'div'>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Suspense fallback={<SidebarFallback />}>
        <DashboardSidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<header className="sticky top-0 z-40 h-16 border-b border-slate-200/80 bg-white" />}>
          <DashboardHeader />
        </Suspense>
        <main className="min-w-0 flex-1 bg-slate-50 p-2 sm:p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarFallback() {
  return <aside className="hidden md:block w-64 shrink-0 border-r border-slate-200/80 bg-white" />;
}
