'use client';

/**
 * Add / Upload Investigation Report Dialog:
 * Supports file upload (Image/PDF) with AI OCR/extraction, or manual entry.
 */
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { stripAiGeneratedFindings } from '@/lib/prescriptionFormatters';
import { generateUUID } from '@/lib/uuid';
import { analyzeLabReport } from '@/services/aiClinicalCopilot';
import type { Patient } from '@/types/schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InvestigationAiPreview } from './investigation-ai-preview';
import { ReportMetricEditor, type MetricItem } from './report-metric-editor';
import { ReportUploader } from './report-uploader';
import { COMMON_REPORT_PRESETS, type ReportPreset } from './report-presets';

interface AddReportDialogProps {
  patient: Patient;
  encounterId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReportDialog({
  patient,
  encounterId,
  open,
  onOpenChange,
}: AddReportDialogProps) {
  const [testName, setTestName] = useState(''); const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [metrics, setMetrics] = useState<Array<{ key: string; value: string }>>([]);
  const [abnormalityFlags, setAbnormalityFlags] = useState('');
  const [aiSummary, setAiSummary] = useState(''); const [clinicalImpression, setClinicalImpression] = useState('');
  const [keyFindings, setKeyFindings] = useState<string[]>([]); const [suggestedDiagnosis, setSuggestedDiagnosis] = useState('');
  const [recommendedActions, setRecommendedActions] = useState<string[]>([]);
  const [reportType, setReportType] = useState('');
  const [aiProvider, setAiProvider] = useState<string>('');
  const [fileData, setFileData] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false); const [saving, setSaving] = useState(false); const [appliedToRx, setAppliedToRx] = useState(false);

  useEffect(() => {
    if (open) {
      setTestName(''); setMetrics([]); setAbnormalityFlags(''); setAiSummary('');
      setClinicalImpression(''); setKeyFindings([]); setSuggestedDiagnosis('');
      setRecommendedActions([]); setReportType(''); setAiProvider(''); setFileData(null); setAppliedToRx(false);
    }
  }, [open]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileData({ name: file.name, base64: reader.result as string, mimeType: file.type });
    reader.readAsDataURL(file);
  };

  const runAiExtraction = async () => {
    const hasText = testName.trim() || metrics.some((m) => m.key.trim() && m.value.trim());
    if (!fileData?.base64 && !hasText) {
      alert('অনুগ্রহ করে কোনো রিপোর্ট ছবি বা ফাইল আপলোড করুন অথবা পরীক্ষার নাম ও ফলাফল লিখুন।');
      return;
    }
    setAnalyzing(true);
    try {
      const content = fileData?.base64 || `Test: ${testName}\n${metrics.map((m) => `${m.key}: ${m.value}`).join('\n')}`;
      const result = await analyzeLabReport(content, {
        mimeType: fileData?.mimeType || 'text/plain',
        testName: testName.trim(),
        reportType: reportType,
        fileName: fileData?.name,
      });
      if (result.test_name) setTestName(result.test_name);
      if (result.report_type) setReportType(result.report_type);
      if (result.ai_provider) setAiProvider(result.ai_provider);
      if (result.ai_summary) setAiSummary(result.ai_summary);
      if (result.clinical_impression) setClinicalImpression(result.clinical_impression);
      if (result.key_findings?.length) setKeyFindings(result.key_findings);
      if (result.suggested_diagnosis) setSuggestedDiagnosis(result.suggested_diagnosis);
      if (result.recommended_actions?.length) setRecommendedActions(result.recommended_actions);
      if (result.abnormality_flags?.length) setAbnormalityFlags(result.abnormality_flags.join(', '));
      if (result.extracted_metrics) setMetrics(Object.entries(result.extracted_metrics).map(([k, v]) => ({ key: k, value: String(v) })));
    } catch (err) {
      alert(`AI Extraction Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const applyPreset = (preset: ReportPreset) => {
    setTestName(preset.name);
    if (preset.reportType) setReportType(preset.reportType);
    setMetrics(Object.entries(preset.metrics).map(([k, v]) => ({ key: k, value: v })));
  };

  const persistReport = async (ts: string) => {
    const metricObj = Object.fromEntries(
      metrics.filter((m) => m.key.trim()).map((m) => [m.key.trim(), m.value.trim()]),
    );
    const flags = abnormalityFlags.split(',').map((f) => f.trim()).filter(Boolean);
    const summaryText = clinicalImpression
      ? `${clinicalImpression}${aiSummary ? ' — ' + aiSummary : ''}`
      : (aiSummary || (flags.length ? flags.join(', ') : 'Normal study'));
    await db.investigation_reports.add({
      id: generateUUID(), tenant_id: patient.tenant_id, patient_id: patient.id,
      encounter_id: encounterId ?? null, test_name: testName.trim(), report_date: reportDate,
      cloud_file_url: null, extracted_metrics: metricObj, abnormality_flags: flags,
      ai_summary: summaryText, created_at: ts, updated_at: ts, sync_status: 'pending',
    });
    return flags;
  };

  const saveReportOnly = async () => {
    if (!testName.trim()) return;
    setSaving(true);
    try { await persistReport(new Date().toISOString()); onOpenChange(false); } finally { setSaving(false); }
  };

  const handleApplyToPrescription = async () => {
    if (!testName.trim()) return;
    setSaving(true);
    try {
      const ts = new Date().toISOString();
      const flags = await persistReport(ts);

      if (encounterId) {
        const enc = await db.encounters.get(encounterId);
        if (enc) {
          const currentDiags = enc.diagnosis || [];
          const updatedDiags = suggestedDiagnosis && !currentDiags.includes(suggestedDiagnosis)
            ? [...currentDiags, suggestedDiagnosis] : currentDiags;
          const reportDetail = clinicalImpression || (flags.length ? flags.join(', ') : 'স্বাভাবিক (Normal)');
          const findingLine = `[${testName.trim()}]: ${reportDetail}`;
          const cleanFindings = stripAiGeneratedFindings(enc.clinical_findings);
          const existingAiNotes = enc.ai_suggested_notes || '';
          const updatedAiNotes = [existingAiNotes, findingLine].filter(Boolean).join('\n');
          await db.encounters.update(encounterId, {
            diagnosis: updatedDiags,
            clinical_findings: cleanFindings,
            ai_suggested_notes: updatedAiNotes,
            updated_at: ts,
            sync_status: 'pending',
          });
        }
      }

      setAppliedToRx(true);
      setTimeout(() => {
        setAppliedToRx(false);
        onOpenChange(false);
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-slate-900">
            <Sparkles className="h-5 w-5 text-teal-600" />
            ইনভেস্টিগেশন, ইসিজি ও এমআরআই অ্যানালাইজার (AI Vision & OCR)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            ইসিজি ট্র্যাসিং, এমআরআই/সিটি ফিল্ম বা ল্যাব রিপোর্টের ছবি আপলোড করুন; AI রোগ ডায়াগনোসিস করে সরাসরি প্রেসক্রিপশনে ইনপুট নিতে সাহায্য করবে।
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5 py-2 text-xs">
          {/* File Upload Box */}
          <ReportUploader
            fileData={fileData}
            onFileUpload={handleFileUpload}
            onRunAi={runAiExtraction}
            analyzing={analyzing}
          />

          {/* Quick Presets */}
          <div>
            <Label className="text-[11px] font-semibold text-slate-500 mb-1 block">কমন ইনভেস্টিগেশন প্রিসেট</Label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REPORT_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    testName.toLowerCase() === p.name.toLowerCase()
                      ? 'bg-teal-700 text-white border-teal-700 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Clinical Interpretation & Diagnostic Card */}
          <InvestigationAiPreview
            reportType={reportType}
            suggestedDiagnosis={suggestedDiagnosis}
            clinicalImpression={clinicalImpression}
            keyFindings={keyFindings}
            recommendedActions={recommendedActions}
            aiProvider={aiProvider}
          />

          {/* Test Name & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">পরীক্ষার নাম (Test / Investigation Name)</Label>
              <Input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="যেমন: 12-Lead ECG, MRI Spine, CBC"
                className="mt-1 h-8 text-xs font-medium"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">রিপোর্টের তারিখ</Label>
              <Input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="mt-1 h-8 text-xs font-medium"
              />
            </div>
          </div>

          {/* Key-Value Metrics */}
          <ReportMetricEditor metrics={metrics} onChange={setMetrics} />

          {/* Abnormality Flags */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">অস্বাভাবিক ফ্ল্যাগ বা নোট (Abnormality Flags)</Label>
            <Input
              value={abnormalityFlags}
              onChange={(e) => setAbnormalityFlags(e.target.value)}
              placeholder="যেমন: ST Elevation in V1-V4, Disc Prolapse L4-L5"
              className="mt-1 h-8 text-xs font-medium"
            />
          </div>
        </div>

        <DialogFooter className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={saving} className="text-xs">
            বাতিল
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={saveReportOnly}
              disabled={saving || !testName.trim()}
              className="text-xs border-slate-300 text-slate-700"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
              শুধু রিপোর্ট সংরক্ষণ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApplyToPrescription}
              disabled={saving || !testName.trim()}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : appliedToRx ? <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-300" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
              {appliedToRx ? 'যুক্ত হয়েছে!' : 'প্রেসক্রিপশনে সরাসরি যুক্ত করুন'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
