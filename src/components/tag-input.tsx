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

export function TagInput({ value, onChange, placeholder, danger }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const tag = draft.trim();
    if (!tag) return;
    if (!value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-2 py-1.5 focus-within:border-emerald-600"
      onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          variant={danger ? 'destructive' : 'secondary'}
          className="gap-1 text-xs"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            className="rounded-sm hover:text-black/60"
            onClick={(e) => {
              e.stopPropagation();
              onChange(value.filter((t) => t !== tag));
            }}
          >
            <X className="h-3 w-3" aria-hidden />
          </button>
        </Badge>
      ))}
      <input
        className="h-7 min-w-24 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-neutral-400"
        placeholder={value.length === 0 ? placeholder : 'Add more…'}
        aria-label={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
      />
    </div>
  );
}
