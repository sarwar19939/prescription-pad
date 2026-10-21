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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Patients</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Register New Patient
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
        <Input
          className="pl-8"
          placeholder="Search name, phone or patient code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Code</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Age / Sex</th>
              <th className="px-4 py-2 font-medium">Phone</th>
              <th className="px-4 py-2 font-medium">Flags</th>
              <th className="px-4 py-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(patients === undefined) && (
              <tr><td colSpan={6} className="px-4 py-6 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-neutral-400" aria-hidden /></td></tr>
            )}
            {patients !== undefined && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                {query ? 'No patients match the search.' : 'No patients yet — register the first one.'}
              </td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2 font-mono text-xs">{p.patient_code}</td>
                <td className="px-4 py-2 font-medium">
                  <Link className="hover:underline" href={`/consultation/${p.id}`}>{p.full_name}</Link>
                </td>
                <td className="px-4 py-2 text-neutral-600">{p.age} / {p.gender}</td>
                <td className="px-4 py-2 text-neutral-600">{p.phone}</td>
                <td className="flex max-w-xs flex-wrap gap-1 px-4 py-2">
                  {p.chronic_conditions.map((c) => (
                    <Badge key={c} variant="secondary" className="text-[11px]">{c}</Badge>
                  ))}
                  {p.allergies.length > 0 && (
                    <Badge variant="destructive" className="gap-1 text-[11px]">
                      <TriangleAlert className="h-3 w-3" aria-hidden />
                      {p.allergies.join(', ')}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/consultation/${p.id}`}>
                      <Stethoscope className="h-4 w-4" aria-hidden /> Start Consultation
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RegisterPatientDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
