'use client';

/**
 * ClinicalHistorySection — 35+ Categorized Clinical History Presets.
 * Manages Past Medical Illness, Drug History, Allergies, Personal Habits,
 * Family History, and Gynae/Obstetric records with instant 0ms Dexie updates.
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, History, ShieldAlert, X } from 'lucide-react';
import { db } from '@/db/localDb';
import type { Encounter, Patient } from '@/types/schema';
import { HISTORY_CATEGORIES } from './clinical-presets';
import { HistoryModifierPanel } from './history-modifier-panel';

export function ClinicalHistorySection({
  patient,
  encounter,
}: {
  patient: Patient;
  encounter: Encounter;
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // Active chronic condition being modified for duration/status
  const [activeChronicModifier, setActiveChronicModifier] = useState<{
    conditionName: string;
    existingText: string;
    index?: number;
  } | null>(null);

  const allergies = patient.allergies || [];
  const chronic = patient.chronic_conditions || [];
  const surgicalHistory = patient.medical_surgical_history || '';

  const toggleAllergy = async (allergyName: string) => {
    const has = allergies.includes(allergyName);
    const updated = has
      ? allergies.filter((a) => a !== allergyName)
      : [...allergies, allergyName];
    await db.patients.update(patient.id, {
      allergies: updated,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  const toggleChronic = async (conditionName: string) => {
    const base = conditionName.toLowerCase().split(/[\s(/]+/)[0];
    const existingIdx = chronic.findIndex((c) => c.toLowerCase().includes(base));

    if (existingIdx >= 0) {
      // Toggle or open modifier
      setActiveChronicModifier({
        conditionName,
        existingText: chronic[existingIdx],
        index: existingIdx,
      });
    } else {
      const updated = [...chronic, conditionName];
      await db.patients.update(patient.id, {
        chronic_conditions: updated,
        updated_at: new Date().toISOString(),
        sync_status: 'pending',
      });
      setActiveChronicModifier({
        conditionName,
        existingText: conditionName,
        index: updated.length - 1,
      });
    }
  };

  const handleApplyChronicModifier = async (formattedText: string) => {
    if (!activeChronicModifier) return;
    const { index, conditionName } = activeChronicModifier;
    let next: string[];

    if (typeof index === 'number' && index >= 0 && index < chronic.length) {
      next = [...chronic];
      next[index] = formattedText;
    } else {
      const base = conditionName.toLowerCase().split(/[\s(/]+/)[0];
      const existingIdx = chronic.findIndex((c) => c.toLowerCase().includes(base));
      if (existingIdx >= 0) {
        next = [...chronic];
        next[existingIdx] = formattedText;
      } else {
        next = [...chronic, formattedText];
      }
    }

    await db.patients.update(patient.id, {
      chronic_conditions: next,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
    setActiveChronicModifier({ ...activeChronicModifier, existingText: formattedText });
  };

  const handleRemoveChronic = async () => {
    if (!activeChronicModifier) return;
    const { index, conditionName } = activeChronicModifier;
    let next: string[];

    if (typeof index === 'number' && index >= 0 && index < chronic.length) {
      next = chronic.filter((_, i) => i !== index);
    } else {
      const base = conditionName.toLowerCase().split(/[\s(/]+/)[0];
      next = chronic.filter((c) => !c.toLowerCase().includes(base));
    }

    await db.patients.update(patient.id, {
      chronic_conditions: next,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
    setActiveChronicModifier(null);
  };

  const toggleGeneralHistory = async (historyNote: string) => {
    const cur = surgicalHistory.trim();
    let updated = '';
    if (cur.includes(historyNote)) {
      updated = cur
        .split(/[,;]\s*/)
        .filter((item) => item.toLowerCase() !== historyNote.toLowerCase())
        .join(', ');
    } else {
      updated = cur ? `${cur}, ${historyNote}` : historyNote;
    }
    await db.patients.update(patient.id, {
      medical_surgical_history: updated,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  const handleChipClick = (type: string, item: string) => {
    if (type === 'allergy') {
      void toggleAllergy(item);
    } else if (type === 'chronic') {
      void toggleChronic(item);
    } else {
      void toggleGeneralHistory(item);
    }
  };

  const isSelected = (type: string, item: string) => {
    if (type === 'allergy') return allergies.includes(item);
    if (type === 'chronic') {
      const base = item.toLowerCase().split(/[\s(/]+/)[0];
      return chronic.some((c) => c.toLowerCase().includes(base));
    }
    return surgicalHistory.toLowerCase().includes(item.toLowerCase());
  };

  const TOP_HISTORY_ITEMS = [
    { type: 'chronic', label: 'Diabetes (DM)' },
    { type: 'chronic', label: 'Hypertension (HTN)' },
    { type: 'chronic', label: 'Bronchial Asthma' },
    { type: 'chronic', label: 'IHD (Heart Disease)' },
    { type: 'chronic', label: 'CKD (Kidney Disease)' },
    { type: 'allergy', label: 'NKDA (অ্যালার্জি নেই)' },
    { type: 'allergy', label: 'Penicillin Allergy' },
    { type: 'social', label: 'Non-smoker' },
    { type: 'social', label: 'Smoker' },
    { type: 'social', label: 'Betel Nut / Zarda' },
    { type: 'drug', label: 'On Antihypertensive' },
    { type: 'drug', label: 'On OAD / Insulin' },
  ];

  return (
    <div className="space-y-2 pt-1 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-xs">
          <History className="h-3.5 w-3.5 text-teal-600" />
          রোগীর অতীত ইতিহাস (H/O &amp; History)
        </span>
        <button
          type="button"
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-0.5 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80 transition-colors"
        >
          {showAllCategories ? (
            <>
              সংক্ষেপ করুন <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              + ৩৫+ হিস্ট্রি আইটেম <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      {/* Active Selected Badges (Clicking opens modifier for duration/status) */}
      <div className="flex flex-wrap gap-1 min-h-[22px]">
        {allergies.map((a) => (
          <span
            key={a}
            onClick={() => void toggleAllergy(a)}
            className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-300 text-rose-700 px-2 py-0.5 text-[10px] font-bold hover:bg-rose-100 transition-colors shadow-2xs"
            title="ক্লিক করে রিমুভ করুন"
          >
            <ShieldAlert className="h-2.5 w-2.5 text-rose-600" /> ALLERGY: {a}
            <X className="h-2.5 w-2.5 ml-0.5 opacity-60" />
          </span>
        ))}
        {chronic.map((c, idx) => (
          <span
            key={`${c}-${idx}`}
            onClick={() =>
              setActiveChronicModifier({
                conditionName: c.split(/[-:(]/)[0].trim(),
                existingText: c,
                index: idx,
              })
            }
            className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-300 text-amber-800 px-2 py-0.5 text-[10px] font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
            title="ক্লিক করে সময়কাল ও স্ট্যাটাস নির্বাচন করুন"
          >
            <Clock className="h-2.5 w-2.5 text-amber-600" />
            <span>{c}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const next = chronic.filter((_, i) => i !== idx);
                void db.patients.update(patient.id, {
                  chronic_conditions: next,
                  updated_at: new Date().toISOString(),
                  sync_status: 'pending',
                });
                if (activeChronicModifier?.index === idx) setActiveChronicModifier(null);
              }}
              className="ml-0.5 rounded hover:bg-amber-200/60 p-0.5 text-amber-700"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {surgicalHistory &&
          surgicalHistory
            .split(/[,;]\s*/)
            .filter(Boolean)
            .map((note, idx) => (
              <span
                key={idx}
                onClick={() => void toggleGeneralHistory(note)}
                className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-teal-50 border border-teal-300 text-teal-800 px-2 py-0.5 text-[10px] font-semibold hover:bg-teal-100 transition-colors shadow-2xs"
                title="ক্লিক করে রিমুভ করুন"
              >
                • {note}
                <X className="h-2.5 w-2.5 ml-0.5 opacity-60" />
              </span>
            ))}
        {allergies.length === 0 && chronic.length === 0 && !surgicalHistory && (
          <span className="text-[11px] text-slate-400 italic">কোনো অতীত রোগ রেকর্ড নেই। নিচের অপশনগুলো থেকে নির্বাচন করুন:</span>
        )}
      </div>

      {/* Chronic Modifier Panel */}
      {activeChronicModifier && (
        <HistoryModifierPanel
          conditionName={activeChronicModifier.conditionName}
          existingText={activeChronicModifier.existingText}
          onApply={handleApplyChronicModifier}
          onRemove={handleRemoveChronic}
          onClose={() => setActiveChronicModifier(null)}
        />
      )}

      {/* Top Regular Quick Selectors */}
      <div className="flex flex-wrap gap-1 pt-0.5">
        {TOP_HISTORY_ITEMS.map((item) => {
          const active = isSelected(item.type, item.label);
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleChipClick(item.type, item.label)}
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                active
                  ? item.type === 'allergy'
                    ? 'bg-rose-600 text-white border-rose-600 font-bold'
                    : 'bg-teal-700 text-white border-teal-700 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
              }`}
            >
              {active ? '✓ ' : '+ '}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Expanded 35+ Categorized History Drawer */}
      {showAllCategories && (
        <div className="rounded-xl border border-teal-200 bg-slate-50/70 p-2.5 space-y-2.5 text-xs animate-in fade-in duration-150">
          <div className="flex flex-wrap gap-1 border-b border-slate-200/80 pb-1.5">
            {HISTORY_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTab(idx)}
                className={`rounded px-2 py-1 text-[10px] font-bold transition-all ${
                  selectedTab === idx
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {HISTORY_CATEGORIES[selectedTab].title}:
            </span>
            <div className="flex flex-wrap gap-1">
              {HISTORY_CATEGORIES[selectedTab].items.map((item) => {
                const type = HISTORY_CATEGORIES[selectedTab].type;
                const active = isSelected(type, item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleChipClick(type, item)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                      active
                        ? type === 'allergy'
                          ? 'bg-rose-600 text-white border-rose-600 font-bold'
                          : 'bg-teal-700 text-white border-teal-700 font-bold'
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
        </div>
      )}
    </div>
  );
}
