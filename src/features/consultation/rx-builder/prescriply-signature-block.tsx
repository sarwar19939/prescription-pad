'use client';

/**
 * PrescriplySignatureBlock — Doctor's digital signature and seal block
 * rendered at the bottom of the digital prescription pad.
 * Displays custom footer special instructions/notes if configured by clinic.
 */
import { ShieldCheck, Info } from 'lucide-react';
import type { Tenant } from '@/types/schema';

export function PrescriplySignatureBlock({ tenant }: { tenant?: Tenant | null }) {
  const doctorName = tenant?.doctor_name || 'ডাঃ গোলাম সারোয়ার';
  const designation = tenant?.specialty || tenant?.degrees || 'জেনারেল ফিজিশিয়ান';
  const specialNotes = tenant?.special_notes;

  return (
    <div className="mt-12 pt-6 flex flex-col gap-3">
      {specialNotes && (
        <div className="rounded-lg bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-[11px] text-slate-700 flex items-center gap-1.5 font-medium">
          <Info className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <span>{specialNotes}</span>
        </div>
      )}

      {/* Signature placed cleanly at bottom-right with doctor name & designation only */}
      <div className="flex justify-end pt-4">
        <div className="w-56 border-t-2 border-slate-800 pt-1.5 text-center">
          <p className="text-sm font-bold text-slate-950">{doctorName}</p>
          <p className="text-xs font-semibold text-slate-600">{designation}</p>
        </div>
      </div>
    </div>
  );
}
