'use client';

/**
 * Right-hand clinical pad: today's active Encounter (notes, vitals, Rx,
 * advice) + "Save & Finalize Visit" and "Print Prescription". The draft
 * encounter is created on demand; every edit writes Dexie first with
 * sync_status: 'pending' (offline-first, 0ms local round-trips).
 */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, FileText, Loader2, Printer, Save, Sparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { ensureTodayEncounter, findTodayEncounter } from '../copy-rx';
import { PrescriplyPadHeader } from './prescriply-pad-header';
import { PrescriplyClinicalSidebar } from './prescriply-clinical-sidebar';
import { AdviceSection } from './advice-section';
import { RxPad } from './rx-pad';
import { PrescriplySignatureBlock } from './prescriply-signature-block';
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
      {/* Top Pad Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-teal-700" />
          <h2 className="text-lg font-bold tracking-tight text-slate-900">ডিজিটাল প্রেসক্রিপশন প্যাড</h2>
          <span className="rounded-full bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 text-xs font-semibold">
            Prescriply Studio Layout
          </span>
        </div>

        <div className="flex items-center gap-2">
          {finalized && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden /> সংরক্ষিত
            </span>
          )}
          <Button
            size="sm"
            onClick={() => void finalize()}
            className="h-9 px-4 rounded-xl font-semibold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
          >
            <Save className="h-4 w-4 mr-1.5" /> সংরক্ষণ করুন
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="h-9 px-4 rounded-xl font-semibold text-xs border-slate-300 text-slate-700 hover:text-teal-700 hover:border-teal-500"
          >
            <Printer className="h-4 w-4 mr-1.5" /> প্রিন্ট প্রেসক্রিপশন
          </Button>
        </div>
      </div>

      {/* Unified Digital Prescription Pad Sheet (A4 Style Canvas) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm max-w-5xl mx-auto w-full space-y-6 print:hidden">
        {/* 1. Letterhead & Patient Bar */}
        <PrescriplyPadHeader tenant={tenant} patient={patient} encounter={encounter} />

        {/* 2. Authentic Two-Column Clinical Pad Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[33%_67%] gap-6 text-slate-900">
          {/* Left Column (33%): Clinical Assessment (C/C, O/E, Vitals, History, Dx, Ix) */}
          <div className="lg:border-r lg:border-dashed lg:border-slate-300 lg:pr-5">
            <PrescriplyClinicalSidebar
              encounter={encounter}
              patient={patient}
              reports={reports}
            />
          </div>

          {/* Right Column (67%): ℞ Prescription Canvas, Medicines, Advice, Follow-up */}
          <div className="lg:pl-2 space-y-6">
            <RxPad patient={patient} encounterId={encounter.id} />
            <div className="pt-4 border-t border-slate-100">
              <AdviceSection encounter={encounter} />
            </div>
            <PrescriplySignatureBlock tenant={tenant} />
          </div>
        </div>
      </div>

      {/* Print-only prescription sheet; invisible on screen. */}
      {tenant && (
        <PrintableRx patient={patient} encounter={encounter} items={items} reports={reports} tenant={tenant} />
      )}
    </div>
  );
}
