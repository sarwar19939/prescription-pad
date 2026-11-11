'use client';

/**
 * SymptomModifierPanel — Interactive Duration, Frequency & Severity Picker for C/C.
 * Implements 1-click clinical modifiers (Bissoy Rx style) for Fever, Vomiting,
 * Loose Motion, Abdominal Pain, Cough, and other chief complaints.
 */
import { useState, useEffect } from 'react';
import { Check, Clock, Plus, Tag, Trash2, X } from 'lucide-react';
import {
  SYMPTOM_QUALIFIER_MAP,
  UNIVERSAL_DURATIONS,
  getQualifierKey,
  type SymptomQualifierConfig,
} from './symptom-qualifiers';

interface SymptomModifierPanelProps {
  symptomName: string;
  existingText?: string;
  onApply: (formattedSymptom: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}

export function SymptomModifierPanel({
  symptomName,
  existingText = '',
  onApply,
  onRemove,
  onClose,
}: SymptomModifierPanelProps) {
  const qualifierKey = getQualifierKey(symptomName);
  const config: SymptomQualifierConfig | null = qualifierKey
    ? SYMPTOM_QUALIFIER_MAP[qualifierKey]
    : null;

  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Pre-fill states from existingText if available
  useEffect(() => {
    if (!existingText) return;
    const lower = existingText.toLowerCase();

    // Check duration matches
    const durations = config?.durations || UNIVERSAL_DURATIONS;
    for (const d of durations) {
      if (lower.includes(d.value.toLowerCase())) {
        setSelectedDuration(d.value);
        break;
      }
    }

    // Check frequency matches
    if (config?.frequencies) {
      for (const f of config.frequencies) {
        if (lower.includes(f.value.toLowerCase())) {
          setSelectedFrequency(f.value);
          break;
        }
      }
    }

    // Check character matches
    if (config?.characters) {
      for (const c of config.characters) {
        if (lower.includes(c.value.toLowerCase())) {
          setSelectedCharacter(c.value);
          break;
        }
      }
    }

    // Check location matches
    if (config?.locations) {
      for (const l of config.locations) {
        if (lower.includes(l.value.toLowerCase())) {
          setSelectedLocation(l.value);
          break;
        }
      }
    }
  }, [existingText, config]);

  // Compute live formatted result
  const buildResult = (
    dur = selectedDuration,
    freq = selectedFrequency,
    char = selectedCharacter,
    loc = selectedLocation
  ) => {
    if (config) {
      return config.formatString({
        duration: dur,
        frequency: freq,
        character: char,
        location: loc,
      });
    }

    // Fallback formatting for arbitrary symptom
    let res = symptomName;
    const mods = [char, loc].filter(Boolean).join(', ');
    if (mods) res += ` (${mods})`;
    if (freq) res += ` (${freq})`;
    if (dur) res += ` - ${dur}`;
    return res;
  };

  const handleDurationClick = (val: string) => {
    const next = selectedDuration === val ? '' : val;
    setSelectedDuration(next);
    onApply(buildResult(next, selectedFrequency, selectedCharacter, selectedLocation));
  };

  const handleFrequencyClick = (val: string) => {
    const next = selectedFrequency === val ? '' : val;
    setSelectedFrequency(next);
    onApply(buildResult(selectedDuration, next, selectedCharacter, selectedLocation));
  };

  const handleCharacterClick = (val: string) => {
    const next = selectedCharacter === val ? '' : val;
    setSelectedCharacter(next);
    onApply(buildResult(selectedDuration, selectedFrequency, next, selectedLocation));
  };

  const handleLocationClick = (val: string) => {
    const next = selectedLocation === val ? '' : val;
    setSelectedLocation(next);
    onApply(buildResult(selectedDuration, selectedFrequency, selectedCharacter, next));
  };

  const currentPreview = buildResult();

  return (
    <div className="rounded-xl border-2 border-teal-500 bg-white shadow-md p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-teal-100 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-teal-600" />
          <span className="font-bold text-xs text-teal-900">
            {config ? config.banglaTitle : symptomName} — সময়কাল ও বিবরণ
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          title="বন্ধ করুন"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 1. Frequency Row (e.g. Vomiting / Loose Motion) */}
      {config?.frequencies && config.frequencies.length > 0 && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            কতবার হয়েছে (Frequency):
          </span>
          <div className="flex flex-wrap gap-1">
            {config.frequencies.map((f) => {
              const active = selectedFrequency === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => handleFrequencyClick(f.value)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    active
                      ? 'bg-amber-600 text-white font-bold shadow-2xs'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Duration Row (How many days/hours) */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
          কতদিন ধরে (Duration):
        </span>
        <div className="flex flex-wrap gap-1">
          {(config?.durations || UNIVERSAL_DURATIONS).map((d) => {
            const active = selectedDuration === d.value;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => handleDurationClick(d.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  active
                    ? 'bg-teal-700 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Location Row (e.g. Abdominal Pain) */}
      {config?.locations && config.locations.length > 0 && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            ব্যথার স্থান (Location):
          </span>
          <div className="flex flex-wrap gap-1">
            {config.locations.map((l) => {
              const active = selectedLocation === l.value;
              return (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => handleLocationClick(l.value)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Character / Severity Row */}
      {config?.characters && config.characters.length > 0 && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
            ধরন / তীব্রতা (Character & Severity):
          </span>
          <div className="flex flex-wrap gap-1">
            {config.characters.map((c) => {
              const active = selectedCharacter === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleCharacterClick(c.value)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    active
                      ? 'bg-teal-800 text-white font-bold shadow-2xs'
                      : 'bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview & Action Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200 gap-2 flex-wrap">
        <div className="text-[11px] font-bold text-teal-900 bg-teal-50/80 px-2 py-1 rounded border border-teal-200 truncate max-w-full">
          প্রিভিউ: <span className="font-mono text-teal-700">{currentPreview}</span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 font-semibold transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              বাদ দিন
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onApply(currentPreview);
              onClose();
            }}
            className="text-[11px] bg-teal-700 hover:bg-teal-800 text-white px-2.5 py-1 rounded-md flex items-center gap-1 font-bold shadow-xs transition-colors"
          >
            <Check className="h-3 w-3" />
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
}
