'use client';

/**
 * Tag input: type and press Enter (or ','), chips render inline. Used for
 * chronic conditions (neutral) and allergies (danger/red highlight).
 */
import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  danger?: boolean;
}

export function TagInput({ value = [], onChange, placeholder, danger }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const safeValue = Array.isArray(value) ? value : [];

  const commit = () => {
    const tag = draft.trim();
    if (!tag) return;
    if (!safeValue.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      onChange([...safeValue, tag]);
    }
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && safeValue.length > 0) {
      onChange(safeValue.slice(0, -1));
    }
  };

  return (
    <div
      className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/30 transition-all"
      onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}
    >
      {safeValue.map((tag) => (
        <Badge
          key={tag}
          variant={danger ? 'destructive' : 'secondary'}
          className="gap-1.5 text-sm py-1 px-2.5 rounded-lg font-medium"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            className="rounded-sm hover:opacity-75 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onChange(safeValue.filter((t) => t !== tag));
            }}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </Badge>
      ))}
      <input
        className="h-8 min-w-28 flex-1 border-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
        placeholder={safeValue.length === 0 ? placeholder : 'Add more…'}
        aria-label={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
      />
    </div>
  );
}
