'use client';

/**
 * Medicine autocomplete: instant (0ms) ranked search of the local Dexie
 * MedicineCatalog (21,000+ MedEx items) with word-by-word relevance scoring.
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Pill, Search } from 'lucide-react';

import { searchMedicinesRanked } from '@/services/medicineSearchService';
import type { MedicineCatalog } from '@/types/schema';

export function useMedicineSearch(query: string) {
  return useLiveQuery(
    () => searchMedicinesRanked(query, 18),
    [query],
    [],
  );
}

export interface MedicineSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Called when the doctor picks a catalog row (or presses Enter for free text). */
  onPick: (med: MedicineCatalog | { freeText: true }) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function MedicineSearch({ value, onChange, onPick, placeholder, autoFocus }: MedicineSearchProps) {
  const [open, setOpen] = useState(false);
  const results = useMedicineSearch(value);
  const showResults = open && value.trim().length > 0 && results !== undefined && results.length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 shadow-2xs focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/30 transition-all">
        <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
        <input
          className="w-full border-0 bg-transparent text-base md:text-sm font-medium outline-none placeholder:text-slate-400"
          placeholder={placeholder ?? 'Search by brand (Napa, Seclo, Maxpro...) or generic (Paracetamol)...'}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (results?.length) onPick(results[0]);
              else onPick({ freeText: true });
              setOpen(false);
            } else if (e.key === 'Escape') setOpen(false);
          }}
        />
      </div>
      {showResults && (
        <ul
          role="listbox"
          className="absolute z-40 mt-1.5 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl divide-y divide-slate-100"
          onMouseDown={(e) => e.preventDefault()}
        >
          {results!.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-left rounded-lg hover:bg-teal-50/70 transition-colors"
                onClick={() => {
                  onPick(m);
                  setOpen(false);
                }}
              >
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <Pill className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />
                  <span className="text-base font-bold text-slate-950">{m.brand_name}</span>
                  <span className="text-sm font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                    {m.strength}
                  </span>
                  <span className="truncate text-xs text-slate-500 font-medium">
                    ({m.generic_name})
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                      m.dosage_form === 'Cap'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : m.dosage_form === 'Tab'
                          ? 'bg-sky-50 border-sky-300 text-sky-900'
                          : m.dosage_form === 'Syr'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : m.dosage_form === 'Inj'
                              ? 'bg-rose-50 border-rose-300 text-rose-900'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {m.dosage_form}
                  </span>
                  <span className="truncate max-w-[140px] text-xs text-slate-400 font-medium hidden sm:inline">
                    {m.manufacturer}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
