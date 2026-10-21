'use client';

/**
 * Patients Directory: instant search over full_name / phone / patient_code,
 * registration modal, and direct "Start Consultation" entry.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { Loader2, Plus, Search, Stethoscope, TriangleAlert } from 'lucide-react';

import { db } from '@/db/localDb';
import { getCurrentTenantId } from '@/services/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeInView } from '@/components/ui/motion';
import { RegisterPatientDialog } from '@/features/patients/register-patient-dialog';

export default function PatientsPage() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const tenantId = getCurrentTenantId();

  const patients = useLiveQuery(
    () => db.patients.where('tenant_id').equals(tenantId).toArray(),
    [tenantId],
  );

  const filtered = (patients ?? [])
    .filter((p) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        p.full_name.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.patient_code.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <FadeInView className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage patient profiles, clinical history, and rapid consultation</p>
        </div>
        <Button onClick={() => setOpen(true)} className="h-11 px-5 rounded-xl font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs">
          <Plus className="h-4 w-4 mr-2" aria-hidden /> Register New Patient
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
        <Input
          className="h-11 pl-10 rounded-xl border-slate-300 text-sm font-medium"
          placeholder="Search name, phone or patient code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs">Code</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs">Patient Name</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs">Age / Sex</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs">Phone</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs">Clinical Flags</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(patients === undefined) && (
              <tr><td colSpan={6} className="px-5 py-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" aria-hidden /></td></tr>
            )}
            {patients !== undefined && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500 font-medium">
                {query ? 'No patients match the search query.' : 'No patients yet — register your first patient.'}
              </td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-mono text-sm font-semibold text-slate-700">
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                    {p.patient_code}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-bold text-slate-900 text-base">
                  <Link className="hover:text-teal-600 hover:underline transition-colors" href={`/consultation/${p.id}`}>
                    {p.full_name}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-slate-600 font-medium">{p.age} yrs · {p.gender}</td>
                <td className="px-5 py-3.5 font-mono text-slate-600 font-medium">{p.phone}</td>
                <td className="px-5 py-3.5">
                  <div className="flex max-w-xs flex-wrap gap-1.5">
                    {p.chronic_conditions.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5">{c}</Badge>
                    ))}
                    {p.allergies.length > 0 && (
                      <Badge variant="destructive" className="gap-1 text-xs bg-rose-50 text-rose-700 border-rose-200 font-semibold px-2 py-0.5">
                        <TriangleAlert className="h-3 w-3 text-rose-600" aria-hidden />
                        {p.allergies.join(', ')}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Button asChild size="sm" variant="outline" className="h-10 px-4 rounded-xl font-semibold text-sm border-slate-300 text-slate-700 hover:text-teal-700 hover:border-teal-500">
                    <Link href={`/consultation/${p.id}`}>
                      <Stethoscope className="h-4 w-4 mr-1.5 text-teal-600" aria-hidden /> Start Visit
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RegisterPatientDialog open={open} onOpenChange={setOpen} />
    </FadeInView>
  );
}
