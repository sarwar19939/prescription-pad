'use client';

/**
 * PrescriplySignatureBlock — Doctor's digital signature and seal block
 * rendered at the bottom of the digital prescription pad.
 */
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { Tenant } from '@/types/schema';

export function PrescriplySignatureBlock({ tenant }: { tenant?: Tenant | null }) {
  const doctorName = tenant?.doctor_name || 'Dr. Specialist Physician';
  const degrees = tenant?.degrees || 'MBBS, FCPS, MD';
  const clinicName = tenant?.clinic_name || 'Care Medical Chamber';
  const regNumber = tenant?.reg_number || 'A-BMDC-Verified';

  return (
    <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> BM&amp;DC Verified
        </span>
        <span>•</span>
        <span>ডিজিটাল প্রেসক্রিপশন সিস্টেম</span>
      </div>

      <div className="text-right">
        <div className="w-52 border-t-2 border-slate-800 pt-1 text-center sm:text-right">
          <p className="text-sm font-bold text-slate-900">{doctorName}</p>
          <p className="text-xs text-slate-600">{degrees}</p>
          <p className="text-[11px] text-teal-800 font-semibold">{clinicName}</p>
          <p className="text-[10px] font-mono text-slate-400">Reg: {regNumber}</p>
        </div>
      </div>
    </div>
  );
}
