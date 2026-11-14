'use client';

/**
 * ClinicalDrugHistorySection — Drug History (চলমান ও পূর্বের ওষুধের ইতিহাস).
 * Placed directly below Chief Complaints (C/C).
 * Features:
 * - 0ms instant autocomplete from medicine catalog (brands and generics)
 * - Free text input support
 * - Clean minimal pills displaying medicine name & generic
 * - Hidden collapsible presets drawer for quick selection of common OPD maintenance drugs
 */
import { useEffect, useRef, useState } from 'react';
import { Pill, Plus, Search, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '@/db/localDb';
import { searchMedicinesRanked } from '@/services/medicineSearchService';
import type { Encounter, MedicineCatalog, Patient } from '@/types/schema';

const COMMON_DRUG_PRESETS = [
  'Tab. Metformin 500mg',
  'Tab. Amlodipine 5mg',
  'Tab. Losartan 50mg',
  'Tab. Omeprazole 20mg',
  'Tab. Atorvastatin 10mg',
  'Tab. Bisoprolol 2.5mg',
  'Inj. Insulin',
  'Inhaler Salbutamol',
  'Tab. Aspirin 75mg',
  'Tab. Pantoprazole 20mg',
];

export function ClinicalDrugHistorySection({
  encounter,
  patient,
}: {
  encounter: Encounter;
  patient: Patient;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<MedicineCatalog[]>([]);
  const [showPresets, setShowPresets] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Encounter drug history (or fallback to patient drug history)
  const drugHistory = encounter.drug_history || patient.drug_history || [];

  useEffect(() => {
    let cancelled = false;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const hits = await searchMedicinesRanked(trimmed, 10);
        if (!cancelled) setResults(hits);
      } catch {
        if (!cancelled) setResults([]);
      }
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const saveDrugHistory = async (newHistory: string[]) => {
    // Save to encounter
    await db.encounters.update(encounter.id, {
      drug_history: newHistory,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
    // Also save to patient record for future visits
    await db.patients.update(patient.id, {
      drug_history: newHistory,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  const addDrug = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (!drugHistory.some((d) => d.toLowerCase() === clean.toLowerCase())) {
      void saveDrugHistory([...drugHistory, clean]);
    }
    setQuery('');
    setOpen(false);
  };

  const removeDrug = (name: string) => {
    void saveDrugHistory(drugHistory.filter((d) => d !== name));
  };

  const handlePickMedicine = (med: MedicineCatalog) => {
    const name = `${med.dosage_form}. ${med.brand_name} ${med.strength} (${med.generic_name})`.trim();
    addDrug(name);
  };

  return (
    <div className="space-y-2 pt-2 border-t border-slate-200" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-xs">
          <Pill className="h-3.5 w-3.5 text-teal-600" />
          Drug History (চলমান / পূর্বের ওষুধ)
        </span>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-0.5 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80 transition-colors"
        >
          {showPresets ? <>সংক্ষেপ করুন <ChevronUp className="h-3 w-3" /></> : <>+ অপশন <ChevronDown className="h-3 w-3" /></>}
        </button>
      </div>

      {/* Autocomplete Input */}
      <div className="relative">
        <div className="flex min-h-[36px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-2.5 py-1 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            className="w-full text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="ওষুধ বা জেনেরিকের নাম লিখুন (যেমন: Seclo, Metformin, Amlodipine)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (results.length > 0) {
                  handlePickMedicine(results[0]);
                } else if (query.trim()) {
                  addDrug(query.trim());
                }
              } else if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setOpen(false);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Suggestion Dropdown */}
        {open && query.trim().length > 0 && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl divide-y divide-slate-100 text-xs animate-in fade-in duration-100"
          >
            {/* Free text custom add item */}
            <li className="p-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left rounded-lg bg-teal-50/70 hover:bg-teal-100/80 text-teal-900 font-bold"
                onClick={() => addDrug(query.trim())}
              >
                <Plus className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>যোগ করুন: </span>
                <span className="font-semibold underline">"{query.trim()}"</span>
              </button>
            </li>

            {results.map((med) => (
              <li key={med.id}>
                <button
                  type="button"
                  className="w-full px-2.5 py-1.5 text-left hover:bg-teal-50/60 rounded-md transition-colors"
                  onClick={() => handlePickMedicine(med)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {med.dosage_form}. {med.brand_name} {med.strength}
                    </span>
                    <span className="text-[10px] text-slate-400">{med.manufacturer}</span>
                  </div>
                  <div className="text-[11px] text-teal-800 font-medium italic">
                    {med.generic_name}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Drug History Chips (Just the clean name) */}
      <div className="flex flex-wrap gap-1 min-h-[22px]">
        {drugHistory.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 px-2 py-0.5 text-[11px] font-semibold shadow-2xs"
          >
            <Pill className="h-3 w-3 text-emerald-600 shrink-0" />
            <span>{item}</span>
            <button
              type="button"
              onClick={() => removeDrug(item)}
              className="ml-0.5 rounded hover:bg-emerald-200/60 p-0.5 text-emerald-800 transition-colors"
              title="মুছে ফেলুন"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {drugHistory.length === 0 && (
          <span className="text-[11px] text-slate-400 italic">কোনো ড্রাগ হিস্ট্রি যোগ করা হয়নি</span>
        )}
      </div>

      {/* Collapsible Presets Drawer (Hidden by default) */}
      {showPresets && (
        <div className="rounded-xl border border-teal-200 bg-slate-50/80 p-2.5 space-y-1.5 text-xs animate-in fade-in duration-150">
          <span className="text-[10px] font-bold uppercase text-slate-500">
            সাধারণ চলমান ওষুধ (ক্লিক করে যোগ করুন):
          </span>
          <div className="flex flex-wrap gap-1">
            {COMMON_DRUG_PRESETS.map((p) => {
              const active = drugHistory.some((dh) => dh.toLowerCase().includes(p.toLowerCase()));
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => (active ? removeDrug(p) : addDrug(p))}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border transition-all ${
                    active
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50'
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
    </div>
  );
}
