'use client';

/**
 * AI Diagnostic Interpretation & Preview for Investigations
 * Displays ECG / MRI / X-ray / Lab findings, impression, and diagnosis.
 */
import { Activity, FileScan, FlaskConical } from 'lucide-react';

interface InvestigationAiPreviewProps {
  reportType: string;
  suggestedDiagnosis?: string;
  clinicalImpression?: string;
  keyFindings?: string[];
  recommendedActions?: string[];
  aiProvider?: string;
}

export function InvestigationAiPreview({
  reportType,
  suggestedDiagnosis,
  clinicalImpression,
  keyFindings = [],
  recommendedActions = [],
  aiProvider,
}: InvestigationAiPreviewProps) {
  if (!clinicalImpression && !suggestedDiagnosis && keyFindings.length === 0) {
    return null;
  }

  const renderIcon = () => {
    switch (reportType) {
      case 'ecg':
        return <Activity className="h-4 w-4 text-rose-600" />;
      case 'mri':
      case 'ct':
        return <FileScan className="h-4 w-4 text-indigo-600" />;
      default:
        return <FlaskConical className="h-4 w-4 text-teal-700" />;
    }
  };

  return (
    <div className="rounded-xl border-2 border-teal-500 bg-gradient-to-r from-teal-50/70 via-white to-emerald-50/70 p-3.5 space-y-2 shadow-2xs">
      <div className="flex items-center justify-between flex-wrap gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
          {renderIcon()}
          AI ইন্টারপ্রিটেশন ও ডায়াগনোসিস
        </span>
        <div className="flex items-center gap-1.5">
          {aiProvider === 'gemini' ? (
            <span className="rounded-full bg-emerald-700 text-white px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse" />
              🌐 লাইভ অনলাইন AI (Google Gemini)
            </span>
          ) : aiProvider === 'nvidia_nim' ? (
            <span className="rounded-full bg-emerald-700 text-white px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse" />
              🌐 লাইভ অনলাইন AI (NVIDIA NIM)
            </span>
          ) : (
            <span className="rounded-full bg-amber-600 text-white px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-xs">
              ⚠️ অফলাইন প্রটোকল (অনলাইনে যাচাই করা হয়নি)
            </span>
          )}
          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-900 uppercase">
            {reportType.toUpperCase()}
          </span>
        </div>
      </div>

      {aiProvider === 'offline_rules' && (
        <div className="rounded-lg bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-[11px] text-amber-900 flex items-center gap-1.5">
          <span>⚠️ এই ফলাফলটি অফলাইন লোকাল প্রটোকল থেকে প্রস্তুত করা হয়েছে (অনলাইনে যাচাই করা হয়নি)।</span>
        </div>
      )}

      {suggestedDiagnosis && (
        <div className="bg-white p-2.5 rounded-lg border border-teal-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            সম্ভাব্য ক্লিনিক্যাল ডায়াগনোসিস:
          </span>
          <div className="text-sm font-extrabold text-teal-950 mt-0.5">
            {suggestedDiagnosis}
          </div>
        </div>
      )}

      {clinicalImpression && (
        <div className="text-xs text-slate-800 leading-relaxed">
          <strong className="text-teal-900 font-semibold">ক্লিনিক্যাল ফলাফল (Impression): </strong>
          {clinicalImpression}
        </div>
      )}

      {keyFindings.length > 0 && (
        <div>
          <span className="text-[11px] font-bold text-slate-700 block mb-1">গুরুত্বপূর্ণ ফাইন্ডিংস:</span>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
            {keyFindings.map((kf, i) => (
              <li key={i}>{kf}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendedActions.length > 0 && (
        <div className="rounded bg-amber-50 p-2 border border-amber-200 text-[11px] text-amber-900">
          <strong className="font-bold">পরামর্শিত ব্যবস্থা: </strong>
          {recommendedActions.join(' · ')}
        </div>
      )}
    </div>
  );
}
