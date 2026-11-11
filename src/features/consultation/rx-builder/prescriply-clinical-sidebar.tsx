'use client';

/**
 * PrescriplyClinicalSidebar — Left Column of the Digital Prescription Pad (~33% width).
 * Orchestrates:
 * 1. C/C: 35+ Categorized Complaints & Ambient Voice Scribe
 * 2. History: 35+ Categorized Past Illness, Drug, Allergy, Social & Family History
 * 3. O/E: 40+ Physical Examination Presets, Vitals & 1-Click All-Normal
 * 4. Dx: 1-Click Common Diagnoses, 168+ Protocol Templates & Clinical Photo Vision
 * 5. Ix: 25+ 1-Click Investigations & AI OCR Lab Report Uploads
 */
import { Sparkles } from 'lucide-react';
import { db } from '@/db/localDb';
import { TagInput } from '@/components/tag-input';
import type { Encounter, InvestigationReport, Patient } from '@/types/schema';
import { ClinicalCcSection } from './clinical-cc-section';
import { ClinicalHistorySection } from './clinical-history-section';
import { ClinicalOeSection } from './clinical-oe-section';
import { ClinicalInvestigationsSection } from './clinical-investigations-section';
import { ProtocolTemplatesDialog } from './protocol-templates-dialog';
import { SuggestedProtocolBanner } from './suggested-protocol-banner';
import { ClinicalPhotoDialog } from './clinical-photo-dialog';

const COMMON_DIAGNOSIS_PRESETS = [
  'Dengue',
  'Diarrhea / GE',
  'PUD / GERD',
  'Hypertension',
  'Type 2 Diabetes',
  'Asthma / COPD',
  'UTI',
  'Common Cold / URTI',
  'Enteric (Typhoid)',
  'Scabies / Tinea',
  'Back Pain / Lumbago',
  'Anxiety / Tension',
];

export function PrescriplyClinicalSidebar({
  encounter,
  patient,
  reports = [],
}: {
  encounter: Encounter;
  patient: Patient;
  reports?: InvestigationReport[];
}) {
  const writeEncounterField = (patch: Partial<Encounter>) => {
    void db.encounters.update(encounter.id, {
      ...patch,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* 1. Chief Complaints (C/C) Section */}
      <ClinicalCcSection encounter={encounter} patient={patient} />

      {/* 2. Patient History & Allergies Section */}
      <ClinicalHistorySection patient={patient} encounter={encounter} />

      {/* 3. Physical Examination (O/E) & Vitals Section */}
      <ClinicalOeSection encounter={encounter} />

      {/* 4. Diagnosis (Dx) & Clinical Protocols */}
      <div className="space-y-1.5 pt-1 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Diagnosis (Dx / রোগ নির্ণয়)
          </span>
          <div className="flex items-center gap-1">
            <ClinicalPhotoDialog encounter={encounter} patient={patient} />
            <ProtocolTemplatesDialog encounter={encounter} patient={patient} compact triggerLabel="রোগভিত্তিক টেমপ্লেট" />
          </div>
        </div>

        <TagInput
          value={encounter.diagnosis || []}
          onChange={(tags) => writeEncounterField({ diagnosis: tags })}
          placeholder="Diagnosis + Enter (e.g. Dengue, Scabies)"
        />

        <div className="flex flex-wrap gap-1">
          {COMMON_DIAGNOSIS_PRESETS.map((diag) => {
            const current = encounter.diagnosis || [];
            const has = current.some((d) => d.toLowerCase() === diag.toLowerCase());
            return (
              <button
                key={diag}
                type="button"
                onClick={() =>
                  writeEncounterField({
                    diagnosis: has
                      ? current.filter((d) => d.toLowerCase() !== diag.toLowerCase())
                      : [...current, diag],
                  })
                }
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold border transition-all ${
                  has
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                }`}
              >
                {has ? '✓ ' : '+ '}
                {diag}
              </button>
            );
          })}
        </div>

        <SuggestedProtocolBanner encounter={encounter} patient={patient} />
      </div>

      {/* 5. Investigations (Ix / পরীক্ষা-নিরীক্ষা ও রিপোর্ট আপলোড) */}
      <ClinicalInvestigationsSection
        patient={patient}
        encounter={encounter}
        reports={reports}
      />
    </div>
  );
}
