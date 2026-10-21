'use client';

/** Split-screen clinical workspace: history/labs (left) and today's encounter pad (right). */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { ArrowLeft, Clock, FlaskConical, Loader2, Sparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { findTodayEncounter } from './copy-rx';
import { PatientBanner } from './patient-banner';
import { HistoryTimeline } from './history-timeline';
import { EncounterPad } from './rx-builder/encounter-pad';
import { LabReportsView } from './lab-trends/lab-reports-view';
import { AICopilotDrawer } from './ai-copilot/ai-copilot-drawer';
import { Button } from '@/components/ui/button';

export function ConsultationClient({ patientId }: { patientId: string }) {
  const [leftTab, setLeftTab] = useState<'history' | 'labs'>('history');
  const [copilotOpen, setCopilotOpen] = useState(false);

  // `null` = still loading, `undefined` = patient not found in Dexie.
  const patient = useLiveQuery(
    () => db.patients.get(patientId),
    [patientId],
    null,
  );

  const todayEncounter = useLiveQuery(
    () => findTodayEncounter(patientId),
    [patientId],
  );

  const labCount = useLiveQuery(
    () => db.investigation_reports.where('patient_id').equals(patientId).count(),
    [patientId],
    0,
  );

  const historyCount = useLiveQuery(
    () => db.encounters.where('patient_id').equals(patientId).count(),
    [patientId],
    0,
  );

  if (patient === null) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
        <span className="text-sm">Opening patient record…</span>
      </div>
    );
  }

  if (patient === undefined) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-neutral-500">
        <span className="text-sm">Patient not found.</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/patients"><ArrowLeft className="h-4 w-4" aria-hidden /> Back to Patients</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-0">
      <PatientBanner patient={patient} onOpenCopilot={() => setCopilotOpen(true)} />

      <div className="grid min-h-0 grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-2">
        {/* Left column: Tabbed between Longitudinal History and Lab Reports & Trends */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => setLeftTab('history')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                  leftTab === 'history'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Clock className="h-3.5 w-3.5" /> Past Encounters ({historyCount})
              </button>
              <button
                type="button"
                onClick={() => setLeftTab('labs')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                  leftTab === 'labs'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5" /> Lab Reports &amp; Trends ({labCount})
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCopilotOpen(true)}
              className="text-xs h-7 gap-1 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              AI Co-Pilot
            </Button>
          </div>

          {leftTab === 'history' ? (
            <HistoryTimeline patient={patient} />
          ) : (
            <LabReportsView patient={patient} encounterId={todayEncounter?.id} />
          )}
        </div>

        {/* Right column: Today's consultation encounter pad */}
        <div className="min-w-0 border-l border-neutral-200 pl-6 max-lg:border-l-0 max-lg:pl-0">
          <EncounterPad patient={patient} />
        </div>
      </div>

      {/* AI Clinical Co-Pilot Drawer */}
      <AICopilotDrawer
        patient={patient}
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        activeEncounter={todayEncounter}
      />
    </div>
  );
}
