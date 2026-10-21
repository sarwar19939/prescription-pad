'use client';

/**
 * Clinical notes & vitals fast entry for the active encounter. Writes go
 * straight to Dexie (debounced for text, immediate for tag changes), each
 * marking the record sync_status: 'pending'.
 */
import { useEffect, useRef } from 'react';

import { db } from '@/db/localDb';
import { TagInput } from '@/components/tag-input';
import type { Encounter, Vitals as VitalsT } from '@/types/schema';

const COMPLAINT_SUGGESTIONS = [
  'Fever', 'Cough', 'Cold', 'Headache', 'Body ache', 'Vomiting',
  'Diarrhea', 'Abdominal pain', 'Chest pain', 'Breathlessness', 'Dizziness', 'Weakness',
];

const VITAL_FIELDS: Array<{ key: keyof VitalsT; label: string; unit: string; placeholder: string }> = [
  { key: 'bp', label: 'BP', unit: 'mmHg', placeholder: '120/80' },
  { key: 'pulse', label: 'Pulse', unit: 'bpm', placeholder: '78' },
  { key: 'temp', label: 'Temp', unit: '°F', placeholder: '98.6' },
  { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '70' },
  { key: 'spo2', label: 'SpO₂', unit: '%', placeholder: '98' },
];

function useDebouncedWrite(encounter: Encounter, delay = 400) {
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const t of map.values()) clearTimeout(t);
    };
  }, []);
  return (patch: Partial<Encounter>): void => {
    for (const key of Object.keys(patch)) {
      const prev = timers.current.get(key);
      if (prev) clearTimeout(prev);
      timers.current.set(
        key,
        setTimeout(() => {
          void db.encounters.update(encounter.id, {
            ...patch,
            updated_at: new Date().toISOString(),
            sync_status: 'pending',
          });
        }, delay),
      );
    }
  };
}

export function NotesVitals({ encounter }: { encounter: Encounter }) {
  const write = useDebouncedWrite(encounter);
  const vital = encounter.vitals;

  const setVital = (key: keyof VitalsT, value: string) =>
    write({ vitals: { ...vital, [key]: value } });

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
          {COMPLAINT_SUGGESTIONS.filter((s) => !encounter.chief_complaints.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => write({ chief_complaints: [...encounter.chief_complaints, s] })}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:border-teal-600 hover:bg-teal-50/50 hover:text-teal-700 transition-all"
            >
              + {s}
            </button>
          ))}
          {COMPLAINT_SUGGESTIONS.every((s) => encounter.chief_complaints.includes(s)) && (
            <span className="text-xs text-slate-400">all suggestions added</span>
          )}
        </div>
        <TagInput
          value={encounter.chief_complaints}
          onChange={(tags) => write({ chief_complaints: tags })}
          placeholder="Free-text complaint + Enter…"
        />
      </div>

      <div>
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
          Vitals (Monitored Metrics)
        </span>
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
                value={vital[f.key]}
                onChange={(e) => setVital(f.key, e.target.value)}
              />
            </label>
          ))}
        </div>
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
            onChange={(e) => write({ clinical_findings: e.target.value })}
          />
        </div>
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
            Diagnosis
          </span>
          <TagInput
            value={encounter.diagnosis}
            onChange={(tags) => write({ diagnosis: tags })}
            placeholder="e.g. Acute Bronchitis + Enter"
          />
        </div>
      </div>
    </section>
  );
}
