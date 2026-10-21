'use client';

/**
 * AI Clinical Co-Pilot Sidebar Drawer:
 * Provides AI-assisted differential diagnoses, safety/interaction alerts,
 * recommended lab work, and 1-click addition of suggested medications to the active Rx pad.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  AlertTriangle,
  Bot,
  Check,
  ChevronRight,
  Info,
  Loader2,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { ensureTodayEncounter } from '../copy-rx';
import {
  suggestClinicalTrack,
  type AIProvider,
  type ClinicalTrackResult,
  type SuggestedMedication,
} from '@/services/aiClinicalCopilot';
import type { Encounter, Patient } from '@/types/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const complaints = activeEncounter?.chief_complaints || [];
      const vitals = (activeEncounter?.vitals || {}) as Record<string, string>;
      const track = await suggestClinicalTrack(patient, pastEncounters, labReports, complaints, vitals, { provider });
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
        id: crypto.randomUUID(),
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

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-sm text-neutral-900">AI Clinical Co-Pilot</h3>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
            Decision Support
          </span>
        </div>
        <button type="button" onClick={onClose} className="rounded p-1 text-neutral-400 hover:bg-neutral-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <p className="leading-tight">
          <strong>Medical Disclaimer:</strong> AI suggestions are for clinical reference only. Physician review required.
        </p>
      </div>

      {(!tenant || tenant.subscription_plan === 'free') && (
        <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/50 px-4 py-1.5 text-[11px] text-emerald-900">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Free Starter Plan · AI Decision Support Preview</span>
          </span>
          <Link href="/settings/billing" className="font-semibold text-emerald-700 hover:underline">Upgrade</Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex rounded-md border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setProvider('cloud')}
              className={`rounded px-2 py-1 font-medium ${provider === 'cloud' ? 'bg-white text-emerald-800 shadow-xs' : 'text-neutral-600'}`}
            >
              Cloud (Gemini)
            </button>
            <button
              type="button"
              onClick={() => setProvider('local')}
              className={`rounded px-2 py-1 font-medium ${provider === 'local' ? 'bg-white text-emerald-800 shadow-xs' : 'text-neutral-600'}`}
            >
              Local (Ollama)
            </button>
          </div>
          <Button size="sm" onClick={handleRunAnalysis} disabled={loading} className="bg-emerald-700 hover:bg-emerald-800 text-xs">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Sparkles className="h-3.5 w-3.5 mr-1.5" />}
            Analyze History &amp; Suggest Track
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <strong>Error running co-pilot:</strong>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!results && !loading && !error && (
          <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-500 space-y-2">
            <Stethoscope className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="font-medium text-neutral-700">Ready to synthesize clinical records.</p>
            <p className="text-[11px] text-neutral-400">
              Click &quot;Analyze History &amp; Suggest Track&quot; to review patient history, vitals, chronic illnesses, and latest lab reports without transmitting any PII.
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {results.safety_warnings?.length > 0 && (
              <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-3">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-900 mb-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Safety &amp; Contraindication Alerts</span>
                </div>
                <ul className="space-y-1 text-xs text-amber-800">
                  {results.safety_warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">
                Differential Diagnoses
              </span>
              <div className="flex flex-wrap gap-1.5">
                {results.differential_diagnoses?.map((diag, i) => (
                  <Badge key={i} variant="outline" className="border-neutral-300 bg-neutral-50 text-neutral-800 py-1">
                    {diag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">
                Suggested Evidence-Based Tracks
              </span>
              <div className="space-y-2">
                {results.suggested_medications?.map((med, i) => {
                  const added = addedMeds.has(med.generic_name);
                  return (
                    <div key={i} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs hover:border-emerald-300">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-xs text-neutral-900">
                            {med.suggested_brand ? `${med.suggested_brand} (${med.generic_name})` : med.generic_name}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {med.strength} · {med.schedule} · {med.duration}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={added ? 'secondary' : 'default'}
                          onClick={() => handleAddToRx(med)}
                          disabled={added}
                          className={`h-7 text-xs ${added ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-700 hover:bg-emerald-800'}`}
                        >
                          {added ? <><Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Added</> : <><PlusCircle className="h-3.5 w-3.5 mr-1" /> Add to Rx</>}
                        </Button>
                      </div>
                      {med.rationale && (
                        <p className="mt-2 text-[11px] text-neutral-600 bg-neutral-50 p-1.5 rounded">
                          <strong>Rationale: </strong>{med.rationale}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {results.recommended_investigations?.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">
                  Recommended Investigations
                </span>
                <ul className="space-y-1 text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  {results.recommended_investigations.map((inv, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
