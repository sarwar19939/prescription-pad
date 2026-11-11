'use client';

/**
 * ClinicalCcSection — 35+ Categorized Chief Complaints (C/C) Presets & Ambient Voice Scribe.
 * Instant 1-click addition of top complaints, organized sub-specialty drawers,
 * and conversational speech recognition directly updating encounter.chief_complaints.
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp, HeartPulse, Sparkles } from 'lucide-react';
import { db } from '@/db/localDb';
import { TagInput } from '@/components/tag-input';
import type { Encounter, Patient } from '@/types/schema';
import { VoiceScribeDialog } from './voice-scribe-dialog';
import { ALL_CHIEF_COMPLAINTS_BY_CATEGORY, TOP_CHIEF_COMPLAINTS } from './clinical-presets';

export function ClinicalCcSection({
  encounter,
  patient,
}: {
  encounter: Encounter;
  patient: Patient;
}) {
  const [showAllCc, setShowAllCc] = useState(false);
  const [selectedCcCat, setSelectedCcCat] = useState(0);

  const complaints = encounter.chief_complaints || [];

  const toggleComplaint = (item: string) => {
    const has = complaints.includes(item);
    const updated = has ? complaints.filter((c) => c !== item) : [...complaints, item];
    void db.encounters.update(encounter.id, {
      chief_complaints: updated,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between flex-wrap gap-1">
        <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-xs">
          <HeartPulse className="h-3.5 w-3.5 text-teal-600" />
          C/C (প্রধান উপসর্গসমূহ)
        </span>
        <VoiceScribeDialog encounter={encounter} patient={patient} />
      </div>

      {/* Top Regular Complaints Chips */}
      <div className="flex flex-wrap items-center gap-1">
        {TOP_CHIEF_COMPLAINTS.map((c) => {
          const active = complaints.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => toggleComplaint(c)}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border transition-all ${
                active
                  ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50'
              }`}
            >
              {active ? '✓ ' : '+ '}
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
              const active = complaints.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleComplaint(item)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                    active
                      ? 'bg-teal-700 text-white border-teal-700 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TagInput for Custom Complaints */}
      <TagInput
        value={complaints}
        onChange={(tags) =>
          void db.encounters.update(encounter.id, {
            chief_complaints: tags,
            updated_at: new Date().toISOString(),
            sync_status: 'pending',
          })
        }
        placeholder="Type custom complaint + Enter…"
      />
    </div>
  );
}
