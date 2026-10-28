'use client';

/**
 * PrescriplyClinicalSidebar — Left Column of the Digital Prescription Pad (~33% width).
 * Clinical data entry: C/C (Chief Complaints), Vitals & O/E (On Examination),
 * History & Allergies, Diagnosis (Dx) with 168+ Protocol suggestions, and Investigations (Ix).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, FlaskConical, HeartPulse, Sparkles, Stethoscope, TriangleAlert } from 'lucide-react';

import { db } from '@/db/localDb';
import { TagInput } from '@/components/tag-input';
import { Badge } from '@/components/ui/badge';
import { analyzeVitals } from '@/services/vitalsService';
import { ProtocolTemplatesDialog } from './protocol-templates-dialog';
import { SuggestedProtocolBanner } from './suggested-protocol-banner';
import { ClinicalPhotoDialog } from './clinical-photo-dialog';
import { VoiceScribeDialog } from './voice-scribe-dialog';
import { AddReportDialog } from '../lab-trends/add-report-dialog';
import type { Encounter, InvestigationReport, Patient, Vitals as VitalsT } from '@/types/schema';

const COMPLAINT_SUGGESTIONS = [
  'Fever', 'Cough', 'Cold', 'Headache', 'Body ache', 'Vomiting',
  'Diarrhea', 'Abdominal pain', 'Chest pain', 'Weakness',
];

const COMMON_DIAGNOSIS_PRESETS = [
  'Dengue', 'Scabies', 'Diarrhea / GE', 'PUD / GERD',
  'Hypertension', 'Type 2 Diabetes', 'Asthma', 'COPD',
  'UTI', 'Typhoid', 'Common Cold', 'Back Pain',
];

const VITAL_FIELDS: Array<{ key: keyof VitalsT; label: string; unit: string; placeholder: string }> = [
  { key: 'bp', label: 'BP', unit: 'mmHg', placeholder: '120/80' },
  { key: 'pulse', label: 'Pulse', unit: 'bpm', placeholder: '78' },
  { key: 'temp', label: 'Temp', unit: '°F', placeholder: '98.6' },
  { key: 'weight', label: 'Wt', unit: 'kg', placeholder: '70' },
  { key: 'spo2', label: 'SpO₂', unit: '%', placeholder: '98' },
];

export function PrescriplyClinicalSidebar({
  encounter,
  patient,
  reports = [],
}: {
  encounter: Encounter;
  patient: Patient;
  reports?: InvestigationReport[];
}) {
  const [addReportOpen, setAddReportOpen] = useState(false);
  const [localVitals, setLocalVitals] = useState<VitalsT>({
    bp: encounter.vitals?.bp || '',
    pulse: encounter.vitals?.pulse || '',
    temp: encounter.vitals?.temp || '',
    weight: encounter.vitals?.weight || '',
    spo2: encounter.vitals?.spo2 || '',
  });

  const vitalsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalVitals({
      bp: encounter.vitals?.bp || '',
      pulse: encounter.vitals?.pulse || '',
      temp: encounter.vitals?.temp || '',
      weight: encounter.vitals?.weight || '',
      spo2: encounter.vitals?.spo2 || '',
    });
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

  const vitalAnalysis = useMemo(() => analyzeVitals(localVitals), [localVitals]);
  const cell = 'h-9 w-full rounded-lg border border-slate-300 px-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30';

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* 1. Chief Complaints (C/C) & Voice Scribe */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <HeartPulse className="h-3.5 w-3.5 text-teal-600" /> C/C (উপসর্গ)
          </span>
          <VoiceScribeDialog encounter={encounter} patient={patient} />
        </div>
        <div className="flex flex-wrap gap-1">
          {COMPLAINT_SUGGESTIONS.filter((s) => !(encounter.chief_complaints || []).includes(s)).slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => writeEncounterField({ chief_complaints: [...(encounter.chief_complaints || []), s] })}
              className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:border-teal-600 hover:bg-teal-50 transition-all"
            >
              + {s}
            </button>
          ))}
        </div>
        <TagInput
          value={encounter.chief_complaints || []}
          onChange={(tags) => writeEncounterField({ chief_complaints: tags })}
          placeholder="Type complaint + Enter…"
        />
      </div>

      {/* 2. On Examination (O/E) & Vitals */}
      <div className="space-y-1.5 pt-1 border-t border-slate-200">
        <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
          <Stethoscope className="h-3.5 w-3.5 text-teal-600" /> O/E &amp; Vitals
        </span>
        <div className="grid grid-cols-2 gap-2">
          {VITAL_FIELDS.map((f) => (
            <label key={f.key} className="grid gap-0.5 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center justify-between">
                <span>{f.label}</span>
                <span className="font-normal text-slate-400">{f.unit}</span>
              </span>
              <input
                className={cell}
                placeholder={f.placeholder}
                value={localVitals[f.key]}
                onChange={(e) => setVital(f.key, e.target.value)}
              />
            </label>
          ))}
        </div>

        {vitalAnalysis.alerts.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {vitalAnalysis.alerts.map((a, i) => (
              <span key={i} className="rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold px-1.5 py-0.5">
                {a.badge}
              </span>
            ))}
          </div>
        )}

        <textarea
          className="mt-1 min-h-[56px] w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
          placeholder="O/E notes: Chest clear, Abdomen soft…"
          defaultValue={encounter.clinical_findings}
          onChange={(e) => writeEncounterField({ clinical_findings: e.target.value })}
        />
      </div>

      {/* 3. Patient History & Allergies */}
      {(patient.allergies.length > 0 || patient.chronic_conditions.length > 0) && (
        <div className="space-y-1 pt-1 border-t border-slate-200">
          <span className="font-bold uppercase tracking-wider text-slate-800 block text-[11px]">
            History &amp; Allergies
          </span>
          <div className="flex flex-wrap gap-1">
            {patient.allergies.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 text-rose-700 px-1.5 py-0.5 text-[10px] font-bold">
                <TriangleAlert className="h-2.5 w-2.5" /> {a}
              </span>
            ))}
            {patient.chronic_conditions.map((c) => (
              <span key={c} className="rounded bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 text-[10px] font-semibold">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Diagnosis (Dx) & Clinical Photo Vision */}
      <div className="space-y-1.5 pt-1 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Diagnosis (Dx)
          </span>
          <div className="flex items-center gap-1">
            <ClinicalPhotoDialog encounter={encounter} patient={patient} />
            <ProtocolTemplatesDialog encounter={encounter} patient={patient} compact triggerLabel="১৬৮+ টেমপ্লেট" />
          </div>
        </div>
        <TagInput
          value={encounter.diagnosis || []}
          onChange={(tags) => writeEncounterField({ diagnosis: tags })}
          placeholder="Diagnosis + Enter (e.g. Dengue, Scabies)"
        />
        <div className="flex flex-wrap gap-1">
          {COMMON_DIAGNOSIS_PRESETS.map((diag) => {
            const current = encounter.diagnosis || [];
            const has = current.some((d) => d.toLowerCase() === diag.toLowerCase());
            return (
              <button
                key={diag}
                type="button"
                onClick={() => writeEncounterField({ diagnosis: has ? current.filter((d) => d.toLowerCase() !== diag.toLowerCase()) : [...current, diag] })}
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold border transition-all ${
                  has ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                }`}
              >
                {has ? '✓ ' : '+ '}{diag}
              </button>
            );
          })}
        </div>
        <SuggestedProtocolBanner encounter={encounter} patient={patient} />
      </div>

      {/* 5. Investigations (Ix / ল্যাব টেস্ট ও রিপোর্ট আপলোড) */}
      <div className="space-y-1.5 pt-1 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <FlaskConical className="h-3.5 w-3.5 text-teal-600" /> Investigations (Ix)
          </span>
          <button
            type="button"
            onClick={() => setAddReportOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-md px-2 py-0.5 transition-colors shadow-2xs"
          >
            + রিপোর্ট আপলোড (AI OCR)
          </button>
        </div>

        {reports.length > 0 ? (
          <div className="space-y-1">
            {reports.map((r) => (
              <div key={r.id} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px]">
                <span className="font-bold text-slate-800">• {r.test_name}</span>
                {r.abnormality_flags.length > 0 && (
                  <span className="text-rose-600 text-[10px] ml-1 font-semibold">({r.abnormality_flags.join(', ')})</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 italic">No investigations added yet. রিপোর্ট আপলোড বাটনে ক্লিক করুন।</p>
        )}

        <AddReportDialog
          patient={patient}
          encounterId={encounter.id}
          open={addReportOpen}
          onOpenChange={setAddReportOpen}
        />
      </div>
    </div>
  );
}
