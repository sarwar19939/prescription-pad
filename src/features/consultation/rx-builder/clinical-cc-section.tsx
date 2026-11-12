'use client';

/**
 * ClinicalCcSection — 35+ Categorized Chief Complaints (C/C) Presets,
 * Interactive Duration/Frequency/Severity Modifier (Bissoy Rx style),
 * and Ambient Voice Scribe.
 */
import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  HeartPulse,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { db } from '@/db/localDb';
import type { Encounter, Patient } from '@/types/schema';
import { VoiceScribeDialog } from './voice-scribe-dialog';
import { ALL_CHIEF_COMPLAINTS_BY_CATEGORY, TOP_CHIEF_COMPLAINTS } from './clinical-presets';
import { SymptomModifierPanel } from './symptom-modifier-panel';
import { ClinicalAutocompleteInput } from './clinical-autocomplete-input';
import { searchComplaintSuggestions, type ClinicalSuggestionItem } from '@/services/clinicalAutocompleteService';

export function ClinicalCcSection({
  encounter,
  patient,
}: {
  encounter: Encounter;
  patient: Patient;
}) {
  const [showAllCc, setShowAllCc] = useState(false);
  const [selectedCcCat, setSelectedCcCat] = useState(0);
  const [customInput, setCustomInput] = useState('');

  // Active symptom currently being modified (e.g. "Fever", "Vomiting")
  const [activeModifier, setActiveModifier] = useState<{
    symptomName: string;
    existingText: string;
    index?: number;
  } | null>(null);

  const complaints = encounter.chief_complaints || [];

  const updateComplaints = (newComplaints: string[]) => {
    void db.encounters.update(encounter.id, {
      chief_complaints: newComplaints,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  // Find index of an existing complaint that matches this symptom base
  const findExistingIndex = (base: string) => {
    const b = base.toLowerCase().split(/[\s(/]+/)[0];
    return complaints.findIndex((c) => c.toLowerCase().includes(b));
  };

  const handleChipClick = (symptom: string) => {
    const existingIdx = findExistingIndex(symptom);
    if (existingIdx >= 0) {
      // Already exists - open modifier to adjust duration/frequency
      setActiveModifier({
        symptomName: symptom,
        existingText: complaints[existingIdx],
        index: existingIdx,
      });
    } else {
      // New symptom - immediately add base and open modifier for duration/frequency
      const updated = [...complaints, symptom];
      updateComplaints(updated);
      setActiveModifier({
        symptomName: symptom,
        existingText: symptom,
        index: updated.length - 1,
      });
    }
  };

  const handleApplyModifier = (formattedText: string) => {
    if (!activeModifier) return;
    const { index, symptomName } = activeModifier;

    if (typeof index === 'number' && index >= 0 && index < complaints.length) {
      const next = [...complaints];
      next[index] = formattedText;
      updateComplaints(next);
      setActiveModifier({ ...activeModifier, existingText: formattedText });
    } else {
      const existingIdx = findExistingIndex(symptomName);
      if (existingIdx >= 0) {
        const next = [...complaints];
        next[existingIdx] = formattedText;
        updateComplaints(next);
        setActiveModifier({ ...activeModifier, existingText: formattedText, index: existingIdx });
      } else {
        const next = [...complaints, formattedText];
        updateComplaints(next);
        setActiveModifier({ ...activeModifier, existingText: formattedText, index: next.length - 1 });
      }
    }
  };

  const handleRemoveActive = () => {
    if (!activeModifier) return;
    const { index, symptomName } = activeModifier;
    let next: string[];
    if (typeof index === 'number' && index >= 0 && index < complaints.length) {
      next = complaints.filter((_, i) => i !== index);
    } else {
      const b = symptomName.toLowerCase().split(/[\s(/]+/)[0];
      next = complaints.filter((c) => !c.toLowerCase().includes(b));
    }
    updateComplaints(next);
    setActiveModifier(null);
  };

  const handleRemoveItem = (index: number) => {
    const next = complaints.filter((_, i) => i !== index);
    updateComplaints(next);
    if (activeModifier?.index === index) setActiveModifier(null);
  };

  const handleAddCustom = (valOverride?: string) => {
    const val = (valOverride || customInput).trim();
    if (!val) return;
    if (!complaints.some((c) => c.toLowerCase() === val.toLowerCase())) {
      const next = [...complaints, val];
      updateComplaints(next);
      setActiveModifier({ symptomName: val, existingText: val, index: next.length - 1 });
    }
    setCustomInput('');
  };

  const handleSelectSuggestion = (item: ClinicalSuggestionItem) => {
    const val = item.text;
    const existingIdx = findExistingIndex(val);
    if (existingIdx >= 0) {
      setActiveModifier({ symptomName: val, existingText: complaints[existingIdx], index: existingIdx });
    } else {
      const next = [...complaints, val];
      updateComplaints(next);
      setActiveModifier({ symptomName: val, existingText: val, index: next.length - 1 });
    }
    setCustomInput('');
  };

  return (
    <div className="space-y-2">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-1">
        <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-xs">
          <HeartPulse className="h-3.5 w-3.5 text-teal-600" />
          C/C (উপসর্গ ও রোগের সময়কাল)
        </span>
        <VoiceScribeDialog encounter={encounter} patient={patient} />
      </div>

      {/* Top Regular Complaints Quick Chips */}
      <div className="flex flex-wrap items-center gap-1">
        {TOP_CHIEF_COMPLAINTS.map((c) => {
          const b = c.toLowerCase().split(/[\s(/]+/)[0];
          const isActive = complaints.some((item) => item.toLowerCase().includes(b));
          const isSelected = activeModifier?.symptomName.toLowerCase() === c.toLowerCase();

          return (
            <button
              key={c}
              type="button"
              onClick={() => handleChipClick(c)}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs ring-2 ring-amber-300'
                  : isActive
                  ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50'
              }`}
            >
              {isActive ? '✓ ' : '+ '}
              {c}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowAllCc(!showAllCc)}
          className="text-[10px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-0.5 transition-colors"
        >
          {showAllCc ? <ChevronUp className="h-3 w-3" /> : <>+ ৩৫+ উপসর্গ <ChevronDown className="h-3 w-3" /></>}
        </button>
      </div>

      {/* Expanded Categorized Complaints Drawer */}
      {showAllCc && (
        <div className="rounded-xl border border-teal-200 bg-slate-50/70 p-2.5 space-y-2 text-xs animate-in fade-in duration-150">
          <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-1.5">
            {ALL_CHIEF_COMPLAINTS_BY_CATEGORY.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCcCat(idx)}
                className={`rounded px-2 py-0.5 text-[10px] font-bold transition-all ${
                  selectedCcCat === idx
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.category.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {ALL_CHIEF_COMPLAINTS_BY_CATEGORY[selectedCcCat].items.map((item) => {
              const b = item.toLowerCase().split(/[\s(/]+/)[0];
              const isActive = complaints.some((c) => c.toLowerCase().includes(b));
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleChipClick(item)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white border-teal-700 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50'
                  }`}
                >
                  {isActive ? '✓ ' : '+ '}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Symptom Modifier (Bissoy Rx Style) — Opened upon clicking a complaint */}
      {activeModifier && (
        <SymptomModifierPanel
          symptomName={activeModifier.symptomName}
          existingText={activeModifier.existingText}
          onApply={handleApplyModifier}
          onRemove={handleRemoveActive}
          onClose={() => setActiveModifier(null)}
        />
      )}

      {/* Active Complaints Badges with 1-Click Duration Edit */}
      <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20">
        {complaints.map((item, idx) => {
          const isCurrent = activeModifier?.index === idx;
          return (
            <span
              key={`${item}-${idx}`}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-1 ring-amber-400'
                  : 'bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100'
              }`}
              onClick={() =>
                setActiveModifier({
                  symptomName: item.split(/[-:(]/)[0].trim(),
                  existingText: item,
                  index: idx,
                })
              }
              title="ক্লিক করে কতদিন বা কতবার তা পরিবর্তন করুন"
            >
              <Clock className="h-3 w-3 text-teal-600 opacity-70" />
              <span>{item}</span>
              <button
                type="button"
                aria-label="Remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(idx);
                }}
                className="ml-0.5 rounded hover:bg-teal-200/60 p-0.5 text-slate-500 hover:text-slate-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}

        <ClinicalAutocompleteInput
          value={customInput}
          onChange={setCustomInput}
          onSelect={handleSelectSuggestion}
          onSubmitFreeText={handleAddCustom}
          searchFn={searchComplaintSuggestions}
          placeholder={complaints.length === 0 ? 'উপসর্গ লিখুন বা খুঁজুন (যেমন: Amenorrhea, Fever)...' : '+ আরও উপসর্গ খুঁজুন/লিখুন…'}
        />
      </div>
    </div>
  );
}
