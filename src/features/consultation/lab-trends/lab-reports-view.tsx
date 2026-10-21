'use client';

/**
 * Lab Reports & Trends View:
 * Displays recent investigation records, longitudinal parameter trends,
 * and entry point to upload/log new lab reports.
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { FileText, FlaskConical, Plus, Sparkles, TrendingUp } from 'lucide-react';

import { db } from '@/db/localDb';
import type { Patient } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddReportDialog } from './add-report-dialog';
import { MetricsTrendTable } from './metrics-trend-table';

interface LabReportsViewProps {
  patient: Patient;
  encounterId?: string | null;
}

export function LabReportsView({ patient, encounterId }: LabReportsViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'trends' | 'list'>('trends');

  const reports = useLiveQuery(
    async () => {
      const rows = await db.investigation_reports
        .where('patient_id')
        .equals(patient.id)
        .toArray();
      return rows.sort((a, b) => b.report_date.localeCompare(a.report_date));
    },
    [patient.id],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <FlaskConical className="h-5 w-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-base text-slate-900">Lab Reports &amp; Trends</h3>
            <p className="text-xs text-slate-500 font-medium">Longitudinal analytics &amp; document tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
                activeTab === 'trends' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 text-teal-600" /> Trends
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
                activeTab === 'list' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4 text-teal-600" /> Reports ({reports.length})
            </button>
          </div>

          <Button onClick={() => setDialogOpen(true)} className="h-10 px-4 rounded-xl font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs">
            <Plus className="h-4 w-4 mr-1.5" /> Log Report
          </Button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'trends' ? (
        <MetricsTrendTable reports={reports} />
      ) : (
        <div className="flex flex-col gap-3">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-neutral-500">
              <FlaskConical className="mb-2 h-8 w-8 text-neutral-300" />
              <p>No lab records logged for this patient yet.</p>
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{r.test_name}</h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Report Date: {format(new Date(r.report_date + 'T00:00:00'), 'dd MMMM yyyy')}
                    </span>
                  </div>
                  {r.abnormality_flags.length > 0 && (
                    <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-semibold px-2.5 py-0.5">
                      {r.abnormality_flags.length} Abnormal {r.abnormality_flags.length === 1 ? 'flag' : 'flags'}
                    </Badge>
                  )}
                </div>

                {/* Metrics list */}
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {Object.entries(r.extracted_metrics).map(([k, v]) => (
                    <div key={k} className="text-sm">
                      <span className="text-slate-500 block text-xs font-medium uppercase tracking-wider">{k}</span>
                      <span className="font-mono font-bold text-slate-900 text-base">{String(v)}</span>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}
                {r.ai_summary && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-indigo-900 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 leading-relaxed font-medium">
                    <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                    <span>{r.ai_summary}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <AddReportDialog
        patient={patient}
        encounterId={encounterId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
