'use client';

/**
 * Medicine autocomplete: instant (0ms) filtering of the local Dexie
 * MedicineCatalog (21,000+ MedEx items) — brand, generic, strength, manufacturer.
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Pill, Search } from 'lucide-react';

import { db } from '@/db/localDb';
import type { MedicineCatalog } from '@/types/schema';

export function useMedicineSearch(query: string) {
  return useLiveQuery(
    async () => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return db.medicine_catalog
        .filter(
          (m) =>
            m.brand_name.toLowerCase().includes(q) ||
            m.generic_name.toLowerCase().includes(q),
        )
        .limit(10)
        .toArray();
    },
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
      <div className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-2 py-1.5 focus-within:border-emerald-600">
        <Search className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
        <input
          className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          placeholder={placeholder ?? 'Search medicine (Napa, Seclo, Maxpro...) or type brand + Enter'}
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
          className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          {results!.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-emerald-50"
                onClick={() => {
                  onPick(m);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2 truncate">
                  <Pill className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden />
                  <span className="font-semibold text-neutral-900">{m.brand_name}</span>
                  <span className="text-xs text-neutral-500 font-mono">{m.strength}</span>
                  <span className="truncate text-xs text-neutral-400">
                    ({m.generic_name})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-neutral-400">
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-600">{m.dosage_form}</span>
                  <span className="truncate max-w-[120px]">{m.manufacturer}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
