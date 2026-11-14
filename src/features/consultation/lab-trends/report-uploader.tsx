'use client';

/**
 * ReportUploader — File upload banner with AI OCR / Multimodal trigger.
 */
import { Loader2, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportUploaderProps {
  fileData: { name: string; base64: string; mimeType: string } | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRunAi: () => void;
  analyzing: boolean;
}

export function ReportUploader({
  fileData,
  onFileUpload,
  onRunAi,
  analyzing,
}: ReportUploaderProps) {
  return (
    <div className="rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/40 p-3.5 flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-teal-950 flex items-center gap-1.5 text-xs">
          <Upload className="h-4 w-4 text-teal-700" /> ইসিজি, এমআরআই বা ল্যাব রিপোর্টের ছবি/পিডিএফ
        </span>
        <Button
          type="button"
          size="sm"
          onClick={onRunAi}
          disabled={analyzing}
          className="h-7 text-xs bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-2xs"
        >
          {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
          AI স্বয়ংক্রিয় ডায়াগনোসিস ও রিডিং
        </Button>
      </div>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={onFileUpload}
        className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-teal-100 file:text-teal-800 file:font-semibold cursor-pointer"
      />
      {fileData && (
        <span className="text-[11px] text-teal-800 font-semibold flex items-center gap-1">
          ✓ ফাইল প্রস্তুত: {fileData.name}
        </span>
      )}
    </div>
  );
}
