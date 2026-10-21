'use client';

/**
 * Right-hand clinical pad: today's active Encounter (notes, vitals, Rx,
 * advice) + "Save & Finalize Visit" and "Print Prescription". The draft
 * encounter is created on demand; every edit writes Dexie first with
 * sync_status: 'pending' (offline-first, 0ms local round-trips).
 */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, Loader2, Printer, Save } from 'lucide-react';

import { db } from '@/db/localDb';
import { ensureTodayEncounter, findTodayEncounter } from '../copy-rx';
import { AdviceSection } from './advice-section';
import { NotesVitals } from './notes-vitals';
import { RxPad } from './rx-pad';
import { PrintableRx } from '@/components/prescription/PrintableRx';
import type { Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';

export function EncounterPad({ patient }: { patient: Patient }) {
  const [readyEncounterId, setReadyEncounterId] = useState<string | null>(null);
  const [finalized, setFinalized] = useState(false);

  // Guarantees an active draft encounter for today (idempotent).
  useEffect(() => {
    let cancelled = false;
    void ensureTodayEncounter(patient).then((e) => {
      if (!cancelled) setReadyEncounterId(e.id);
    });
    return () => {
      cancelled = true;
    };
  }, [patient.id]);

  const encounter = useLiveQuery(
    () => findTodayEncounter(patient.id),
    [patient.id],
  );

  const items = useLiveQuery(
    async () => {
      if (!encounter) return [];
      const rows = await db.prescription_items
        .where('encounter_id')
        .equals(encounter.id)
        .toArray();
      return rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
    },
    [encounter?.id],
    [],
  );

  const reports = useLiveQuery(
    async () =>
      db.investigation_reports.where('patient_id').equals(patient.id).toArray(),
    [patient.id],
    [],
  );

  const tenant = useLiveQuery(
    () => db.tenants.get(patient.tenant_id),
    [patient.tenant_id],
  );

  const finalize = async () => {
    if (!encounter) return;
    // Touch the record so the sync engine re-drains this visit as a unit.
    await db.encounters.update(encounter.id, {
      updated_at: new Date().toISOString(),
      sync_status: 'pending' as const,
    });
    await db.prescription_items
      .where('encounter_id')
      .equals(encounter.id)
      .modify({ updated_at: new Date().toISOString(), sync_status: 'pending' as const });
    setFinalized(true);
  };

  if (!encounter) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-neutral-200 bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" aria-hidden />
        <span className="ml-2 text-sm text-neutral-500">Preparing today&apos;s encounter…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Consultation Pad</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 border border-slate-200/80">
          active draft · autosaved locally
        </span>
        {finalized && (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden /> Visit saved &amp; finalized
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs print:hidden">
        <NotesVitals encounter={encounter} />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs print:hidden">
        <RxPad patient={patient} encounterId={encounter.id} />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs print:hidden">
        <AdviceSection encounter={encounter} />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2 print:hidden">
        <Button
          onClick={() => void finalize()}
          className="h-12 px-6 rounded-xl font-semibold text-base bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
        >
          {finalized ? <CheckCircle2 className="h-5 w-5 mr-2" aria-hidden /> : <Save className="h-5 w-5 mr-2" aria-hidden />}
          Save &amp; Finalize Visit
        </Button>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="h-12 px-6 rounded-xl font-semibold text-base border-slate-300 text-slate-700 hover:text-teal-700 hover:border-teal-500 transition-all"
        >
          <Printer className="h-5 w-5 mr-2" aria-hidden /> Print Prescription
        </Button>
        <span className="text-xs text-slate-400 font-medium">
          Zero-delay local storage (Dexie.js), synced when online
        </span>
      </div>

      {/* Print-only prescription sheet; invisible on screen. */}
      {tenant && (
        <PrintableRx patient={patient} encounter={encounter} items={items} reports={reports} tenant={tenant} />
      )}
    </div>
  );
}
