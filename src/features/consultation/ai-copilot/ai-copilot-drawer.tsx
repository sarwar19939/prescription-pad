'use client';

/**
 * AI Clinical Co-Pilot Sidebar Drawer:
 * Uses SlideOverDrawer spring motion wrapper with Indigo/Violet gradient branding.
 * Provides AI-assisted differential diagnoses, safety alerts, and 1-click Add to Rx.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Info,
  Loader2,
  ShieldAlert,
  Sparkles,
  Stethoscope,
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
import type { Encounter, Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { SlideOverDrawer } from '@/components/ui/motion';
import { AICopilotResults } from './ai-copilot-results';

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

  const pastEncounters = useLiveQuery(
    async () =>
      (await db.encounters.where('patient_id').equals(patient.id).toArray()).filter(
        (e) => e.id !== activeEncounter?.id,
      ),
    [patient.id, activeEncounter?.id],
    [],
  );

  const labReports = useLiveQuery(
    () => db.investigation_reports.where('patient_id').equals(patient.id).toArray(),
    [patient.id],
    [],
  );

  const tenant = useLiveQuery(() => db.tenants.get(patient.tenant_id), [patient.tenant_id]);

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

  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      title="AI Clinical Co-Pilot"
      subtitle="Evidence-based differential guidance & safety review"
      badge="Decision Support"
      widthClass="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        {/* Medical Disclaimer Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-700" />
          <p className="leading-snug">
            <strong className="font-semibold">Medical Disclaimer:</strong> AI suggestions are for clinical reference only. Physician review and approval required.
          </p>
        </div>

        {(!tenant || tenant.subscription_plan === 'free') && (
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-950">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="font-medium">Free Starter Plan · Decision Support Preview</span>
            </span>
            <Link href="/settings/billing" className="font-bold text-indigo-700 hover:underline">
              Upgrade
            </Link>
          </div>
        )}

        {/* Action Bar: Provider selector & Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setProvider('cloud')}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                provider === 'cloud' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cloud (Gemini)
            </button>
            <button
              type="button"
              onClick={() => setProvider('local')}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                provider === 'local' ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Local (Ollama)
            </button>
          </div>

          <Button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xs font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Analyze History &amp; Suggest Track
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div>
              <strong className="font-bold">Error running co-pilot:</strong>
              <p className="mt-1 leading-normal">{error}</p>
            </div>
          </div>
        )}

        {!results && !loading && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 space-y-2">
            <Stethoscope className="mx-auto h-10 w-10 text-slate-300" />
            <p className="text-base font-semibold text-slate-800">Ready to synthesize clinical records.</p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Click &quot;Analyze History &amp; Suggest Track&quot; to review patient history, vitals, chronic conditions, and lab reports without transmitting any PII.
            </p>
          </div>
        )}

        {results && (
          <AICopilotResults
            results={results}
            addedMeds={addedMeds}
            onAddToRx={handleAddToRx}
          />
        )}
      </div>
    </SlideOverDrawer>
  );
}
