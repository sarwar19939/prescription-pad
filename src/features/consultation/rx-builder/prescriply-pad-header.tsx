'use client';

/**
 * PrescriplyPadHeader — Digital Prescription Pad Letterhead & Patient Bar.
 * Supports custom clinic logo, visiting hours, and theme accents
 * (Modern Teal, Classic Clinical, Executive Navy, Minimal Elegant).
 */
import { format } from 'date-fns';
import { Clock, Phone, ShieldCheck, User } from 'lucide-react';
import type { Encounter, Patient, Tenant } from '@/types/schema';

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
  const padStyle = tenant?.pad_layout_style || 'modern_teal';

  const visitDateFormatted = encounter?.visit_date
    ? format(new Date(encounter.visit_date + 'T00:00:00'), 'dd/MM/yyyy')
    : format(new Date(), 'dd/MM/yyyy');

  const themeBorder =
    padStyle === 'executive_navy'
      ? 'border-blue-900'
      : padStyle === 'classic_clinical'
      ? 'border-black'
      : padStyle === 'minimal_elegant'
      ? 'border-zinc-400'
      : 'border-teal-800';

  const themeAccent =
    padStyle === 'executive_navy'
      ? 'text-blue-900'
      : padStyle === 'classic_clinical'
      ? 'text-slate-900 font-serif'
      : padStyle === 'minimal_elegant'
      ? 'text-zinc-800'
      : 'text-teal-800';

  return (
    <div className={`border-b-2 ${themeBorder} pb-3`}>
      {/* 1. Doctor & Chamber Letterhead */}
      {!preprinted && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-start gap-3">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Clinic Logo"
                className="h-14 w-auto max-w-20 object-contain rounded shrink-0 mt-0.5"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {doctorName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> BM&amp;DC
                </span>
              </div>
              <p className={`text-xs sm:text-sm font-semibold ${themeAccent} mt-0.5`}>
                {degrees} — {specialty}
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                BM&amp;DC Reg. No: <span className="font-bold text-slate-700">{regNumber}</span>
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {clinicName}
            </h2>
            <p className="text-xs text-slate-600">{address}</p>
            {visitingHours && (
              <p className="text-[11px] text-slate-600 flex items-center sm:justify-end gap-1 mt-0.5 font-medium">
                <Clock className="h-3 w-3 text-teal-600" /> {visitingHours}
              </p>
            )}
            <p className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center sm:justify-end gap-1">
              <Phone className="h-3 w-3 text-teal-600" /> সিরিয়াল / হেল্পলাইন: {phone}
            </p>
          </div>
        </div>
      )}

      {/* 2. Patient Demographic Strip */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium">
        <div className="col-span-2 flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <span className="font-semibold text-slate-500">নাম:</span>
          <span className="font-bold text-slate-950 truncate">{patient.full_name}</span>
        </div>

        <div>
          <span className="font-semibold text-slate-500">বয়স/লিঙ্গ:</span>{' '}
          <span className="font-bold text-slate-900">
            {patient.age}Y / {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : patient.gender}
          </span>
        </div>

        <div>
          <span className="font-semibold text-slate-500">তারিখ:</span>{' '}
          <span className="font-bold text-slate-900 font-mono">{visitDateFormatted}</span>
        </div>

        <div>
          <span className="font-semibold text-slate-500">আইডি:</span>{' '}
          <span className="font-bold text-teal-800 font-mono">{patient.patient_code}</span>
        </div>

        <div className="flex items-center gap-2">
          {encounter?.vitals?.bp ? (
            <span>
              <span className="font-semibold text-slate-500">BP:</span>{' '}
              <span className="font-bold text-slate-900 font-mono">{encounter.vitals.bp}</span>
            </span>
          ) : (
            <span>
              <span className="font-semibold text-slate-500">Blood:</span>{' '}
              <span className="font-bold text-slate-900">{patient.blood_group || '—'}</span>
            </span>
          )}
          {encounter?.vitals?.weight && (
            <span>
              <span className="font-semibold text-slate-500">Wt:</span>{' '}
              <span className="font-bold text-slate-900 font-mono">{encounter.vitals.weight}kg</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
