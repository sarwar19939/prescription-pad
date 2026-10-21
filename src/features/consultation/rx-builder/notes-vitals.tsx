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

  const vitalCell = 'w-full rounded border border-neutral-300 px-1.5 py-1 text-xs outline-none focus:border-emerald-600';

  return (
    <section className="flex flex-col gap-3">
      <div>
        <label className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          Chief Complaints (C/C)
          <span className="font-normal normal-case text-neutral-400">click quick-add or type + Enter</span>
        </label>
        <div className="mb-1.5 flex flex-wrap gap-1">
          {COMPLAINT_SUGGESTIONS.filter((s) => !encounter.chief_complaints.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => write({ chief_complaints: [...encounter.chief_complaints, s] })}
              className="rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-[11px] text-neutral-600 hover:border-emerald-600 hover:text-emerald-700"
            >
              + {s}
            </button>
          ))}
          {COMPLAINT_SUGGESTIONS.every((s) => encounter.chief_complaints.includes(s)) && (
            <span className="text-[11px] text-neutral-400">all suggestions added</span>
          )}
        </div>
        <TagInput
          value={encounter.chief_complaints}
          onChange={(tags) => write({ chief_complaints: tags })}
          placeholder="Free-text complaint + Enter…"
        />
      </div>

      <div>
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          Vitals
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {VITAL_FIELDS.map((f) => (
            <label key={f.key} className="grid gap-0.5 text-[10px] text-neutral-500">
              {f.label} <span className="font-normal text-neutral-400">{f.unit}</span>
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
            On Examination (O/E)
          </label>
          <textarea
            className="min-h-16 w-full rounded-md border border-neutral-300 p-2 text-xs outline-none focus:border-emerald-600"
            placeholder="Chest clear, no added sounds…"
            defaultValue={encounter.clinical_findings}
            onChange={(e) => write({ clinical_findings: e.target.value })}
          />
        </div>
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
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
