'use client';

/**
 * ClinicalPhotoDialog — AI Vision Skin Lesion & Clinical Image Diagnostic Modal.
 * Supports image upload, differential swap (clicking any differential swaps it
 * into the primary position), and standard medical English documentation.
 */
import { useState } from 'react';
import { Camera, FileImage, Loader2, Sparkles, Upload, X } from 'lucide-react';

import { db } from '@/db/localDb';
import { stripAiGeneratedFindings } from '@/lib/prescriptionFormatters';
import { analyzeClinicalPhoto, type ClinicalVisionResult } from '@/services/aiVisionService';
import type { Encounter, Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ClinicalPhotoResults } from './clinical-photo-results';

interface ClinicalPhotoDialogProps {
  encounter: Encounter;
  patient: Patient;
}

export function ClinicalPhotoDialog({ encounter, patient }: ClinicalPhotoDialogProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ClinicalVisionResult | null>(null);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setResult(null);
      setApplied(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setAnalyzing(true);
    try {
      const res = await analyzeClinicalPhoto(imagePreview, clinicalNotes, {
        age: patient.age,
        gender: patient.gender,
        fileName: imageFileName,
      });
      setResult(res);
      setPrimaryDiagnosis(res.primary_diagnosis);
      setDifferentialDiagnoses(res.differential_diagnoses.filter((d) => d !== res.primary_diagnosis));
    } catch (err) {
      alert(`AI Image Analysis Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSwapDiagnosis = (clickedDiff: string) => {
    const oldPrimary = primaryDiagnosis;
    setPrimaryDiagnosis(clickedDiff);
    setDifferentialDiagnoses((prev) => [
      oldPrimary,
      ...prev.filter((d) => d !== clickedDiff),
    ]);
  };

  const handleApplyToRx = async () => {
    if (!result || !primaryDiagnosis) return;
    const ts = new Date().toISOString();

    const currentDiags = encounter.diagnosis || [];
    // Strictly add ONLY the primary diagnosis chosen by the doctor
    const updatedDiags = currentDiags.includes(primaryDiagnosis)
      ? currentDiags
      : [...currentDiags, primaryDiagnosis];

    // Save morphological findings into AI background notes (not manual doctor O/E)
    const findingsNote = result.observed_features?.length
      ? `AI Findings (${primaryDiagnosis}): ${result.observed_features.join(', ')}`
      : '';
    const cleanFindings = stripAiGeneratedFindings(encounter.clinical_findings);
    const existingAiNotes = encounter.ai_suggested_notes || '';
    const updatedAiNotes = [existingAiNotes, findingsNote].filter(Boolean).join('\n');

    const existingAdvice = encounter.advice || [];
    const newAdvice = result.suggested_treatment?.advice || [];
    const mergedAdvice = Array.from(new Set([...existingAdvice, ...newAdvice]));

    await db.encounters.update(encounter.id, {
      diagnosis: updatedDiags,
      clinical_findings: cleanFindings,
      ai_suggested_notes: updatedAiNotes,
      advice: mergedAdvice,
      updated_at: ts,
      sync_status: 'pending',
    });

    setApplied(true);
    setTimeout(() => {
      setOpen(false);
      setApplied(false);
      setImagePreview(null);
      setResult(null);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 px-2.5 py-1 text-xs font-semibold text-indigo-900 shadow-2xs transition-all"
        >
          <Camera className="h-3.5 w-3.5 text-indigo-600" />
          <span>📸 স্কিন ও ছবি বিশ্লেষণ (AI Vision)</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-slate-900">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            স্কিন ও ক্লিনিক্যাল ছবি বিশ্লেষণ (AI Vision Diagnostic)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            ত্বকের ক্ষত বা র‍্যাশের ছবি আপলোড করুন; ক্লিক করে ডিফারেনশিয়াল রোগ অদলবদল (Swap) করতে পারবেন।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-8 cursor-pointer hover:bg-indigo-50/70 transition-all text-center">
              <Upload className="h-8 w-8 text-indigo-600" />
              <span className="text-sm font-bold text-slate-800">ছবি সিলেক্ট করুন বা ক্যামেরা দিয়ে তুলুন</span>
              <span className="text-xs text-slate-500">JPG, PNG, WebP (Max 10MB)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-950 flex items-center justify-center max-h-60">
                <img src={imagePreview} alt="Clinical lesion preview" className="object-contain max-h-60" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setResult(null); }}
                  className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <input
                type="text"
                placeholder="অতিরিক্ত উপসর্গ (যেমন: pruritus, erythematous plaque with silvery scale)..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/30"
              />

              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI Vision ছবি বিশ্লেষণ করছে…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    ছবি বিশ্লেষণ ও রোগ নির্ণয় করুন
                  </>
                )}
              </Button>
            </div>
          )}

          {result && (
            <ClinicalPhotoResults
              result={result}
              primaryDiagnosis={primaryDiagnosis}
              differentialDiagnoses={differentialDiagnoses}
              onSwapDiagnosis={handleSwapDiagnosis}
              onApplyToRx={handleApplyToRx}
              applied={applied}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
