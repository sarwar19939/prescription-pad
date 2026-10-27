'use client';

/**
 * Add / Upload Investigation Report Dialog:
 * Supports file upload (Image/PDF) with AI OCR/extraction, or manual entry.
 */
import { useState } from 'react';
import { Loader2, Plus, Sparkles, Trash2, Upload } from 'lucide-react';

import { db } from '@/db/localDb';
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

interface AddReportDialogProps {
  patient: Patient;
  encounterId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMMON_PRESETS = [
  { name: 'Glycemic Panel', metrics: { 'HbA1c': '', 'Fasting Blood Sugar': '' } },
  { name: 'Renal Function (RFT)', metrics: { 'Serum Creatinine': '', 'Blood Urea': '', 'eGFR': '' } },
  { name: 'Lipid Profile', metrics: { 'Total Cholesterol': '', 'Triglycerides': '', 'HDL': '', 'LDL': '' } },
  { name: 'CBC', metrics: { 'Hemoglobin': '', 'WBC Count': '', 'Platelet Count': '' } },
  { name: 'LFT', metrics: { 'SGPT / ALT': '', 'SGOT / AST': '', 'Total Bilirubin': '' } },
];

export function AddReportDialog({
  patient,
  encounterId,
  open,
  onOpenChange,
}: AddReportDialogProps) {
  const [testName, setTestName] = useState('Glycemic Profile');
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [metrics, setMetrics] = useState<Array<{ key: string; value: string }>>([
    { key: 'HbA1c', value: '7.2 %' },
    { key: 'Fasting Blood Sugar', value: '135 mg/dL' },
  ]);
  const [abnormalityFlags, setAbnormalityFlags] = useState('Elevated HbA1c, Borderline Fasting Sugar');
  const [aiSummary, setAiSummary] = useState('');
  const [fileData, setFileData] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileData({ name: file.name, base64: reader.result as string, mimeType: file.type });
    reader.readAsDataURL(file);
  };

  const runAiExtraction = async () => {
    setAnalyzing(true);
    try {
      const content = fileData?.base64 || `Test: ${testName}\n${metrics.map((m) => `${m.key}: ${m.value}`).join('\n')}`;
      const result = await analyzeLabReport(content, { mimeType: fileData?.mimeType || 'text/plain' });
      if (result.test_name) setTestName(result.test_name);
      if (result.ai_summary) setAiSummary(result.ai_summary);
      if (result.abnormality_flags?.length) setAbnormalityFlags(result.abnormality_flags.join(', '));
      if (result.extracted_metrics) {
        setMetrics(Object.entries(result.extracted_metrics).map(([k, v]) => ({ key: k, value: String(v) })));
      }
    } catch (err) {
      alert(`AI Extraction Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const applyPreset = (preset: typeof COMMON_PRESETS[number]) => {
    setTestName(preset.name);
    setMetrics(Object.entries(preset.metrics).map(([k, v]) => ({ key: k, value: v })));
  };

  const updateMetric = (idx: number, field: 'key' | 'value', val: string) => {
    setMetrics((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    if (!testName.trim()) return;
    setSaving(true);
    try {
      const metricObj: Record<string, string> = {};
      metrics.forEach((m) => {
        if (m.key.trim()) metricObj[m.key.trim()] = m.value.trim();
      });
      const flags = abnormalityFlags.split(',').map((f) => f.trim()).filter(Boolean);
      const ts = new Date().toISOString();
      await db.investigation_reports.add({
        id: generateUUID(),
        tenant_id: patient.tenant_id,
        patient_id: patient.id,
        encounter_id: encounterId ?? null,
        test_name: testName.trim(),
        report_date: reportDate,
        cloud_file_url: null,
        extracted_metrics: metricObj,
        abnormality_flags: flags,
        ai_summary: aiSummary || null,
        created_at: ts,
        updated_at: ts,
        sync_status: 'pending',
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Lab Investigation Report</DialogTitle>
          <DialogDescription>Upload a report document/image or log key laboratory markers manually.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 text-xs">
          <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50/40 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-emerald-600" /> Upload Report Image or PDF
              </span>
              <Button type="button" size="sm" variant="outline" onClick={runAiExtraction} disabled={analyzing} className="h-7 text-xs border-emerald-600 text-emerald-700">
                {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
                AI Auto-Extract Metrics
              </Button>
            </div>
            <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="text-xs text-neutral-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-emerald-100 file:text-emerald-800" />
            {fileData && <span className="text-[11px] text-emerald-700">Ready to analyze: {fileData.name}</span>}
          </div>

          <div>
            <Label className="text-[11px] text-neutral-500 mb-1 block">Quick Clinical Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((p) => (
                <button key={p.name} type="button" onClick={() => applyPreset(p)} className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] hover:bg-neutral-200 text-neutral-700">
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Test / Investigation Name</Label>
              <Input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="e.g. Glycemic Profile" className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Report Date</Label>
              <Input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs font-semibold">Report Metrics (Key-Value)</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setMetrics((prev) => [...prev, { key: '', value: '' }])} className="h-6 text-xs text-emerald-700">
                <Plus className="h-3 w-3 mr-1" /> Add Parameter
              </Button>
            </div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {metrics.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input placeholder="Parameter (e.g. HbA1c)" value={m.key} onChange={(e) => updateMetric(idx, 'key', e.target.value)} className="h-7 text-xs flex-1" />
                  <Input placeholder="Value (e.g. 7.2 %)" value={m.value} onChange={(e) => updateMetric(idx, 'value', e.target.value)} className="h-7 text-xs flex-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setMetrics((prev) => prev.filter((_, i) => i !== idx))} className="h-7 w-7 p-0 text-neutral-400 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Abnormality Flags (comma-separated)</Label>
            <Input value={abnormalityFlags} onChange={(e) => setAbnormalityFlags(e.target.value)} placeholder="e.g. Elevated HbA1c, Low Hemoglobin" className="mt-1 h-8 text-xs" />
          </div>

          {aiSummary && (
            <div className="rounded bg-neutral-50 p-2 border border-neutral-200">
              <span className="font-semibold text-neutral-700 block mb-0.5">AI Interpretation:</span>
              <p className="text-neutral-600 text-[11px]">{aiSummary}</p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !testName.trim()} className="bg-emerald-700 hover:bg-emerald-800">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
            Save to Patient Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
