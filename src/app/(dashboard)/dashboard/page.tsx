'use client';

/**
 * Queue / Dashboard — minimal summary for Phase 2; the full consultation
 * queue arrives in a later phase.
 */
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowRight, Users, ClipboardList } from 'lucide-react';

import { db } from '@/db/localDb';
import { getCurrentTenantId } from '@/services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/motion';

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
    { title: 'Registered Patients', value: patientCount, icon: Users, desc: 'Active records in local database' },
    { title: 'Completed Visits', value: encounterCount, icon: ClipboardList, desc: 'Prescriptions & clinical consultations' },
  ];

  return (
    <FadeInView className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinic Overview</h1>
        <p className="text-sm text-slate-500 font-medium">Real-time local statistics and patient consultation queue</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="rounded-2xl border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">{s.title}</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-slate-950 tracking-tight font-mono">{s.value}</div>
                <p className="text-xs text-slate-400 font-medium mt-1.5">{s.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="pt-2">
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-xs transition-all"
        >
          Open Patients Directory <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </FadeInView>
  );
}
