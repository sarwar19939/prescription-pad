'use client';

/**
 * PrescriplySignatureBlock — Doctor's digital signature and seal block
 * rendered at the bottom of the digital prescription pad.
 * Displays custom footer special instructions/notes if configured by clinic.
 */
import { Info } from 'lucide-react';
import type { Tenant } from '@/types/schema';
import { getPadTheme } from '@/lib/prescriptionTheme';

export function PrescriplySignatureBlock({ tenant }: { tenant?: Tenant | null }) {
  const doctorName = tenant?.doctor_name || 'ডাঃ গোলাম সারোয়ার';
  const designation = tenant?.specialty || tenant?.degrees || 'জেনারেল ফিজিশিয়ান';
  const specialNotes = tenant?.special_notes;
  const theme = getPadTheme(tenant?.pad_layout_style);

  return (
    <div className="mt-8 pt-4 pb-10 flex flex-col gap-3">
      {specialNotes && (
        <div className="rounded-lg bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-[11px] text-slate-700 flex items-center gap-1.5 font-medium">
          <Info className="h-3.5 w-3.5 text-teal-600 shrink-0" />
          <span>{specialNotes}</span>
        </div>
      )}

      {/* Signature placed cleanly at bottom-right with doctor name & designation only (lifted 1-1.5 inches) */}
      <div className="flex justify-end pt-3 pb-6">
        <div className={`w-56 border-t-2 ${theme.borderClass} pt-2 text-center`}>
          <p className={`text-sm font-bold ${theme.titleColorClass}`}>{doctorName}</p>
          <p className="text-xs font-semibold text-slate-600">{designation}</p>
        </div>
      </div>
    </div>
  );
}
