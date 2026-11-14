'use client';

/**
 * PrintableRx — dedicated @media print sheet: traditional single-page
 * medical prescription.
 * Supports:
 * - 4 Pad Layout Themes (Modern Teal, Classic Clinical, Executive Navy, Minimal Elegant).
 * - Custom Clinic Logo & Visiting Hours.
 * - Watermark (জলছাপ) with adjustable opacity.
 * - Special Notes / Chamber Footer Instructions.
 * - Clean O/E: ONLY physician manual examination is printed; AI notes are excluded.
 */
import { format } from 'date-fns';
import {
  formatSubcontinentRxLine,
  stripAiGeneratedFindings,
  toBengaliNumerals,
} from '@/lib/prescriptionFormatters';
import type { Encounter, InvestigationReport, Patient, PrescriptionItem, Tenant } from '@/types/schema';

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
  const padStyle = tenant.pad_layout_style || 'modern_teal';
  const logoUrl = tenant.logo_url;
  const watermarkOpacity = tenant.watermark_opacity ?? 0.07;
  const visitingHours = tenant.visiting_hours;
  const specialNotes = tenant.special_notes;

  const headerBorder =
    padStyle === 'classic_clinical' ? 'border-b-2 border-double border-black'
      : padStyle === 'executive_navy' ? 'border-b-2 border-blue-900'
      : padStyle === 'minimal_elegant' ? 'border-b border-zinc-400'
      : 'border-b-2 border-black';

  const patientBarBorder = padStyle === 'executive_navy' ? 'border-blue-900 bg-blue-50/40' : 'border-black';
  const manualOe = stripAiGeneratedFindings(encounter.clinical_findings);

  return (
    <div
      className="print-sheet relative bg-white text-black"
      style={{ paddingTop: `${topPad}mm`, paddingLeft: `${tenant.print_margin_left_mm}mm`, paddingRight: '10mm' }}
    >
      {/* Watermark (জলছাপ) Layer */}
      {tenant.watermark_enabled && (
        <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          {tenant.watermark_type === 'custom_image' && tenant.watermark_image_url ? (
            <img src={tenant.watermark_image_url} alt="" className="max-w-[360px] max-h-[360px] object-contain grayscale" style={{ opacity: watermarkOpacity }} />
          ) : tenant.watermark_type === 'logo' && logoUrl ? (
            <img src={logoUrl} alt="" className="max-w-[340px] max-h-[340px] object-contain grayscale" style={{ opacity: watermarkOpacity }} />
          ) : (
            <span className="text-6xl font-black uppercase tracking-widest text-slate-800 rotate-[-25deg] whitespace-nowrap" style={{ opacity: watermarkOpacity }}>
              {tenant.watermark_text || tenant.clinic_name}
            </span>
          )}
        </div>
      )}

      {/* Header (letterhead or pre-printed spacer) */}
      {!preprinted && (
        <div className={`relative z-10 ${headerBorder} pb-2`}>
          <div className="flex items-center justify-between gap-3">
            {logoUrl && <img src={logoUrl} alt="Clinic Logo" className="h-16 w-auto max-w-[80px] object-contain shrink-0" />}
            <div className={`flex-1 ${logoUrl ? 'text-left' : 'text-center'}`}>
              <div className="text-lg font-bold uppercase tracking-wide leading-tight">{tenant.clinic_name}</div>
              <div className="text-[12px] font-semibold mt-0.5">{tenant.doctor_name}, {tenant.degrees} — {tenant.specialty}</div>
              <div className="text-[10px] text-neutral-700">
                {tenant.reg_number ? `BM&DC Reg: ${tenant.reg_number} · ` : ''}{tenant.address}{tenant.address && tenant.phone ? ' · ' : ''}{tenant.phone ? `Phone: ${tenant.phone}` : ''}
              </div>
              {visitingHours && <div className="text-[9.5px] text-neutral-600 font-medium">সময়সূচী: {visitingHours}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Patient info bar */}
      <div className={`relative z-10 mt-1.5 flex flex-wrap items-center justify-between border-b ${patientBarBorder} py-1 text-[11px] font-semibold gap-x-3 gap-y-1`}>
        <span><strong>নাম:</strong> {patient.full_name}</span>
        <span><strong>বয়স/লিঙ্গ:</strong> {patient.age} Y / {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : patient.gender}</span>
        {encounter.vitals?.weight && <span><strong>ওজন:</strong> {encounter.vitals.weight} kg</span>}
        {patient.address && <span><strong>ঠিকানা:</strong> {patient.address}</span>}
        <span><strong>তারিখ:</strong> {format(new Date(encounter.visit_date + 'T00:00:00'), 'dd/MM/yyyy')}</span>
        <span><strong>আইডি:</strong> {patient.patient_code}</span>
        {encounter.vitals?.bp && <span><strong>BP:</strong> {encounter.vitals.bp}</span>}
      </div>

      {/* Two columns */}
      <div className="relative z-10 mt-2 grid grid-cols-[30%_70%] gap-4 text-[11px] leading-relaxed flex-1">
        <div className="border-r border-dashed border-black pr-3 flex flex-col">
          <PrintList heading="C/C" values={encounter.chief_complaints} />

          {((encounter.drug_history && encounter.drug_history.length > 0) || (patient.drug_history && patient.drug_history.length > 0)) && (
            <div className="mb-2">
              <div className="font-bold underline">Drug History (চলমান ওষুধ)</div>
              <ul className="list-disc pl-4">
                {(encounter.drug_history || patient.drug_history || []).map((dh) => <li key={dh}>{dh}</li>)}
              </ul>
            </div>
          )}

          <PrintList heading="Vitals">
            {VITAL_LABELS.filter(([k]) => k !== 'weight' && encounter.vitals[k]).map(([k, label]) => (
              <div key={k}>{label}: {encounter.vitals[k]}</div>
            ))}
          </PrintList>

          {(patient.chronic_conditions?.length > 0 || patient.allergies?.length > 0 || patient.medical_surgical_history) && (
            <div className="mb-1.5">
              <div className="font-bold underline">H/O (History)</div>
              {patient.chronic_conditions?.length > 0 && <div>• Illness: {patient.chronic_conditions.join(', ')}</div>}
              {patient.allergies?.length > 0 && <div className="font-bold">• Allergy: {patient.allergies.join(', ')}</div>}
              {patient.medical_surgical_history && <div>• Notes: {patient.medical_surgical_history}</div>}
            </div>
          )}

          {manualOe && (
            <div className="mb-1.5">
              <div className="font-bold underline">O/E</div>
              <p className="whitespace-pre-line">{manualOe}</p>
            </div>
          )}

          <PrintList heading="Lab Investigations">
            {reports.map((r) => (
              <div key={r.id}>
                • {r.test_name}{r.abnormality_flags.length > 0 ? ` (${r.abnormality_flags.join(', ')})` : ''}
              </div>
            ))}
            {reports.length === 0 && <div className="text-neutral-500">—</div>}
          </PrintList>
          <PrintList heading="Diagnosis" values={encounter.diagnosis} />
        </div>

        {/* Right column: ℞, Items, Advice, Follow-up, and pinned bottom-right signature */}
        <div className="flex flex-col justify-between min-h-[640px]">
          <div>
            <div className="mb-1 font-serif text-2xl leading-none">℞</div>
            <ol className="mb-3 flex flex-col gap-2">
              {items.map((item, i) => {
                const { title, dosageDetails, taperingLines } = formatSubcontinentRxLine(item);
                return (
                  <li key={item.id} className="break-words">
                    <div className="flex flex-wrap items-baseline gap-1">
                      <span className="font-semibold text-[11.5px]">
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
                        <div className="ml-3 text-[10.5px] font-medium text-neutral-800">{dosageDetails}</div>
                      )
                    )}
                  </li>
                );
              })}
              {items.length === 0 && <li className="text-neutral-500">(no medicines recorded)</li>}
            </ol>

            {encounter.advice.length > 0 && (
              <div className="mb-3">
                <div className="font-bold underline">Advice / পরামর্শ</div>
                <ul className="list-disc pl-4">{encounter.advice.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
            )}

            {(encounter.follow_up_text || encounter.follow_up_date) && (
              <div className="mb-4 text-[11px] font-bold text-neutral-900 border-l-2 border-black pl-2 py-0.5">
                পরবর্তী সাক্ষাৎ:{' '}
                {encounter.follow_up_text || format(new Date(encounter.follow_up_date! + 'T00:00:00'), 'dd/MM/yyyy')}
                {encounter.follow_up_text && encounter.follow_up_date && !encounter.follow_up_text.includes(encounter.follow_up_date) && (
                  <span className="font-normal text-[10px] text-neutral-600 ml-1">
                    ({format(new Date(encounter.follow_up_date + 'T00:00:00'), 'dd/MM/yyyy')})
                  </span>
                )}
              </div>
            )}

            {specialNotes && (
              <div className="mt-4 pt-1 border-t border-dotted border-neutral-400 text-[10px] text-neutral-600 italic">
                * {specialNotes}
              </div>
            )}
          </div>

          {/* Signature Block */}
          <div className="mt-auto pt-8 self-end text-right">
            <div className="w-52 border-t border-black pt-1 text-center">
              <div className="text-[12px] font-bold text-black">{tenant.doctor_name}</div>
              <div className="text-[10px] text-neutral-700 font-medium">
                {tenant.specialty || tenant.degrees || 'চিকিৎসক'}
              </div>
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
        <ul className="list-disc pl-4">{values.map((v) => <li key={v}>{v}</li>)}</ul>
      ) : (
        <div className="text-neutral-500">—</div>
      ))}
    </div>
  );
}
