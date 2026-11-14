'use client';

/**
 * PrescriptionAuditCard — CDSS Prescription Safety & Contradiction Auditor.
 * Displays real-time drug-drug interactions, contraindications, and dose warnings,
 * or a verified safety shield if prescriptions are clean.
 */
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { PrescriptionContradiction } from '@/services/aiClinicalCopilot';

interface PrescriptionAuditCardProps {
  status?: 'clean' | 'warnings_found';
  summary?: string;
  contradictions?: PrescriptionContradiction[];
}

export function PrescriptionAuditCard({
  status,
  summary,
  contradictions = [],
}: PrescriptionAuditCardProps) {
  const hasWarnings = status === 'warnings_found' || contradictions.length > 0;

  if (!hasWarnings && status !== 'clean') {
    return null;
  }

  if (!hasWarnings && status === 'clean') {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-3.5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>প্রেসক্রিপশন অডিট নিরাপদ (Verified Safe)</span>
        </div>
        <p className="mt-1 text-xs text-emerald-800 leading-relaxed font-medium">
          {summary || 'রোগীর বয়স, ওজন, ড্রাগ হিস্ট্রি, ক্রনিক রোগ ও রিপোর্টের সাথে বর্তমান ওষুধগুলোর কোনো কন্ট্রাডিকশন বা ক্ষতিকর ড্রাগ মিথস্ক্রিয়া পাওয়া যায়নি।'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/90 p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 animate-bounce" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-950">
            প্রেসক্রিপশন কন্ট্রাডিকশন ও এরর অডিট ({contradictions.length}টি সতর্কতা)
          </span>
        </div>
        <span className="rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
          Action Required
        </span>
      </div>

      {summary && (
        <p className="text-xs font-semibold text-rose-900 bg-white/70 p-2 rounded-xl border border-rose-200">
          {summary}
        </p>
      )}

      <div className="space-y-2">
        {contradictions.map((c, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-rose-200 bg-white p-3 space-y-1.5 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                {c.medicine}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                  c.severity === 'critical'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {c.severity === 'critical' ? 'মারাত্মক কন্ট্রাডিকশন' : 'সতর্কতা'}
              </span>
            </div>

            <div className="text-xs font-semibold text-rose-800">
              সমস্যা: {c.issue}
            </div>

            <div className="text-xs text-slate-700 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
              <strong className="text-rose-900 font-bold">ঝুঁকি: </strong>
              {c.clinical_danger}
            </div>

            <div className="text-xs text-emerald-900 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
              <strong className="text-emerald-950 font-bold">এআই সুপারিশ: </strong>
              {c.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
