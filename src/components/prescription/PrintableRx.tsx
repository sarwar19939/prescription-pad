'use client';

/**
 * PrintableRx — dedicated @media print sheet: traditional single-page
 * medical prescription with full color support and custom branding.
 * Supports:
 * - 7 Rich Color Themes (Teal, Navy, Emerald, Purple, Maroon, Charcoal, Minimal).
 * - Full color logos and watermarks without forced grayscale.
 * - Degree paragraph wrapping for multi-qualification physicians.
 * - Dynamic column width ratios (25/75, 30/70, 35/65, 40/60).
 * - Clean O/E: ONLY physician manual examination is printed; AI notes are excluded.
 */
import { format } from 'date-fns';
import {
  formatSubcontinentRxLine,
  stripAiGeneratedFindings,
  toBengaliNumerals,
} from '@/lib/prescriptionFormatters';
import { getColumnGridClass, getPadTheme } from '@/lib/prescriptionTheme';
import type { Encounter, InvestigationReport, Patient, PrescriptionItem, Tenant } from '@/types/schema';
import { PrintableRxHeader } from './PrintableRxHeader';

interface PrintableRxProps {
  tenant: Tenant;
  patient: Patient;
  encounter: Encounter;
  items: PrescriptionItem[];
  reports: InvestigationReport[];
}

const VITAL_LABELS: Array<[keyof Encounter['vitals'], string]> = [
  ['bp', 'BP'], ['pulse', 'Pulse'], ['temp', 'Temp'], ['weight', 'Wt'], ['spo2', 'SpO₂'],
];

export function PrintableRx({ tenant, patient, encounter, items, reports }: PrintableRxProps) {
  const preprinted = tenant.hide_header_for_print === true;
  const topPad = preprinted ? (tenant.print_margin_top_mm || 45) : 6;
  const logoUrl = tenant.logo_url;
  const watermarkOpacity = tenant.watermark_opacity ?? 0.07;
  const specialNotes = tenant.special_notes;
  const isMonochrome = tenant.print_color_mode === 'monochrome';
  const theme = getPadTheme(tenant.pad_layout_style);
  const gridClass = getColumnGridClass(tenant.column_ratio);
  const watermarkGrayscaleClass = tenant.watermark_color_mode === 'grayscale' ? 'grayscale' : '';

  const manualOe = stripAiGeneratedFindings(encounter.clinical_findings);

  return (
    <div
      className={`print-sheet relative bg-white text-slate-900 ${isMonochrome ? 'monochrome-print' : ''}`}
      style={{
        paddingTop: `${topPad}mm`,
        paddingLeft: `${tenant.print_margin_left_mm}mm`,
        paddingRight: '10mm',
      }}
    >
      {/* Watermark (জলছাপ) Layer */}
      {tenant.watermark_enabled && (
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0"
        >
          {tenant.watermark_type === 'custom_image' && tenant.watermark_image_url ? (
            <img
              src={tenant.watermark_image_url}
              alt=""
              className={`max-w-[380px] max-h-[380px] object-contain ${watermarkGrayscaleClass}`}
              style={{ opacity: watermarkOpacity }}
            />
          ) : tenant.watermark_type === 'logo' && logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className={`max-w-[360px] max-h-[360px] object-contain ${watermarkGrayscaleClass}`}
              style={{ opacity: watermarkOpacity }}
            />
          ) : (
            <span
              className="text-6xl font-black uppercase tracking-widest rotate-[-25deg] whitespace-nowrap"
              style={{
                opacity: watermarkOpacity,
                color: tenant.watermark_color || theme.hex,
              }}
            >
              {tenant.watermark_text || tenant.clinic_name}
            </span>
          )}
        </div>
      )}

      {/* Header and Patient Bar Component */}
      <PrintableRxHeader tenant={tenant} patient={patient} encounter={encounter} theme={theme} />

      {/* Two Columns Layout (Width Controlled by Column Ratio) */}
      <div className={`relative z-10 mt-3 grid ${gridClass} gap-4 text-[11px] leading-relaxed flex-1`}>
        {/* Left Column: Assessment (C/C, O/E, Vitals, History, Dx, Ix) */}
        <div className={`border-r border-dashed ${theme.dividerClass} pr-3 flex flex-col`}>
          <PrintList heading="C/C (Chief Complaints)" values={encounter.chief_complaints} theme={theme} />

          {((encounter.drug_history && encounter.drug_history.length > 0) || (patient.drug_history && patient.drug_history.length > 0)) && (
            <div className="mb-2">
              <div className={`font-bold ${theme.accentColorClass}`}>Drug History</div>
              <ul className="list-disc pl-4 text-slate-800">
                {(encounter.drug_history || patient.drug_history || []).map((dh) => <li key={dh}>{dh}</li>)}
              </ul>
            </div>
          )}

          <PrintList heading="Vitals" theme={theme}>
            {VITAL_LABELS.filter(([k]) => k !== 'weight' && encounter.vitals[k]).map(([k, label]) => (
              <div key={k}>{label}: <strong>{encounter.vitals[k]}</strong></div>
            ))}
          </PrintList>

          {(patient.chronic_conditions?.length > 0 || patient.allergies?.length > 0 || patient.medical_surgical_history) && (
            <div className="mb-1.5">
              <div className={`font-bold ${theme.accentColorClass}`}>H/O (Past History)</div>
              {patient.chronic_conditions?.length > 0 && <div>• Illness: {patient.chronic_conditions.join(', ')}</div>}
              {patient.allergies?.length > 0 && <div className="font-bold text-rose-700">• Allergy: {patient.allergies.join(', ')}</div>}
              {patient.medical_surgical_history && <div>• Notes: {patient.medical_surgical_history}</div>}
            </div>
          )}

          {manualOe && (
            <div className="mb-1.5">
              <div className={`font-bold ${theme.accentColorClass}`}>O/E (On Examination)</div>
              <p className="whitespace-pre-line text-slate-800">{manualOe}</p>
            </div>
          )}

          <PrintList heading="Investigations (Lab Tests)" theme={theme}>
            {reports.map((r) => (
              <div key={r.id}>
                • {r.test_name}{r.abnormality_flags.length > 0 ? ` (${r.abnormality_flags.join(', ')})` : ''}
              </div>
            ))}
            {reports.length === 0 && <div className="text-neutral-400">—</div>}
          </PrintList>

          <PrintList heading="Diagnosis (Dx)" values={encounter.diagnosis} theme={theme} />
        </div>

        {/* Right Column: ℞, Items, Space for Manual Rx, Advice, Space for Manual Advice, Signature */}
        <div className="flex flex-col justify-between min-h-[640px]">
          {/* Top section: ℞ Symbol & Prescribed Medicines */}
          <div>
            <div className={`mb-1.5 font-serif text-3xl font-bold leading-none ${theme.rxColorClass}`}>℞</div>
            <ol className="mb-3 flex flex-col gap-2.5">
              {items.map((item, i) => {
                const { title, dosageDetails, taperingLines } = formatSubcontinentRxLine(item);
                return (
                  <li key={item.id} className="break-words">
                    <div className="flex flex-wrap items-baseline gap-1">
                      <span className={`font-bold text-[12px] ${theme.titleColorClass}`}>
                        {toBengaliNumerals(i + 1)}. {title}
                      </span>
                    </div>
                    {taperingLines && taperingLines.length > 0 ? (
                      <div className="ml-3 mt-0.5 flex flex-col gap-0.5">
                        {taperingLines.map((line, lIdx) => (
                          <div key={lIdx} className="text-[10px] font-medium text-neutral-800">{line}</div>
                        ))}
                      </div>
                    ) : (
                      dosageDetails && (
                        <div className="ml-3 text-[11px] font-semibold text-slate-800">{dosageDetails}</div>
                      )
                    )}
                  </li>
                );
              })}
              {items.length === 0 && <li className="text-neutral-400 italic">(No medicines prescribed)</li>}
            </ol>
          </div>

          {/* Flexible breathing room between medicines and advice for manual handwritten medicines */}
          <div className="flex-1 min-h-[50px]" aria-hidden="true" />

          {/* Bottom section: Advice & Follow-up (positioned just above signature), Manual Advice space, and Signature */}
          <div className="mt-auto">
            {encounter.advice.length > 0 && (
              <div className="mb-2 pt-2 border-t border-slate-200">
                <div className={`font-bold mb-1 ${theme.accentColorClass}`}>Advice / পরামর্শ:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                  {encounter.advice.map((a) => <li key={a} className="leading-snug">{a}</li>)}
                </ul>
              </div>
            )}

            {(encounter.follow_up_text || encounter.follow_up_date) && (
              <div className={`mb-2 text-[11px] font-bold text-neutral-900 border-l-2 ${theme.borderClass} pl-2 py-0.5 bg-slate-50 rounded-r`}>
                Next Visit / Follow-up:{' '}
                {encounter.follow_up_text || format(new Date(encounter.follow_up_date! + 'T00:00:00'), 'dd/MM/yyyy')}
                {encounter.follow_up_text && encounter.follow_up_date && !encounter.follow_up_text.includes(encounter.follow_up_date) && (
                  <span className="font-normal text-[10px] text-neutral-600 ml-1">
                    ({format(new Date(encounter.follow_up_date + 'T00:00:00'), 'dd/MM/yyyy')})
                  </span>
                )}
              </div>
            )}

            {/* Blank room right above signature for doctor to write 1-2 extra advice notes by hand */}
            <div className="min-h-[30px]" aria-hidden="true" />

            {specialNotes && (
              <div className="mb-2 pt-1 border-t border-dotted border-neutral-300 text-[10px] text-neutral-600 italic">
                * {specialNotes}
              </div>
            )}

            {/* Signature Block */}
            <div className="pt-2 flex justify-end text-right">
              <div className={`w-52 border-t-2 ${theme.borderClass} pt-1.5 text-center`}>
                <div className={`text-[12.5px] font-bold ${theme.titleColorClass}`}>{tenant.doctor_name}</div>
                <div className="text-[10px] text-neutral-700 font-medium">
                  {tenant.specialty || tenant.degrees || 'চিকিৎসক'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintList({
  heading,
  values,
  theme,
  children,
}: {
  heading: string;
  values?: string[];
  theme: ReturnType<typeof getPadTheme>;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <div className={`font-bold mb-0.5 ${theme.accentColorClass}`}>{heading}</div>
      {children ?? (values && values.length > 0 ? (
        <ul className="list-disc pl-4 text-slate-800 space-y-0.5">
          {values.map((v) => <li key={v} className="leading-snug">{v}</li>)}
        </ul>
      ) : (
        <div className="text-neutral-400">—</div>
      ))}
    </div>
  );
}
