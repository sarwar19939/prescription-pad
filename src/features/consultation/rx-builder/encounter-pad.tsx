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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 print:hidden">
        <h2 className="text-lg font-semibold">Consultation Pad</h2>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
          active draft · autosaved locally
        </span>
        {finalized && (
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Visit saved & finalized
          </span>
        )}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 print:hidden">
        <NotesVitals encounter={encounter} />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 print:hidden">
        <RxPad patient={patient} encounterId={encounter.id} />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 print:hidden">
        <AdviceSection encounter={encounter} />
      </div>

      <div className="flex items-center gap-2 print:hidden">
        <Button onClick={() => void finalize()}>
          {finalized ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
          Save & Finalize Visit
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden /> Print Prescription
        </Button>
        <span className="text-[10px] text-neutral-400">
          everything stores offline first, syncs when online
        </span>
      </div>

      {/* Print-only prescription sheet; invisible on screen. */}
      {tenant && (
        <PrintableRx patient={patient} encounter={encounter} items={items} reports={reports} tenant={tenant} />
      )}
    </div>
  );
}
