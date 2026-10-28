'use client';

/**
 * ClinicalPhotoDialog — AI Vision Skin Lesion & Clinical Image Diagnostic Modal.
 * Doctors upload or photograph a skin rash/lesion/wound, and AI Vision provides
 * morphological findings, differential diagnoses, safety warnings, and 1-click Rx.
 */
import { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  FileImage,
  ImageIcon,
  Loader2,
  Pill,
  Sparkles,
  Upload,
  Wand2,
  X,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import {
  analyzeClinicalPhoto,
  type ClinicalVisionResult,
} from '@/services/aiVisionService';
import type { Encounter, Patient, PrescriptionItem } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ClinicalPhotoDialogProps {
  encounter: Encounter;
  patient: Patient;
}

export function ClinicalPhotoDialog({ encounter, patient }: ClinicalPhotoDialogProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ClinicalVisionResult | null>(null);
  const [applied, setApplied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      });
      setResult(res);
    } catch (err) {
      alert(`AI Image Analysis Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyToRx = async () => {
    if (!result) return;
    const ts = new Date().toISOString();

    // 1. Append primary diagnosis to encounter
    const currentDiags = encounter.diagnosis || [];
    const newDiag = result.primary_diagnosis || result.differential_diagnoses[0];
    if (newDiag && !currentDiags.includes(newDiag)) {
      await db.encounters.update(encounter.id, {
        diagnosis: [...currentDiags, newDiag],
        updated_at: ts,
        sync_status: 'pending',
      });
    }

    // 2. Append suggested medicines to Dexie
    if (result.suggested_treatment?.medicines?.length) {
      for (const m of result.suggested_treatment.medicines) {
        await db.prescription_items.add({
          id: generateUUID(),
          tenant_id: patient.tenant_id,
          encounter_id: encounter.id,
          patient_id: patient.id,
          brand_name: m.brand_name || 'Medicine',
          generic_name: m.generic_name || '',
          dosage_form: m.dosage_form || 'Tab',
          strength: m.strength || 'Standard',
          schedule: m.schedule || '1+0+1',
          meal_timing: m.meal_timing || 'After Meal',
          duration: m.duration || '7 Days',
          special_instructions: m.special_instructions || '',
          created_at: ts,
          updated_at: ts,
          sync_status: 'pending',
        } as PrescriptionItem);
      }
    }

    // 3. Append advice
    if (result.suggested_treatment?.advice?.length) {
      const existingAdvice = encounter.advice || [];
      const merged = Array.from(new Set([...existingAdvice, ...result.suggested_treatment.advice]));
      await db.encounters.update(encounter.id, {
        advice: merged,
        updated_at: ts,
        sync_status: 'pending',
      });
    }

    setApplied(true);
    setTimeout(() => {
      setOpen(false);
      setApplied(false);
      setImagePreview(null);
      setResult(null);
    }, 1800);
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
            ত্বকের ক্ষত, র‍্যাশ বা ক্লিনিক্যাল ছবি আপলোড করুন; AI Vision আকার, ধরন দেখে তাৎক্ষণিক সম্ভাব্য রোগ ও চিকিৎসা প্রস্তাব করবে।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Upload Dropzone */}
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
                placeholder="অতিরিক্ত উপসর্গ (যেমন: ৩ দিন ধরে তীব্র চুলকানি, গোল চাকার মতো লাল দাগ)..."
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

          {/* Analysis Results */}
          {result && (
            <div className="space-y-3 rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/60 to-white p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  AI Vision ফলাফল: {result.primary_diagnosis}
                </span>
                <span className="rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5">
                  AI ডার্মাটোলজি
                </span>
              </div>

              {/* Observed Features */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">দৃশ্যমান ক্লিনিক্যাল লক্ষণ:</span>
                <ul className="space-y-0.5 text-xs text-slate-600">
                  {result.observed_features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-indigo-600">•</span> <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Differential Diagnoses */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">সম্ভাব্য রোগসমূহ (Differential):</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.differential_diagnoses.map((d, i) => (
                    <span key={i} className="rounded-lg bg-white border border-indigo-200 px-2 py-0.5 text-xs font-semibold text-slate-800 shadow-2xs">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              {result.safety_warnings.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">সতর্কবার্তা:</strong>
                    <p className="mt-0.5">{result.safety_warnings.join(' ')}</p>
                  </div>
                </div>
              )}

              {/* Suggested Medicines */}
              {result.suggested_treatment?.medicines?.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">প্রস্তাবিত ঔষধমালা:</span>
                  <div className="space-y-1">
                    {result.suggested_treatment.medicines.map((m, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-slate-200 p-2 text-xs">
                        <span className="font-bold text-slate-900">
                          {m.dosage_form}. {m.brand_name} {m.strength}
                        </span>
                        <span className="text-teal-800 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                          {m.schedule} ({m.meal_timing})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1-Click Apply Button */}
              <Button
                type="button"
                onClick={handleApplyToRx}
                disabled={applied}
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                    প্রেসক্রিপশনে যুক্ত হয়েছে!
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    ১-ক্লিকে প্রেসক্রিপশন ও ডায়াগনোসিসে প্রয়োগ করুন
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
