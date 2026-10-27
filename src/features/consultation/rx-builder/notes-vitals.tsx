'use client';

/**
 * Clinical notes & vitals fast entry for the active encounter. Writes go
 * straight to Dexie (debounced for text, immediate for tag changes), each
 * marking the record sync_status: 'pending'.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { TagInput } from '@/components/tag-input';
import { Badge } from '@/components/ui/badge';
import { analyzeVitals } from '@/services/vitalsService';
import { ProtocolTemplatesDialog } from './protocol-templates-dialog';
import { SuggestedProtocolBanner } from './suggested-protocol-banner';
import type { Encounter, Patient, Vitals as VitalsT } from '@/types/schema';

const COMPLAINT_SUGGESTIONS = [
  'Fever', 'Cough', 'Cold', 'Headache', 'Body ache', 'Vomiting',
  'Diarrhea', 'Abdominal pain', 'Chest pain', 'Breathlessness', 'Dizziness', 'Weakness',
];

const COMMON_DIAGNOSIS_PRESETS = [
  'Dengue', 'Scabies', 'Diarrhea / GE', 'PUD / GERD',
  'Hypertension', 'Type 2 Diabetes', 'UTI', 'Tinea (Fungal)',
];

const VITAL_FIELDS: Array<{ key: keyof VitalsT; label: string; unit: string; placeholder: string }> = [
  { key: 'bp', label: 'BP', unit: 'mmHg', placeholder: '120/80' },
  { key: 'pulse', label: 'Pulse', unit: 'bpm', placeholder: '78' },
  { key: 'temp', label: 'Temp', unit: '°F', placeholder: '98.6' },
  { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '70' },
  { key: 'spo2', label: 'SpO₂', unit: '%', placeholder: '98' },
];

export function NotesVitals({ encounter, patient }: { encounter: Encounter; patient?: Patient }) {
  // Fluid 0ms local state prevents cursor freezing, character drops & stale race conditions
  const [localVitals, setLocalVitals] = useState<VitalsT>({
    bp: encounter.vitals?.bp || '',
    pulse: encounter.vitals?.pulse || '',
    temp: encounter.vitals?.temp || '',
    weight: encounter.vitals?.weight || '',
    spo2: encounter.vitals?.spo2 || '',
  });

  const vitalsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const encounterIdRef = useRef(encounter.id);

  // Sync state if switching between encounters
  useEffect(() => {
    if (encounterIdRef.current !== encounter.id) {
      encounterIdRef.current = encounter.id;
      setLocalVitals({
        bp: encounter.vitals?.bp || '',
        pulse: encounter.vitals?.pulse || '',
        temp: encounter.vitals?.temp || '',
        weight: encounter.vitals?.weight || '',
        spo2: encounter.vitals?.spo2 || '',
      });
    }
  }, [encounter.id, encounter.vitals]);

  const saveVitalsDebounced = (nextVitals: VitalsT) => {
    if (vitalsTimer.current) clearTimeout(vitalsTimer.current);
    vitalsTimer.current = setTimeout(() => {
      void db.encounters.update(encounter.id, {
        vitals: nextVitals,
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      });
    }, 350);
  };

  const setVital = (key: keyof VitalsT, val: string) => {
    setLocalVitals((prev) => {
      const next = { ...prev, [key]: val };
      saveVitalsDebounced(next);
      return next;
    });
  };

  const writeEncounterField = (patch: Partial<Encounter>) => {
    void db.encounters.update(encounter.id, {
      ...patch,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  // AI & Clinical Rule Evaluation of Live Vitals
  const vitalAnalysis = useMemo(() => analyzeVitals(localVitals), [localVitals]);

  const vitalCell =
    'h-11 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-base font-bold text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:font-sans placeholder:font-normal placeholder:text-slate-400';

  return (
    <section className="flex flex-col gap-5">
      <div>
        <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
          Chief Complaints (C/C)
          <span className="font-normal normal-case text-slate-400">click quick-add or type + Enter</span>
        </label>
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {COMPLAINT_SUGGESTIONS.filter((s) => !(encounter.chief_complaints || []).includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                writeEncounterField({
                  chief_complaints: [...(encounter.chief_complaints || []), s],
                })
              }
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:border-teal-600 hover:bg-teal-50/50 hover:text-teal-700 transition-all"
            >
              + {s}
            </button>
          ))}
          {COMPLAINT_SUGGESTIONS.every((s) => (encounter.chief_complaints || []).includes(s)) && (
            <span className="text-xs text-slate-400">all suggestions added</span>
          )}
        </div>
        <TagInput
          value={encounter.chief_complaints || []}
          onChange={(tags) => writeEncounterField({ chief_complaints: tags })}
          placeholder="Free-text complaint + Enter…"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Vitals &amp; Patient Metrics
          </span>
          {vitalAnalysis.alerts.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" /> AI Insights Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {VITAL_FIELDS.map((f) => (
            <label key={f.key} className="grid gap-1.5 text-xs font-semibold text-slate-600">
              <span className="flex items-center justify-between">
                <span>{f.label}</span>
                <span className="font-normal text-slate-400">{f.unit}</span>
              </span>
              <input
                className={vitalCell}
                placeholder={f.placeholder}
                value={localVitals[f.key]}
                onChange={(e) => setVital(f.key, e.target.value)}
              />
            </label>
          ))}
        </div>

        {/* AI Clinical Vitals Interpretation Banner */}
        {vitalAnalysis.alerts.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-teal-200/90 bg-teal-50/60 p-3 shadow-2xs">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-600 shrink-0" />
              AI Live Assessment:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {vitalAnalysis.alerts.map((a, i) => (
                <Badge
                  key={i}
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                    a.severity === 'rose'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                  title={a.detail}
                >
                  {a.badge}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium ml-auto hidden md:inline">
              Adjusts prescription doses in real-time
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
            On Examination (O/E)
          </label>
          <textarea
            className="min-h-[96px] w-full rounded-xl border border-slate-300 p-3.5 text-base text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 leading-relaxed transition-all placeholder:text-slate-400"
            placeholder="Chest clear, no added sounds, abdominal soft…"
            defaultValue={encounter.clinical_findings}
            onChange={(e) => writeEncounterField({ clinical_findings: e.target.value })}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Diagnosis
            </span>
            {patient && (
              <ProtocolTemplatesDialog
                encounter={encounter}
                patient={patient}
                compact
                triggerLabel="টেমপ্লেট লাইব্রেরি"
              />
            )}
          </div>
          <TagInput
            value={encounter.diagnosis || []}
            onChange={(tags) => writeEncounterField({ diagnosis: tags })}
            placeholder="e.g. Dengue, Scabies (Press Enter)"
          />
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick:</span>
            {COMMON_DIAGNOSIS_PRESETS.map((diag) => {
              const currentDiags = encounter.diagnosis || [];
              const matchDiag = (d: string, p: string) => {
                const cd = d.trim().toLowerCase();
                const cp = p.trim().toLowerCase();
                return cd === cp || (cp.includes('/') && cp.split('/').some((part) => part.trim() === cd));
              };
              const has = currentDiags.some((d) => matchDiag(d, diag));
              return (
                <button
                  key={diag}
                  type="button"
                  onClick={() => {
                    const next = has
                      ? currentDiags.filter((d) => !matchDiag(d, diag))
                      : [...currentDiags, diag];
                    writeEncounterField({ diagnosis: next });
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                    has
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700'
                  }`}
                >
                  {has ? '✓ ' : '+ '}{diag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {patient && (
        <div className="mt-1">
          <SuggestedProtocolBanner encounter={encounter} patient={patient} />
        </div>
      )}
    </section>
  );
}
