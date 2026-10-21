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

      <div className="grid min-h-0 grid-cols-1 gap-8 px-6 py-6 lg:grid-cols-2">
        {/* Left column: Tabbed between Longitudinal History and Lab Reports & Trends */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setLeftTab('history')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all ${
                  leftTab === 'history'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="h-4 w-4 text-teal-600" /> Past Encounters ({historyCount})
              </button>
              <button
                type="button"
                onClick={() => setLeftTab('labs')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all ${
                  leftTab === 'labs'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="h-4 w-4 text-teal-600" /> Lab Reports &amp; Trends ({labCount})
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCopilotOpen(true)}
              className="h-10 gap-2 border-indigo-200 text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 hover:border-indigo-300 font-semibold text-sm rounded-xl px-4 shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-indigo-600" />
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
        <div className="min-w-0 border-l border-slate-200/80 pl-8 max-lg:border-l-0 max-lg:pl-0">
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
