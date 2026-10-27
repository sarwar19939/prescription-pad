'use client';

/** Split-screen clinical workspace: history/labs (left) and today's encounter pad (right). */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Columns2,
  FileText,
  FlaskConical,
  History,
  Loader2,
  Sparkles,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { findTodayEncounter } from './copy-rx';
import { PatientBanner } from './patient-banner';
import { HistoryTimeline } from './history-timeline';
import { EncounterPad } from './rx-builder/encounter-pad';
import { LabReportsView } from './lab-trends/lab-reports-view';
import { AICopilotDrawer } from './ai-copilot/ai-copilot-drawer';
import { Button } from '@/components/ui/button';

export function ConsultationClient({ patientId }: { patientId: string }) {
  const [viewMode, setViewMode] = useState<'pad' | 'split' | 'history'>('pad');
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
    <div className="flex min-h-0 flex-col gap-0 bg-slate-50/50">
      <PatientBanner patient={patient} onOpenCopilot={() => setCopilotOpen(true)} />

      {/* View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-6 py-2.5 print:hidden">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('pad')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              viewMode === 'pad' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-teal-600" /> প্রেসক্রিপশন প্যাড
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              viewMode === 'split' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns2 className="h-3.5 w-3.5 text-teal-600" /> স্প্লিট ভিউ
          </button>
          <button
            type="button"
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              viewMode === 'history' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="h-3.5 w-3.5 text-teal-600" /> অতীত ইতিহাস ও ল্যাব ({historyCount + labCount})
          </button>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setCopilotOpen(true)}
          className="h-9 gap-1.5 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold text-xs rounded-xl px-3.5 shadow-2xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> AI ক্লিনিক্যাল কো-পাইলট
        </Button>
      </div>

      {/* Workspace Content according to View Mode */}
      <div className="px-4 sm:px-6 py-5">
        {viewMode === 'pad' && (
          <div className="max-w-5xl mx-auto">
            <EncounterPad patient={patient} />
          </div>
        )}

        {viewMode === 'history' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLeftTab('history')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    leftTab === 'history' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-teal-600" /> Past Encounters ({historyCount})
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab('labs')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    leftTab === 'labs' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FlaskConical className="h-3.5 w-3.5 text-teal-600" /> Lab Reports &amp; Trends ({labCount})
                </button>
              </div>
            </div>
            {leftTab === 'history' ? (
              <HistoryTimeline patient={patient} />
            ) : (
              <LabReportsView patient={patient} encounterId={todayEncounter?.id} />
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-6">
            <div className="flex flex-col gap-4 border-r border-slate-200 pr-4">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLeftTab('history')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    leftTab === 'history' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 text-teal-600" /> Past ({historyCount})
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab('labs')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    leftTab === 'labs' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <FlaskConical className="h-3.5 w-3.5 text-teal-600" /> Labs ({labCount})
                </button>
              </div>
              {leftTab === 'history' ? (
                <HistoryTimeline patient={patient} />
              ) : (
                <LabReportsView patient={patient} encounterId={todayEncounter?.id} />
              )}
            </div>

            <div>
              <EncounterPad patient={patient} />
            </div>
          </div>
        )}
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
