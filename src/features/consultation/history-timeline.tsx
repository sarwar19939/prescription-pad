'use client';

/**
 * Left panel: longitudinal history timeline. Encounters and investigation
 * reports merged, newest to oldest; clicking a past visit expands its full
 * clinical detail plus "Copy Rx to Today".
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronDown, Copy, FlaskConical, Loader2, PackageOpen, Trash2 } from 'lucide-react';

import { db } from '@/db/localDb';
import { copyRxToToday } from './copy-rx';
import type { Encounter, InvestigationReport, Patient } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TimelineItem {
  kind: 'encounter' | 'report';
  date: string;
  encounter?: Encounter;
  report?: InvestigationReport;
}

export function HistoryTimeline({ patient }: { patient: Patient }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [copyNote, setCopyNote] = useState<string | null>(null);

  const timeline = useLiveQuery(async (): Promise<TimelineItem[]> => {
    const [encounters, reports] = await Promise.all([
      db.encounters.where('patient_id').equals(patient.id).toArray(),
      db.investigation_reports.where('patient_id').equals(patient.id).toArray(),
    ]);
    const items: TimelineItem[] = [
      ...encounters.map((encounter) => ({ kind: 'encounter' as const, date: encounter.visit_date, encounter })),
      ...reports.map((report) => ({ kind: 'report' as const, date: report.report_date, report })),
    ];
    return items.sort((a, b) => b.date.localeCompare(a.date));
  }, [patient.id]);

  const toggle = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onCopy = async (encounter: Encounter) => {
    setCopyingId(encounter.id);
    const result = await copyRxToToday(patient, encounter.id);
    setCopyingId(null);
    setCopyNote(result && result.copied > 0
      ? `Copied ${result.copied} medicine${result.copied === 1 ? '' : 's'} to today.`
      : result ? 'Nothing new to copy — already in today\'s Rx.' : 'Could not copy.');
    setTimeout(() => setCopyNote(null), 3500);
  };

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Longitudinal History
      </h3>
      {copyNote && (
        <p className="rounded-xl bg-teal-50 border border-teal-200 px-3.5 py-2.5 text-sm font-medium text-teal-800">{copyNote}</p>
      )}
      {timeline === undefined && (
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-400" aria-hidden />
      )}
      {timeline && timeline.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          No past visits or reports for this patient yet.
        </p>
      )}
      <ol className="flex flex-col gap-2.5">
        {(timeline ?? []).map((item) => {
          const id = item.encounter?.id ?? item.report?.id ?? item.date;
          const expanded = expandedIds.has(id);
          const fmtDate = (d: string) =>
            d.includes('T') ? format(new Date(d), 'd MMM yyyy, h:mm a') : format(new Date(d + 'T00:00:00'), 'd MMM yyyy');
          const isToday = item.kind === 'encounter' && item.encounter && item.date === format(new Date(), 'yyyy-MM-dd');
          return (
            <li key={id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all">
              <button
                type="button"
                onClick={() => item.kind === 'encounter' && toggle(id)}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left hover:bg-slate-50/80 transition-colors"
                aria-expanded={item.kind === 'encounter' ? expanded : undefined}
              >
                {item.kind === 'encounter' ? (
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? '' : '-rotate-90'}`} aria-hidden />
                ) : (
                  <FlaskConical className="h-4 w-4 text-indigo-600" aria-hidden />
                )}
                <span className="text-sm font-semibold text-slate-900">{fmtDate(item.date)}</span>
                {item.kind === 'encounter' ? (
                  <span className="truncate text-sm text-slate-500 font-medium">
                    {(item.encounter?.diagnosis ?? []).join(', ') || 'Consultation'}
                  </span>
                ) : (
                  <span className="truncate text-sm text-slate-500 font-medium">{item.report?.test_name}</span>
                )}
                {isToday && <Badge className="ml-auto bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 border-teal-200">Today</Badge>}
              </button>

              {item.kind === 'report' && (
                <div className="border-t border-slate-100 bg-indigo-50/40 px-4 py-3 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">{item.report?.test_name}</p>
                  {(item.report?.abnormality_flags ?? []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(item.report?.abnormality_flags ?? []).map((f) => (
                        <Badge key={f} variant="destructive" className="text-xs bg-rose-50 text-rose-700 border-rose-200 font-medium px-2 py-0.5">{f}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {item.kind === 'encounter' && expanded && item.encounter && (
                <EncounterDetail encounter={item.encounter} onCopy={() => void onCopy(item.encounter!)} copying={copyingId === item.encounter.id} />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function EncounterDetail({
  encounter,
  onCopy,
  copying,
}: {
  encounter: Encounter;
  onCopy: () => void;
  copying: boolean;
}) {
  const lines = useLiveQuery(
    async () => {
      const items = await db.prescription_items
        .where('encounter_id')
        .equals(encounter.id)
        .toArray();
      return items.sort((a, b) => a.brand_name.localeCompare(b.brand_name));
    },
    [encounter.id],
    [],
  );

  return (
    <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3.5 text-sm leading-relaxed flex flex-col gap-2">
      <Detail label="Chief Complaints" values={encounter.chief_complaints} />
      <Detail label="Vitals">
        <span className="font-mono text-sm text-slate-800">
          BP {encounter.vitals.bp || '—'} · Pulse {encounter.vitals.pulse || '—'} · Temp {encounter.vitals.temp || '—'} · Wt {encounter.vitals.weight || '—'} · SpO₂ {encounter.vitals.spo2 || '—'}
        </span>
      </Detail>
      <Detail label="Clinical Findings">
        <span className="text-slate-800">{encounter.clinical_findings || '—'}</span>
      </Detail>
      <Detail label="Diagnosis" values={encounter.diagnosis} />
      <Detail label="Advice" values={encounter.advice} />
      <Detail label="Prescription">
        {(lines ?? []).length === 0 ? (
          <span className="text-slate-500">None recorded.</span>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {(lines ?? []).map((rx) => (
              <li key={rx.id} className="flex items-center gap-2">
                <PackageOpen className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />
                <span className="font-bold text-slate-900">
                  {rx.brand_name} {rx.strength}
                </span>
                <span className="text-slate-500 text-xs">({rx.dosage_form})</span>
                <span className="font-mono text-slate-700 text-sm">{rx.schedule}</span>
                <span className="text-slate-500 text-sm">· {rx.meal_timing} · {rx.duration}</span>
              </li>
            ))}
          </ul>
        )}
      </Detail>
      <div className="pt-2 flex items-center justify-between">
        <Button size="sm" variant="outline" className="h-9 px-3 rounded-xl font-medium text-xs border-slate-300 text-slate-700 hover:text-teal-700 hover:border-teal-500 flex items-center gap-1.5" onClick={onCopy} disabled={copying}>
          {copying ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          Copy Rx to Today
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-9 px-2.5 rounded-xl font-medium text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
          onClick={async () => {
            if (confirm('এই ভিজিট ও প্রেসক্রিপশন মুছে ফেলতে চান?')) {
              await db.prescription_items.where('encounter_id').equals(encounter.id).delete();
              await db.encounters.delete(encounter.id);
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Visit
        </Button>
      </div>
    </div>
  );
}

function Detail({ label, values, children }: { label: string; values?: string[]; children?: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 py-0.5">
      <span className="w-32 shrink-0 font-semibold text-slate-600">{label}</span>
      <div className="flex-1">
        {children ?? (values && values.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {values.map((v) => (
              <Badge key={v} variant="secondary" className="text-xs bg-slate-200/80 text-slate-800 font-medium px-2 py-0.5">{v}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-slate-400">—</span>
        ))}
      </div>
    </div>
  );
}
