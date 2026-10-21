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
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-sm text-neutral-900">Lab Reports & Trends</h3>
            <p className="text-xs text-neutral-500">Longitudinal analytics & document tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
                activeTab === 'trends' ? 'bg-white text-emerald-800 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" /> Longitudinal Trends
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
                activeTab === 'list' ? 'bg-white text-emerald-800 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Reports List ({reports.length})
            </button>
          </div>

          <Button size="sm" onClick={() => setDialogOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Log / Upload Report
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
                className="rounded-lg border border-neutral-200 bg-white p-3 shadow-xs hover:border-neutral-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-900">{r.test_name}</h4>
                    <span className="text-xs text-neutral-500">
                      Report Date: {format(new Date(r.report_date + 'T00:00:00'), 'dd MMMM yyyy')}
                    </span>
                  </div>
                  {r.abnormality_flags.length > 0 && (
                    <Badge variant="destructive" className="text-[10px]">
                      {r.abnormality_flags.length} Abnormal {r.abnormality_flags.length === 1 ? 'flag' : 'flags'}
                    </Badge>
                  )}
                </div>

                {/* Metrics list */}
                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 bg-neutral-50 p-2 rounded">
                  {Object.entries(r.extracted_metrics).map(([k, v]) => (
                    <div key={k} className="text-xs">
                      <span className="text-neutral-500 block text-[10px]">{k}</span>
                      <span className="font-semibold text-neutral-800">{String(v)}</span>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}
                {r.ai_summary && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-emerald-800 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
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
