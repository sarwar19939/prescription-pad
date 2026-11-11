'use client';

/**
 * ClinicalInvestigationsSection — 1-Click Investigation Presets & AI OCR Report Upload.
 * Lets doctors prescribe common lab/radiology tests with a single click, type custom tests,
 * and view or upload biomarker reports into Dexie (offline-first).
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical, Plus, Trash2, Upload } from 'lucide-react';
import { db } from '@/db/localDb';
import { generateUUID } from '@/lib/uuid';
import type { Encounter, InvestigationReport, Patient } from '@/types/schema';
import { AddReportDialog } from '../lab-trends/add-report-dialog';
import { COMMON_INVESTIGATION_PRESETS } from './clinical-presets';

export function ClinicalInvestigationsSection({
  patient,
  encounter,
  reports = [],
}: {
  patient: Patient;
  encounter: Encounter;
  reports?: InvestigationReport[];
}) {
  const [addReportOpen, setAddReportOpen] = useState(false);
  const [customTest, setCustomTest] = useState('');
  const [showMoreIx, setShowMoreIx] = useState(false);

  const addInvestigation = async (testName: string) => {
    const trimmed = testName.trim();
    if (!trimmed) return;
    const exists = reports.some(
      (r) => r.test_name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) return;

    const ts = new Date().toISOString();
    await db.investigation_reports.add({
      id: generateUUID(),
      tenant_id: patient.tenant_id,
      patient_id: patient.id,
      encounter_id: encounter.id,
      test_name: trimmed,
      report_date: ts,
      cloud_file_url: null,
      extracted_metrics: {},
      abnormality_flags: [],
      ai_summary: null,
      created_at: ts,
      updated_at: ts,
      sync_status: 'pending',
    });
    setCustomTest('');
  };

  const removeInvestigation = async (reportId: string) => {
    await db.investigation_reports.delete(reportId);
  };

  const TOP_IX_PRESETS = [
    'CBC with ESR',
    'Urine R/M/E',
    'RBS with CUS',
    'Serum Creatinine',
    'SGPT (ALT)',
    'Lipid Profile',
    'USG of Whole Abdomen',
    'X-Ray Chest P/A',
    'ECG (12-Lead)',
    'Serum TSH',
    'Dengue NS1 Ag',
  ];

  return (
    <div className="space-y-2 pt-1 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <span className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-xs">
          <FlaskConical className="h-3.5 w-3.5 text-teal-600" />
          Investigations (Ix / ল্যাব টেস্ট)
        </span>
        <button
          type="button"
          onClick={() => setAddReportOpen(true)}
          className="flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded px-2 py-0.5 transition-colors shadow-2xs"
        >
          <Upload className="h-3 w-3" /> + রিপোর্ট আপলোড (AI OCR)
        </button>
      </div>

      {/* Advised Tests List for Today's Visit */}
      {reports.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {reports.map((r) => (
            <span
              key={r.id}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-800 shadow-2xs"
            >
              <span>• {r.test_name}</span>
              {r.abnormality_flags.length > 0 && (
                <span className="text-rose-600 font-bold text-[10px]">
                  ({r.abnormality_flags.join(', ')})
                </span>
              )}
              <button
                type="button"
                onClick={() => void removeInvestigation(r.id)}
                className="text-slate-400 hover:text-rose-600 ml-0.5"
                title="রিমুভ করুন"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 italic">
          কোনো ল্যাব পরীক্ষা সিলেক্ট করা নেই। নিচের টেস্ট বাটনে ক্লিক করুন:
        </p>
      )}

      {/* 1-Click Investigation Presets */}
      <div className="flex flex-wrap gap-1">
        {(showMoreIx ? COMMON_INVESTIGATION_PRESETS : TOP_IX_PRESETS).map((test) => {
          const has = reports.some((r) => r.test_name.toLowerCase() === test.toLowerCase());
          return (
            <button
              key={test}
              type="button"
              onClick={() => void addInvestigation(test)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border transition-all ${
                has
                  ? 'bg-teal-700 text-white border-teal-700 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50'
              }`}
            >
              {has ? '✓ ' : '+ '}
              {test}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowMoreIx(!showMoreIx)}
          className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-0.5"
        >
          {showMoreIx ? <ChevronUp className="h-3 w-3" /> : <>+ আরও টেস্ট <ChevronDown className="h-3 w-3" /></>}
        </button>
      </div>

      {/* Custom Test Free-text Add */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={customTest}
          onChange={(e) => setCustomTest(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void addInvestigation(customTest);
            }
          }}
          placeholder="অন্য কোনো পরীক্ষা লিখুন + Enter..."
          className="h-8 flex-1 rounded-lg border border-slate-300 px-2.5 text-xs text-slate-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30"
        />
        <button
          type="button"
          onClick={() => void addInvestigation(customTest)}
          disabled={!customTest.trim()}
          className="h-8 px-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <AddReportDialog
        patient={patient}
        encounterId={encounter.id}
        open={addReportOpen}
        onOpenChange={setAddReportOpen}
      />
    </div>
  );
}
