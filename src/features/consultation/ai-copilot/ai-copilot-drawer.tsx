'use client';

/**
 * AI Clinical Co-Pilot Sidebar Drawer:
 * Uses SlideOverDrawer spring motion wrapper with Indigo/Violet gradient branding.
 * Provides AI-assisted differential diagnoses, safety alerts, full prescription packages,
 * and 1-click Add to Rx.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Check,
  Info,
  Loader2,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Wand2,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import { ensureTodayEncounter } from '../copy-rx';
import {
  suggestClinicalTrack,
  type AIProvider,
  type ClinicalTrackResult,
  type SuggestedMedication,
} from '@/services/aiClinicalCopilot';
import {
  applyFullPrescriptionToEncounter,
  generateFullPrescription,
  type FullPrescriptionPackage,
} from '@/services/aiPrescriptionService';
import type { Encounter, Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { SlideOverDrawer } from '@/components/ui/motion';
import { AICopilotResults } from './ai-copilot-results';
import { AIFullPrescriptionCard } from './ai-full-prescription-card';

interface AICopilotDrawerProps {
  patient: Patient;
  open: boolean;
  onClose: () => void;
  activeEncounter?: Encounter | null;
}

export function AICopilotDrawer({
  patient,
  open,
  onClose,
  activeEncounter,
}: AICopilotDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('cloud');
  const [results, setResults] = useState<ClinicalTrackResult | null>(null);
  const [addedMeds, setAddedMeds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Full prescription package state
  const [fullPackage, setFullPackage] = useState<FullPrescriptionPackage | null>(null);
  const [packageLoading, setPackageLoading] = useState(false);

  const pastEncounters = useLiveQuery(
    async () => (await db.encounters.where('patient_id').equals(patient.id).toArray())
      .filter((e) => e.id !== activeEncounter?.id),
    [patient.id, activeEncounter?.id],
    [],
  );
  const labReports = useLiveQuery(
    () => db.investigation_reports.where('patient_id').equals(patient.id).toArray(),
    [patient.id],
    [],
  );
  const tenant = useLiveQuery(() => db.tenants.get(patient.tenant_id), [patient.tenant_id]);
  const confirmedDiagnoses = activeEncounter?.diagnosis || [];

  // Auto-generate full package if confirmed diagnoses exist and none loaded yet
  useEffect(() => {
    if (open && confirmedDiagnoses.length > 0 && !fullPackage && !packageLoading) {
      void handleGenerateFullPackage(confirmedDiagnoses[0]);
    }
  }, [open, confirmedDiagnoses.length]);

  const handleGenerateFullPackage = async (diag: string) => {
    setPackageLoading(true);
    try {
      const pkg = await generateFullPrescription(diag, patient, activeEncounter?.vitals);
      setFullPackage(pkg);
    } finally {
      setPackageLoading(false);
    }
  };

  const handleConfirmDiagnosis = async (diag: string) => {
    const encounter = activeEncounter || (await ensureTodayEncounter(patient));
    const current = encounter.diagnosis || [];
    if (!current.includes(diag)) {
      await db.encounters.update(encounter.id, {
        diagnosis: [...current, diag],
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      });
    }
    await handleGenerateFullPackage(diag);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const complaints = activeEncounter?.chief_complaints || [];
      const vitals = (activeEncounter?.vitals || {}) as Record<string, string>;
      const track = await suggestClinicalTrack(patient, pastEncounters, labReports, complaints, vitals, {
        provider,
      });
      setResults(track);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToRx = async (med: SuggestedMedication) => {
    try {
      const encounter = activeEncounter || (await ensureTodayEncounter(patient));
      const ts = new Date().toISOString();
      await db.prescription_items.add({
        id: generateUUID(),
        tenant_id: patient.tenant_id,
        patient_id: patient.id,
        encounter_id: encounter.id,
        brand_name: med.suggested_brand || med.generic_name,
        generic_name: med.generic_name,
        dosage_form: 'Tab',
        strength: med.strength || 'Standard',
        schedule: med.schedule || '1+0+1',
        meal_timing: 'After Meal',
        duration: med.duration || '7 Days',
        special_instructions: med.rationale || '',
        created_at: ts,
        updated_at: ts,
        sync_status: 'pending',
      });
      setAddedMeds((prev) => new Set(prev).add(med.generic_name));
    } catch (err) {
      alert(`Could not add medication: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleApplyFullPackage = async (pkg: FullPrescriptionPackage) => {
    const encounter = activeEncounter || (await ensureTodayEncounter(patient));
    return await applyFullPrescriptionToEncounter(encounter.id, pkg, patient);
  };

  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      title="AI Clinical Co-Pilot"
      subtitle="Evidence-based differential guidance & full prescription support"
      badge="Decision Support"
      widthClass="max-w-xl"
    >
      <div className="flex flex-col gap-4">
        {/* Medical Disclaimer Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <p className="leading-snug">
            <strong className="font-semibold">Medical Disclaimer:</strong> AI suggestions &amp; protocols are for clinical reference only. Physician review and approval required.
          </p>
        </div>

        {/* Confirmed Diagnoses Quick Picker if present in active encounter */}
        {confirmedDiagnoses.length > 0 && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-indigo-600" />
                কনফার্মকৃত ডায়াগনোসিস
              </span>
              <span className="text-[11px] text-indigo-700 font-medium">
                ক্লিক করে ফুল প্রেসক্রিপশন লোড করুন
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {confirmedDiagnoses.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => void handleGenerateFullPackage(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition-all flex items-center gap-1 ${
                    fullPackage?.diagnosis.toLowerCase().includes(d.toLowerCase())
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-indigo-900 border-indigo-200 hover:border-indigo-400'
                  }`}
                >
                  <Wand2 className="h-3 w-3" />
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Full Prescription Package Card if available */}
        {packageLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-2">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
            <p className="text-xs font-semibold text-slate-600">সম্পূর্ণ প্রেসক্রিপশন প্যাকেজ তৈরি হচ্ছে…</p>
          </div>
        )}

        {fullPackage && !packageLoading && (
          <AIFullPrescriptionCard
            pkg={fullPackage}
            patient={patient}
            onApply={handleApplyFullPackage}
          />
        )}

        {/* Action Bar: Provider selector & Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 pt-1">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setProvider('cloud')}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                provider === 'cloud' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cloud (Gemini)
            </button>
            <button
              type="button"
              onClick={() => setProvider('local')}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                provider === 'local' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Local (Ollama)
            </button>
          </div>

          <Button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="h-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xs font-semibold text-xs rounded-xl"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Sparkles className="h-3.5 w-3.5 mr-1.5" />}
            ডিফারেন্সিয়াল অ্যানালাইসিস
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div>
              <strong className="font-bold">Error running co-pilot:</strong>
              <p className="mt-1 leading-normal">{error}</p>
            </div>
          </div>
        )}

        {!results && !loading && !error && !fullPackage && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500 space-y-2">
            <Stethoscope className="mx-auto h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-800">Ready to synthesize clinical records.</p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Click &quot;ডিফারেন্সিয়াল অ্যানালাইসিস&quot; to evaluate patient history, vitals, chronic conditions, and lab trends without transmitting PII.
            </p>
          </div>
        )}

        {results && (
          <AICopilotResults
            results={results}
            addedMeds={addedMeds}
            patient={patient}
            onAddToRx={handleAddToRx}
            onConfirmDiagnosis={handleConfirmDiagnosis}
            fullPackage={fullPackage}
            onApplyFullPackage={handleApplyFullPackage}
          />
        )}
      </div>
    </SlideOverDrawer>
  );
}
