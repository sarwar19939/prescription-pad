'use client';

/**
 * Left panel: longitudinal history timeline. Encounters and investigation
 * reports merged, newest to oldest; clicking a past visit expands its full
 * clinical detail plus "Copy Rx to Today".
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronDown, Copy, FlaskConical, Loader2, PackageOpen } from 'lucide-react';

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
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Longitudinal History
      </h3>
      {copyNote && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{copyNote}</p>
      )}
      {timeline === undefined && (
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-neutral-400" aria-hidden />
      )}
      {timeline && timeline.length === 0 && (
        <p className="rounded-md border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
          No past visits or reports for this patient yet.
        </p>
      )}
      <ol className="flex flex-col gap-2">
        {(timeline ?? []).map((item) => {
          const id = item.encounter?.id ?? item.report?.id ?? item.date;
          const expanded = expandedIds.has(id);
          const fmtDate = (d: string) =>
            d.includes('T') ? format(new Date(d), 'd MMM yyyy, h:mm a') : format(new Date(d + 'T00:00:00'), 'd MMM yyyy');
          const isToday = item.kind === 'encounter' && item.encounter && item.date === format(new Date(), 'yyyy-MM-dd');
          return (
            <li key={id} className="overflow-hidden rounded-md border border-neutral-200 bg-white">
              <button
                type="button"
                onClick={() => item.kind === 'encounter' && toggle(id)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                aria-expanded={item.kind === 'encounter' ? expanded : undefined}
              >
                {item.kind === 'encounter' ? (
                  <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${expanded ? '' : '-rotate-90'}`} aria-hidden />
                ) : (
                  <FlaskConical className="h-4 w-4 text-indigo-600" aria-hidden />
                )}
                <span className="text-sm font-medium">{fmtDate(item.date)}</span>
                {item.kind === 'encounter' ? (
                  <span className="truncate text-xs text-neutral-500">
                    {(item.encounter?.diagnosis ?? []).join(', ') || 'Visit'}
                  </span>
                ) : (
                  <span className="truncate text-xs text-neutral-500">{item.report?.test_name}</span>
                )}
                {isToday && <Badge className="ml-auto text-[11px]">Today</Badge>}
              </button>

              {item.kind === 'report' && (
                <div className="border-t border-neutral-100 bg-indigo-50/50 px-3 py-2 text-xs text-neutral-600">
                  <p>{item.report?.test_name}</p>
                  {(item.report?.abnormality_flags ?? []).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(item.report?.abnormality_flags ?? []).map((f) => (
                        <Badge key={f} variant="destructive" className="text-[10px]">{f}</Badge>
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
    <div className="border-t border-neutral-100 bg-neutral-50 px-3 py-3 text-xs">
      <Detail label="Chief Complaints" values={encounter.chief_complaints} />
      <Detail label="Vitals">
        <span className="text-neutral-700">
          BP {encounter.vitals.bp || '—'} · Pulse {encounter.vitals.pulse || '—'} · Temp {encounter.vitals.temp || '—'} · Wt {encounter.vitals.weight || '—'} · SpO₂ {encounter.vitals.spo2 || '—'}
        </span>
      </Detail>
      <Detail label="Clinical Findings">
        <span className="text-neutral-700">{encounter.clinical_findings || '—'}</span>
      </Detail>
      <Detail label="Diagnosis" values={encounter.diagnosis} />
      <Detail label="Advice" values={encounter.advice} />
      <Detail label="Medicines Prescribed">
        {(lines ?? []).length === 0 ? (
          <span className="text-neutral-500">None recorded.</span>
        ) : (
          <ul className="flex flex-col gap-1">
            {(lines ?? []).map((rx) => (
              <li key={rx.id} className="flex items-center gap-1.5">
                <PackageOpen className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden />
                <span className="font-medium text-neutral-800">
                  {rx.brand_name} {rx.strength} ({rx.dosage_form})
                </span>
                <span className="text-neutral-500">{rx.schedule} · {rx.meal_timing} · {rx.duration}</span>
              </li>
            ))}
          </ul>
        )}
      </Detail>
      <Button size="sm" variant="outline" className="mt-2" onClick={onCopy} disabled={copying}>
        {copying ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        Copy Rx to Today
      </Button>
    </div>
  );
}

function Detail({ label, values, children }: { label: string; values?: string[]; children?: React.ReactNode }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="w-32 shrink-0 font-medium text-neutral-500">{label}</span>
      <div>
        {children ?? (values && values.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {values.map((v) => (
              <Badge key={v} variant="secondary" className="text-[10px]">{v}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-neutral-500">—</span>
        ))}
      </div>
    </div>
  );
}
