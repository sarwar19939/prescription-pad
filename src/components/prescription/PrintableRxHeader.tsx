'use client';

/**
 * PrintableRxHeader — Dedicated Print Letterhead and Patient Demographic Strip.
 * Formats doctor qualifications with paragraph word wrapping and full theme styling.
 */
import { format } from 'date-fns';
import { formatPatientAge } from '@/lib/prescriptionFormatters';
import {
  formatDegreesList,
  getLogoSizeClasses,
  getPadTheme,
} from '@/lib/prescriptionTheme';
import type { Encounter, Patient, Tenant } from '@/types/schema';

interface PrintableRxHeaderProps {
  tenant: Tenant;
  patient: Patient;
  encounter: Encounter;
  theme: ReturnType<typeof getPadTheme>;
}

export function PrintableRxHeader({
  tenant,
  patient,
  encounter,
  theme,
}: PrintableRxHeaderProps) {
  const preprinted = tenant.hide_header_for_print === true;
  const logoUrl = tenant.logo_url;
  const visitingHours = tenant.visiting_hours;
  const degreeLines = formatDegreesList(tenant.degrees);
  const logoSizeClass = getLogoSizeClasses(tenant.logo_size);
  const logoGrayscaleClass = tenant.logo_grayscale ? 'grayscale' : '';
  const headerAlign = tenant.header_alignment || 'split';
  const logoPosition = tenant.logo_position || 'left';

  const renderLogo = (extraClasses = '') => {
    if (!logoUrl) return null;
    return (
      <img
        src={logoUrl}
        alt="Clinic Logo"
        className={`${logoSizeClass} object-contain shrink-0 ${logoGrayscaleClass} ${extraClasses}`}
      />
    );
  };

  const renderDoctorInfo = (align: 'left' | 'center' = 'left') => (
    <div className={align === 'center' ? 'text-center' : 'flex-1 min-w-0'}>
      <div className={`text-lg font-black tracking-tight leading-tight ${theme.titleColorClass}`}>
        {tenant.doctor_name}
      </div>
      <div className="mt-0.5 space-y-0.5 max-w-md">
        {degreeLines.map((line, idx) => (
          <div
            key={idx}
            className={`text-[11px] font-semibold ${theme.accentColorClass} leading-snug whitespace-pre-wrap break-words`}
          >
            {line}
          </div>
        ))}
      </div>
      {tenant.specialty && (
        <div className="text-[11px] font-medium text-slate-800 mt-0.5">
          {tenant.specialty}
        </div>
      )}
      {tenant.reg_number && (
        <div className="text-[10px] text-neutral-600 font-mono mt-0.5">
          BM&amp;DC Reg. No: <span className="font-bold text-slate-800">{tenant.reg_number}</span>
        </div>
      )}
    </div>
  );

  const renderClinicInfo = (align: 'right' | 'center' = 'right') => (
    <div className={align === 'center' ? 'text-center' : 'text-right shrink-0 max-w-xs'}>
      <div className={`text-base font-bold uppercase tracking-wide leading-tight ${theme.titleColorClass}`}>
        {tenant.clinic_name}
      </div>
      {tenant.address && <div className="text-[10.5px] text-neutral-700 mt-0.5 leading-snug">{tenant.address}</div>}
      {tenant.phone && (
        <div className="text-[10.5px] text-neutral-800 font-semibold mt-0.5">
          Phone: {tenant.phone}
        </div>
      )}
      {visitingHours && (
        <div className="text-[10px] font-medium text-teal-800 mt-0.5">
          Visiting Hours: {visitingHours}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Header (Letterhead or Pre-printed Spacer) */}
      {!preprinted && (
        <div className={`relative z-10 border-b-2 ${theme.borderClass} pb-2.5`}>
          {headerAlign === 'centered' ? (
            <div className="flex flex-col items-center text-center">
              {renderLogo('mb-1.5')}
              <div className={`text-base font-bold uppercase tracking-wide leading-tight ${theme.titleColorClass}`}>
                {tenant.clinic_name}
              </div>
              <div className={`text-lg font-black tracking-tight mt-0.5 ${theme.titleColorClass}`}>
                {tenant.doctor_name}
              </div>
              <div className="space-y-0.5 max-w-xl mt-0.5">
                {degreeLines.map((line, idx) => (
                  <div key={idx} className={`text-[11.5px] font-semibold ${theme.accentColorClass} leading-snug whitespace-pre-wrap break-words`}>
                    {line}
                  </div>
                ))}
              </div>
              {tenant.specialty && (
                <div className="text-[11px] font-medium text-slate-800 mt-0.5">
                  {tenant.specialty}
                </div>
              )}
              <div className="text-[10px] text-neutral-600 mt-1 flex flex-wrap items-center justify-center gap-2">
                {tenant.reg_number && <span>BM&amp;DC Reg: <strong className="text-slate-800">{tenant.reg_number}</strong></span>}
                {tenant.address && <span>{tenant.address}</span>}
                {tenant.phone && <span>Phone: {tenant.phone}</span>}
                {visitingHours && <span className="font-medium text-teal-800">Visiting Hours: {visitingHours}</span>}
              </div>
            </div>
          ) : logoPosition === 'center' && logoUrl ? (
            /* 3-Column Balanced Header for Print (Doctor Left | Logo Dead-Center | Clinic Right) */
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              {/* Doctor Details (Left) */}
              <div className="min-w-0 text-left">
                {renderDoctorInfo('left')}
              </div>

              {/* Logo in Exact Center (Marked by User) */}
              <div className="flex flex-col items-center justify-center px-3 self-center">
                {renderLogo()}
              </div>

              {/* Clinic Info (Right) */}
              <div className="min-w-0 text-right justify-self-end">
                {renderClinicInfo('right')}
              </div>
            </div>
          ) : (
            /* Split / Left Header Layout with Flexible Logo Placement (Left, Center, Right) */
            <div className="flex items-start justify-between gap-4">
              {/* Doctor Details (Left) */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {logoPosition === 'left' && renderLogo('mt-0.5')}
                {renderDoctorInfo('left')}
              </div>

              {/* Clinic Info (Right) + Optional Right Logo */}
              <div className="flex items-start gap-3 shrink-0 max-w-sm justify-end">
                {renderClinicInfo('right')}
                {logoPosition === 'right' && renderLogo('mt-0.5')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Patient Demographic Bar with Theme Color (English Clinical Standard) */}
      <div className={`relative z-10 mt-2 flex flex-wrap items-center justify-between border-b ${theme.patientBarClass} px-2.5 py-1.5 text-[11px] font-semibold gap-x-3 gap-y-1 rounded-md`}>
        <span><strong>Name:</strong> {patient.full_name}</span>
        <span><strong>Age/Sex:</strong> {formatPatientAge(patient.age, patient.age_months, patient.age_days, patient.age_unit)} / {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : patient.gender}</span>
        {encounter.vitals?.weight && <span><strong>Weight:</strong> {encounter.vitals.weight} kg</span>}
        {patient.address && <span><strong>Address:</strong> {patient.address}</span>}
        <span><strong>Date:</strong> {format(new Date(encounter.visit_date + 'T00:00:00'), 'dd/MM/yyyy')}</span>
        <span><strong>ID / Reg:</strong> {patient.patient_code}</span>
      </div>
    </>
  );
}
