'use client';

/**
 * Queue / Dashboard — minimal summary for Phase 2; the full consultation
 * queue arrives in a later phase.
 */
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowRight } from 'lucide-react';

import { db } from '@/db/localDb';
import { getCurrentTenantId } from '@/services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function useTenantCount(table: 'patients' | 'encounters') {
  const tenantId = getCurrentTenantId();
  return useLiveQuery(
    () => db[table].where('tenant_id').equals(tenantId).count(),
    [tenantId],
    0,
  );
}

export default function DashboardPage() {
  const patientCount = useTenantCount('patients');
  const encounterCount = useTenantCount('encounters');

  const stats = [
    { title: 'Total Patients', value: patientCount },
    { title: 'Total Visits', value: encounterCount },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Queue / Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{s.value}</CardContent>
          </Card>
        ))}
      </div>
      <Link href="/patients" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">
        Open Patients Directory <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
