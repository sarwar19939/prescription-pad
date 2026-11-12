'use client';

/**
 * ClinicalAutocompleteInput — Floating 0ms suggestion dropdown for
 * Symptoms, Patient History, and Physical Examination findings.
 * Supports keyboard navigation (Arrow Up/Down, Enter, Esc) and highlights
 * both DGHS presets and past saved drafts.
 */
import { useEffect, useRef, useState } from 'react';
import { Clock, Search, Sparkles } from 'lucide-react';
import type { ClinicalSuggestionItem } from '@/services/clinicalAutocompleteService';

interface ClinicalAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: ClinicalSuggestionItem) => void;
  onSubmitFreeText?: (text: string) => void;
  searchFn: (query: string) => Promise<ClinicalSuggestionItem[]>;
  placeholder?: string;
  className?: string;
}

export function ClinicalAutocompleteInput({
  value,
  onChange,
  onSelect,
  onSubmitFreeText,
  searchFn,
  placeholder = 'টাইপ করুন (যেমন: amenorrhea, fever, chest)...',
  className = '',
}: ClinicalAutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<ClinicalSuggestionItem[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const q = value.trim();
    if (q.length >= 1) {
      searchFn(q).then((results) => {
        if (active) {
          setSuggestions(results);
          setHighlightedIndex(results.length > 0 ? 0 : -1);
          setOpen(true);
        }
      });
    } else {
      setSuggestions([]);
      setOpen(false);
      setHighlightedIndex(-1);
    }
    return () => {
      active = false;
    };
  }, [value, searchFn]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed && onSubmitFreeText) {
          onSubmitFreeText(trimmed);
          setOpen(false);
        }
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        onSelect(suggestions[highlightedIndex]);
        setOpen(false);
      } else if (onSubmitFreeText && value.trim()) {
        onSubmitFreeText(value.trim());
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative flex-1 ${className}`}>
      <div className="flex items-center gap-1.5 w-full">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (value.trim().length >= 1 && suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-7 w-full border-0 bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Floating Suggestions Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 max-h-56 w-72 md:w-80 overflow-y-auto rounded-xl border border-teal-200 bg-white p-1 shadow-xl animate-in fade-in duration-100 divide-y divide-slate-100"
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestions.map((item, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left text-xs rounded-lg transition-colors ${
                    isHighlighted
                      ? 'bg-teal-700 text-white font-bold'
                      : 'hover:bg-teal-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {item.hasQualifier ? (
                      <Clock
                        className={`h-3 w-3 shrink-0 ${
                          isHighlighted ? 'text-amber-300' : 'text-teal-600'
                        }`}
                      />
                    ) : (
                      <Search
                        className={`h-3 w-3 shrink-0 ${
                          isHighlighted ? 'text-teal-200' : 'text-slate-400'
                        }`}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {item.category && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                          isHighlighted
                            ? 'bg-teal-800 text-teal-100'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.category}
                      </span>
                    )}
                    {item.source === 'draft' && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                          isHighlighted
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        ড্রাফট
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
