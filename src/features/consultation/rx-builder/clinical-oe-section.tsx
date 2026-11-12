'use client';

/**
 * ClinicalOeSection — 40+ Categorized Physical Examination (O/E) Presets & Vitals.
 * Includes 0ms Autocomplete Search, 1-Click "All Normal", opposing finding
 * auto-replacement, and real-time vitals analysis.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Sparkles, Stethoscope } from 'lucide-react';
import { db } from '@/db/localDb';
import { analyzeVitals } from '@/services/vitalsService';
import type { Encounter, Vitals as VitalsT } from '@/types/schema';
import { ALL_NORMAL_OE_TEXT, OE_CATEGORIES } from './clinical-presets';
import { ClinicalAutocompleteInput } from './clinical-autocomplete-input';
import { searchOeSuggestions, type ClinicalSuggestionItem } from '@/services/clinicalAutocompleteService';

const VITAL_FIELDS: Array<{ key: keyof VitalsT; label: string; unit: string; placeholder: string }> = [
  { key: 'bp', label: 'BP', unit: 'mmHg', placeholder: '120/80' },
  { key: 'pulse', label: 'Pulse', unit: 'bpm', placeholder: '78' },
  { key: 'temp', label: 'Temp', unit: '°F', placeholder: '98.6' },
  { key: 'weight', label: 'Wt', unit: 'kg', placeholder: '70' },
  { key: 'spo2', label: 'SpO₂', unit: '%', placeholder: '98' },
];

export const TOP_OE_CHIPS = [
  'Chest: Clear', 'Throat: Congested', 'Abdomen: Soft', 'Heart: S1 S2 Normal',
  'Anemia: Nil', 'Jaundice: Absent', 'Oedema: Nil', 'Dehydration: None',
  'CNS: Conscious & Oriented', 'Epigastric Tenderness (+)', 'Wheezing Present (+)',
];

const OPPOSING_PAIRS: Array<[RegExp, RegExp]> = [
  [/anemia:\s*nil/i, /anemia|pallor/i], [/jaundice:\s*absent/i, /jaundice/i],
  [/oedema:\s*nil|edema:\s*nil/i, /oedema|edema|swelling/i], [/cyanosis:\s*absent/i, /cyanosis/i],
  [/dehydration:\s*none/i, /dehydration/i], [/chest:\s*clear|lungs:\s*clear/i, /rhonchi|crepitation|creps|wheez/i],
  [/abdomen:\s*soft/i, /tenderness|distended|guarding|rigidity/i], [/throat:\s*normal/i, /throat:\s*congested|tonsil/i],
  [/heart:\s*s1\s*\+?\s*s2/i, /murmur/i],
];

export function ClinicalOeSection({ encounter }: { encounter: Encounter }) {
  const [showAllOe, setShowAllOe] = useState(false);
  const [selectedOeTab, setSelectedOeTab] = useState(0);
  const [oeSearchInput, setOeSearchInput] = useState('');

  const [localVitals, setLocalVitals] = useState<VitalsT>({
    bp: encounter.vitals?.bp || '', pulse: encounter.vitals?.pulse || '',
    temp: encounter.vitals?.temp || '', weight: encounter.vitals?.weight || '',
    spo2: encounter.vitals?.spo2 || '',
  });
  const [localOe, setLocalOe] = useState<string>(encounter.clinical_findings || '');

  const vitalsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const oeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalVitals({
      bp: encounter.vitals?.bp || '', pulse: encounter.vitals?.pulse || '',
      temp: encounter.vitals?.temp || '', weight: encounter.vitals?.weight || '',
      spo2: encounter.vitals?.spo2 || '',
    });
  }, [encounter.id, encounter.vitals]);

  useEffect(() => {
    setLocalOe(encounter.clinical_findings || '');
  }, [encounter.id, encounter.clinical_findings]);

  const saveVitalsDebounced = (nextVitals: VitalsT) => {
    if (vitalsTimer.current) clearTimeout(vitalsTimer.current);
    vitalsTimer.current = setTimeout(() => {
      void db.encounters.update(encounter.id, {
        vitals: nextVitals, updated_at: new Date().toISOString(), sync_status: 'pending',
      });
    }, 350);
  };

  const saveOeDebounced = (val: string) => {
    if (oeTimer.current) clearTimeout(oeTimer.current);
    oeTimer.current = setTimeout(() => {
      void db.encounters.update(encounter.id, {
        clinical_findings: val, updated_at: new Date().toISOString(), sync_status: 'pending',
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

  const getOeItems = (raw: string): string[] => raw.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);

  const isOeActive = (preset: string): boolean => {
    const p = preset.toLowerCase().trim();
    return getOeItems(localOe).some((item) => {
      const it = item.toLowerCase();
      return it === p || it.includes(p) || p.includes(it);
    });
  };

  const toggleOePreset = (preset: string) => {
    const pTrim = preset.trim();
    const pLower = pTrim.toLowerCase();
    const currentItems = getOeItems(localOe);

    const existingIdx = currentItems.findIndex((it) => {
      const itL = it.toLowerCase();
      return itL === pLower || itL.includes(pLower) || pLower.includes(itL);
    });

    if (existingIdx >= 0) {
      const updated = currentItems.filter((_, idx) => idx !== existingIdx);
      const nextStr = updated.join(', ');
      setLocalOe(nextStr);
      saveOeDebounced(nextStr);
      return;
    }

    let filtered = [...currentItems];
    for (const [patternA, patternB] of OPPOSING_PAIRS) {
      if (patternA.test(pTrim)) filtered = filtered.filter((it) => !patternB.test(it));
      else if (patternB.test(pTrim)) filtered = filtered.filter((it) => !patternA.test(it));
    }

    filtered.push(pTrim);
    const nextStr = filtered.join(', ');
    setLocalOe(nextStr);
    saveOeDebounced(nextStr);
  };

  const applyAllNormal = () => {
    const curItems = getOeItems(localOe);
    const normalItems = getOeItems(ALL_NORMAL_OE_TEXT);
    const merged = [...curItems];
    for (const norm of normalItems) {
      if (!merged.some((it) => it.toLowerCase() === norm.toLowerCase())) merged.push(norm);
    }
    const next = merged.join(', ');
    setLocalOe(next);
    saveOeDebounced(next);
  };

  const vitalAnalysis = useMemo(() => analyzeVitals(localVitals), [localVitals]);
  const cell = 'h-8 w-full rounded-lg border border-slate-300 px-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30';

  return (
    <div className="space-y-2 pt-1 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-xs">
          <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
          O/E ও ভাইটালস (Physical Examination)
        </span>
        <div className="flex items-center gap-1">
          {localOe.trim() && (
            <button
              type="button"
              onClick={() => { setLocalOe(''); saveOeDebounced(''); }}
              className="text-[10px] font-semibold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-0.5 transition-colors"
            >
              <RotateCcw className="h-2.5 w-2.5" /> মুছুন
            </button>
          )}
          <button
            type="button"
            onClick={applyAllNormal}
            className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Sparkles className="h-3 w-3 text-emerald-600" /> ★ All Normal (সব স্বাভাবিক)
          </button>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {VITAL_FIELDS.map((f) => (
          <label key={f.key} className="grid gap-0.5 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center justify-between">
              <span>{f.label}</span>
              <span className="font-normal text-slate-400 text-[9px]">{f.unit}</span>
            </span>
            <input
              type="text"
              value={localVitals[f.key]}
              onChange={(e) => setVital(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={cell}
            />
          </label>
        ))}
      </div>

      {vitalAnalysis.alerts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {vitalAnalysis.alerts.map((a, i) => (
            <span key={i} className="rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold px-1.5 py-0.5">
              {a.badge}
            </span>
          ))}
        </div>
      )}

      {/* 0ms Autocomplete Search Input for O/E Findings */}
      <div className="flex min-h-[36px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20">
        <ClinicalAutocompleteInput
          value={oeSearchInput}
          onChange={setOeSearchInput}
          onSelect={(item) => {
            toggleOePreset(item.text);
            setOeSearchInput('');
          }}
          onSubmitFreeText={(text) => {
            toggleOePreset(text);
            setOeSearchInput('');
          }}
          searchFn={searchOeSuggestions}
          placeholder="O/E খুঁজুন বা লিখুন (যেমন: chest, abdomen, tenderness, jaundice, anemia)..."
        />
      </div>

      {/* Top Regular O/E Chips */}
      <div className="flex flex-wrap items-center gap-1 pt-0.5">
        {TOP_OE_CHIPS.map((p) => {
          const active = isOeActive(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => toggleOePreset(p)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                active ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-2xs' : 'bg-slate-100 hover:bg-teal-50 hover:border-teal-300 border-slate-200 text-slate-700'
              }`}
            >
              {active ? '✓ ' : '+ '}
              {p}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowAllOe(!showAllOe)}
          className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-0.5"
        >
          {showAllOe ? <ChevronUp className="h-3 w-3" /> : <>+ ৪০+ O/E <ChevronDown className="h-3 w-3" /></>}
        </button>
      </div>

      {showAllOe && (
        <div className="rounded-xl border border-teal-200 bg-slate-50/70 p-2.5 space-y-2 text-xs animate-in fade-in duration-150">
          <div className="flex gap-1 border-b border-slate-200 pb-1.5">
            {OE_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOeTab(idx)}
                className={`rounded px-2 py-0.5 text-[10px] font-bold transition-all ${
                  selectedOeTab === idx ? 'bg-teal-700 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.title.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {OE_CATEGORIES[selectedOeTab].items.map((p) => {
              const active = isOeActive(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleOePreset(p)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                    active ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-2xs' : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controlled O/E Textarea */}
      <textarea
        className="min-h-[58px] w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30 font-medium placeholder:text-slate-400"
        placeholder="O/E notes: Chest clear, Throat congested, Abdomen soft..."
        value={localOe}
        onChange={(e) => {
          setLocalOe(e.target.value);
          saveOeDebounced(e.target.value);
        }}
      />
    </div>
  );
}
