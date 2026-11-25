'use client';

import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react';

interface SmoothInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onCommit: (nextValue: string) => void;
  debounceMs?: number;
}

/**
 * Local-first input that keeps typing at 0ms without IndexedDB async cursor-jumping,
 * committing changes after a short debounce and immediately on blur/Enter.
 */
export function SmoothInput({
  value,
  onCommit,
  debounceMs = 250,
  onBlur,
  onKeyDown,
  ...props
}: SmoothInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const isFocusedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const flush = (val: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (val !== value) {
      onCommit(val);
    }
  };

  return (
    <input
      {...props}
      value={localValue}
      onFocus={(e) => {
        isFocusedRef.current = true;
        props.onFocus?.(e);
      }}
      onChange={(e) => {
        const next = e.target.value;
        setLocalValue(next);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onCommit(next);
        }, debounceMs);
      }}
      onBlur={(e) => {
        isFocusedRef.current = false;
        flush(localValue);
        onBlur?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          flush(localValue);
        }
        onKeyDown?.(e);
      }}
    />
  );
}
