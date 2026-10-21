import { Suspense, type ComponentProps } from 'react';

import { DashboardSidebar, DashboardHeader } from './shell';

/**
 * Clinical dashboard shell: fixed sidebar for clinic navigation and a
 * sticky header carrying the offline/online sync badge. The hook-driven
 * pieces are client components inside Suspense so prerendering stays safe.
 */
export default function DashboardLayout({ children }: ComponentProps<'div'>) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<SidebarFallback />}>
        <DashboardSidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<header className="sticky top-0 z-40 h-[52px] border-b border-neutral-200 bg-white" />}>
          <DashboardHeader />
        </Suspense>
        <main className="min-w-0 flex-1 bg-neutral-50 p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarFallback() {
  return <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white" />;
}
