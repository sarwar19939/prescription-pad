'use client';

/**
 * PrescriplyPadHeader — Digital Prescription Pad Letterhead & Patient Bar.
 * Supports custom clinic logo, visiting hours, theme accents,
 * degree title paragraph wrapping, customizable font sizes, and layout alignments.
 */
import { format } from 'date-fns';
import { Clock, Phone, ShieldCheck, User } from 'lucide-react';
import type { Encounter, Patient, Tenant } from '@/types/schema';
import { formatPatientAge } from '@/lib/prescriptionFormatters';
import {
  formatDegreesList,
  getClinicNameSizeClasses,
  getLogoSizeClasses,
  getNameSizeClasses,
  getPadTheme,
} from '@/lib/prescriptionTheme';

interface PrescriplyPadHeaderProps {
  tenant?: Tenant | null;
  patient: Patient;
  encounter: Encounter;
}

export function PrescriplyPadHeader({
  tenant,
  patient,
  encounter,
}: PrescriplyPadHeaderProps) {
  const preprinted = tenant?.hide_header_for_print === true;
  const clinicName = tenant?.clinic_name || 'বসিরবানিয়া চেম্বার';
  const doctorName = tenant?.doctor_name || 'ডাঃ গোলাম সারোয়ার';
  const degrees = tenant?.degrees || 'MBBS, FCPS';
  const specialty = tenant?.specialty || 'জেনারেল ফিজিশিয়ান (General Physician)';
  const regNumber = tenant?.reg_number || 'A-BMDC-Verified';
  const phone = tenant?.phone || '01700-000000';
  const address = tenant?.address || 'বসিরবানিয়া, পার্বতীপুর, দিনাজপুর';
  const visitingHours = tenant?.visiting_hours;
  const logoUrl = tenant?.logo_url;
  const theme = getPadTheme(tenant?.pad_layout_style);
  const headerAlign = tenant?.header_alignment || 'split';

  const visitDateFormatted = encounter?.visit_date
    ? format(new Date(encounter.visit_date + 'T00:00:00'), 'dd/MM/yyyy')
    : format(new Date(), 'dd/MM/yyyy');

  const degreeLines = formatDegreesList(degrees);
  const logoSizeClass = getLogoSizeClasses(tenant?.logo_size);
  const doctorNameSizeClass = getNameSizeClasses(tenant?.doctor_name_size);
  const clinicNameSizeClass = getClinicNameSizeClasses(tenant?.clinic_name_size);
  const logoGrayscaleClass = tenant?.logo_grayscale ? 'grayscale' : '';
  const logoPosition = tenant?.logo_position || 'left';

  const renderLogo = (extraClasses = '') => {
    if (!logoUrl) return null;
    return (
      <img
        src={logoUrl}
        alt="Clinic Logo"
        className={`${logoSizeClass} object-contain rounded shrink-0 ${logoGrayscaleClass} ${extraClasses}`}
      />
    );
  };

  const renderDoctorInfo = () => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className={`font-black tracking-tight ${theme.titleColorClass} ${doctorNameSizeClass}`}>
          {doctorName}
        </h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
          <ShieldCheck className="h-3 w-3 text-emerald-600" /> BM&amp;DC
        </span>
      </div>

      {/* Degrees Paragraph Wrapping */}
      <div className="mt-1 space-y-0.5 max-w-xl">
        {degreeLines.map((line, idx) => (
          <p
            key={idx}
            className={`text-xs sm:text-[13px] font-semibold ${theme.accentColorClass} leading-snug whitespace-pre-wrap break-words`}
          >
            {line}
          </p>
        ))}
      </div>

      <p className="text-xs sm:text-sm font-medium text-slate-800 mt-1">
        {specialty}
      </p>
      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
        BM&amp;DC Reg. No: <span className="font-bold text-slate-700">{regNumber}</span>
      </p>
    </div>
  );

  const renderClinicInfo = () => (
    <div className="sm:text-right shrink-0 max-w-sm">
      <h2 className={`font-bold tracking-tight ${theme.titleColorClass} ${clinicNameSizeClass}`}>
        {clinicName}
      </h2>
      <p className="text-xs text-slate-600 mt-0.5 leading-snug">{address}</p>
      {visitingHours && (
        <p className="text-[11px] text-slate-600 flex items-center sm:justify-end gap-1 mt-1 font-medium">
          <Clock className="h-3 w-3 text-teal-600" /> Visiting Hours: {visitingHours}
        </p>
      )}
      {phone && (
        <p className="text-xs font-semibold text-slate-700 mt-0.5">
          Phone: {phone}
        </p>
      )}
    </div>
  );

  return (
    <div className={`border-b-2 ${theme.borderClass} pb-3`}>
      {/* 1. Doctor & Chamber Letterhead */}
      {!preprinted && (
        <div className="pb-3 border-b border-slate-200/90">
          {headerAlign === 'centered' ? (
            /* Centered Header Layout */
            <div className="flex flex-col items-center text-center gap-2">
              {renderLogo('mb-1')}
              <h2 className={`font-bold tracking-tight ${theme.titleColorClass} ${clinicNameSizeClass}`}>
                {clinicName}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <h1 className={`font-black tracking-tight ${theme.titleColorClass} ${doctorNameSizeClass}`}>
                  {doctorName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> BM&amp;DC
                </span>
              </div>
              <div className="space-y-0.5 max-w-xl">
                {degreeLines.map((line, idx) => (
                  <p key={idx} className={`text-xs sm:text-[13px] font-semibold ${theme.accentColorClass} leading-relaxed whitespace-pre-wrap break-words`}>
                    {line}
                  </p>
                ))}
              </div>
              <p className="text-xs font-medium text-slate-700">{specialty}</p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600 mt-0.5">
                {regNumber && <span className="font-mono">BM&amp;DC Reg: <strong className="text-slate-800">{regNumber}</strong></span>}
                {address && <span>{address}</span>}
                {phone && <span className="font-semibold text-slate-700">Phone: {phone}</span>}
                {visitingHours && <span className="text-teal-700 font-medium">Visiting Hours: {visitingHours}</span>}
              </div>
            </div>
          ) : logoPosition === 'center' && logoUrl ? (
            /* 3-Column Balanced Header (Doctor Left | Logo Dead-Center | Clinic Right) */
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
              {/* Doctor Details (Left) */}
              <div className="flex items-start min-w-0">
                {renderDoctorInfo()}
              </div>

              {/* Logo in Exact Center (Marked by User) */}
              <div className="flex flex-col items-center justify-center px-4 self-center">
                {renderLogo()}
              </div>

              {/* Clinic Info (Right) */}
              <div className="sm:text-right min-w-0 justify-self-end">
                {renderClinicInfo()}
              </div>
            </div>
          ) : (
            /* Split / Left Header Layout (Classic & Modern Chamber Standard) */
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Doctor Details (Left) */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {logoPosition === 'left' && renderLogo('mt-0.5')}
                {renderDoctorInfo()}
              </div>

              {/* Clinic Info (Right) + Optional Right Logo */}
              <div className="flex items-start gap-3.5 shrink-0 max-w-sm sm:justify-end">
                {renderClinicInfo()}
                {logoPosition === 'right' && renderLogo('mt-0.5')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Patient Demographic Strip (English Clinical Standard) */}
      <div className={`mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 font-medium ${theme.patientBarClass}`}>
        <div className="flex items-center gap-1.5 truncate">
          <User className="h-3.5 w-3.5 text-teal-700 shrink-0" />
          <span className="font-semibold text-slate-600">Name:</span>
          <span className="font-bold text-slate-950 truncate">{patient.full_name}</span>
        </div>

        <div>
          <span className="font-semibold text-slate-600">Age/Sex:</span>{' '}
          <span className="font-bold text-slate-900">
            {formatPatientAge(patient.age, patient.age_months, patient.age_days, patient.age_unit)} / {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : patient.gender}
          </span>
        </div>

        <div>
          <span className="font-semibold text-slate-600">Weight:</span>{' '}
          <span className="font-bold text-slate-900 font-mono">
            {encounter?.vitals?.weight ? `${encounter.vitals.weight} kg` : '—'}
          </span>
        </div>

        <div className="truncate">
          <span className="font-semibold text-slate-600">Address:</span>{' '}
          <span className="font-bold text-slate-900 truncate" title={patient.address || '—'}>
            {patient.address || '—'}
          </span>
        </div>

        <div>
          <span className="font-semibold text-slate-600">Date:</span>{' '}
          <span className="font-bold text-slate-900 font-mono">{visitDateFormatted}</span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div>
            <span className="font-semibold text-slate-600">ID / Reg:</span>{' '}
            <span className="font-bold text-slate-900 font-mono">{patient.patient_code}</span>
          </div>
          {encounter?.vitals?.bp && (
            <span className="font-mono text-[11px] font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-300">
              {encounter.vitals.bp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
