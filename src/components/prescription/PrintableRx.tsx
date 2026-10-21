'use client';

/**
 * PrintableRx — dedicated @media print sheet: traditional single-page
 * medical prescription. On screen it renders nothing (hidden); when the
 * browser prints, it becomes the only visible layer (see globals.css).
 *
 * - Header: doctor/clinic letterhead, or — if the tenant enabled
 *   hide_header_for_print — a blank spacer of print_margin_top_mm for
 *   pre-printed pads.
 * - Patient bar: Name, Age/Sex, Date, Patient ID.
 * - Left column (30%): C/C, vitals, O/E, lab investigations, diagnosis.
 * - Right column (70%): ℞ symbol, numbered meds, advice, signature.
 */
import { format } from 'date-fns';

import type { Encounter, InvestigationReport, Patient, PrescriptionItem, Tenant } from '@/types/schema';

interface PrintableRxProps {
  tenant: Tenant;
  patient: Patient;
  encounter: Encounter;
  items: PrescriptionItem[];
  reports: InvestigationReport[];
}

const VITAL_LABELS: Array<[keyof Encounter['vitals'], string]> = [
  ['bp', 'BP'],
  ['pulse', 'Pulse'],
  ['temp', 'Temp'],
  ['weight', 'Wt'],
  ['spo2', 'SpO₂'],
];

export function PrintableRx({
  tenant,
  patient,
  encounter,
  items,
  reports,
}: PrintableRxProps) {
  const preprinted = tenant.hide_header_for_print === true;
  const topPad = preprinted ? tenant.print_margin_top_mm : 6;
  return (
    <div
      className="print-sheet bg-white text-black"
      style={{ paddingTop: `${topPad}mm`, paddingLeft: `${tenant.print_margin_left_mm}mm`, paddingRight: '10mm' }}
    >
      {/* ---- Header (letterhead or pre-printed spacer) ---- */}
      {!preprinted ? (
        <div className="border-b-2 border-black pb-2 text-center">
          <div className="text-lg font-bold uppercase tracking-wide">{tenant.clinic_name}</div>
          <div className="text-[11px]">
            {tenant.doctor_name}, {tenant.degrees} — {tenant.specialty}
          </div>
          <div className="text-[10px]">
            {tenant.address}
            {tenant.address && tenant.phone ? ' · ' : ''}
            {tenant.phone ? `Phone: ${tenant.phone}` : ''}
          </div>
        </div>
      ) : (
        <div aria-hidden className="h-6" />
      )}

      {/* ---- Patient info bar ---- */}
      <div className="mt-2 flex flex-wrap items-center justify-between border-b border-black py-1 text-[11px] font-semibold">
        <span>
          {patient.full_name} — {patient.age} Y / {patient.gender}
        </span>
        <span>Date: {format(new Date(encounter.visit_date + 'T00:00:00'), 'dd/MM/yyyy')}</span>
        <span>ID: {patient.patient_code}</span>
      </div>

      {/* ---- Two columns ---- */}
      <div className="mt-2 grid grid-cols-[30%_70%] gap-4 text-[11px] leading-relaxed">
        <div className="border-r border-dashed border-black pr-3">
          <PrintList heading="C/C" values={encounter.chief_complaints} />
          <PrintList heading="Vitals">
            {VITAL_LABELS.filter(([k]) => encounter.vitals[k]).map(([k, label]) => (
              <div key={k}>
                {label}: {encounter.vitals[k]}
              </div>
            ))}
          </PrintList>
          {encounter.clinical_findings && (
            <>
              <div className="font-bold underline">O/E</div>
              <p className="mb-1">{encounter.clinical_findings}</p>
            </>
          )}
          <PrintList heading="Lab Investigations">
            {reports.map((r) => (
              <div key={r.id}>
                • {r.test_name}
                {r.abnormality_flags.length > 0 ? ` (${r.abnormality_flags.join(', ')})` : ''}
              </div>
            ))}
            {reports.length === 0 && <div className="text-neutral-500">—</div>}
          </PrintList>
          <PrintList heading="Diagnosis" values={encounter.diagnosis} />
        </div>

        <div>
          <div className="mb-1 font-serif text-2xl leading-none">℞</div>
          <ol className="mb-3 flex flex-col gap-1.5">
            {items.map((item, i) => (
              <li key={item.id} className="break-words">
                <span className="font-semibold">
                  {i + 1}. {item.dosage_form}. {item.brand_name} {item.strength}
                </span>
                {item.generic_name && (
                  <span className="ml-1 text-[9px] italic text-neutral-600">({item.generic_name})</span>
                )}
                <span className="text-[10px] text-neutral-700">
                  {item.schedule || item.meal_timing || item.duration
                    ? ` — ${item.schedule}${item.meal_timing ? ` (${item.meal_timing})` : ''}${item.duration ? ` × ${item.duration}` : ''}`
                    : ''}
                </span>
                {item.special_instructions && (
                  <span className="text-[10px] italic"> — {item.special_instructions}</span>
                )}
              </li>
            ))}
            {items.length === 0 && <li className="text-neutral-500">(no medicines recorded)</li>}
          </ol>

          {encounter.advice.length > 0 && (
            <div className="mb-3">
              <div className="font-bold underline">Advice</div>
              <ul className="list-disc pl-4">
                {encounter.advice.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {encounter.follow_up_date && (
            <div className="mb-8 text-[11px] font-semibold">
              Next Follow-up: {format(new Date(encounter.follow_up_date + 'T00:00:00'), 'dd/MM/yyyy')}
            </div>
          )}

          <div className="mt-10 text-right">
            <div className="mx-auto w-56 border-t border-black pt-1 text-[11px]">
              {tenant.doctor_name}
              <div className="text-[9px] font-normal">{tenant.degrees}</div>
              <div className="text-[9px] font-normal">{tenant.clinic_name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintList({ heading, values, children }: { heading: string; values?: string[]; children?: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="font-bold underline">{heading}</div>
      {children ?? (values && values.length > 0 ? (
        <ul className="list-disc pl-4">
          {values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      ) : (
        <div className="text-neutral-500">—</div>
      ))}
    </div>
  );
}

