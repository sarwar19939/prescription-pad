'use client';

/**
 * Settings & Configuration View:
 * Edits clinic letterhead, medical registration number, print margin calibration,
 * AI provider selection (Cloud Gemini vs Local Ollama), and links to SaaS Billing.
 * Saves to Dexie first with sync_status: 'pending'.
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { Bot, CheckCircle2, CreditCard, Loader2, Save, Sliders, Sparkles } from 'lucide-react';

import { db } from '@/db/localDb';
import { getCurrentTenantId } from '@/services/auth';
import type { Tenant } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BackupRestoreCard } from '@/features/settings/backup-restore-card';

const CLINICAL_FIELDS: Array<{ key: keyof Tenant; label: string; placeholder?: string }> = [
  { key: 'clinic_name', label: 'Clinic / Practice Name' },
  { key: 'doctor_name', label: 'Doctor Full Name' },
  { key: 'degrees', label: 'Degrees & Qualifications', placeholder: 'MBBS, MD' },
  { key: 'specialty', label: 'Specialty', placeholder: 'General Physician' },
  { key: 'reg_number', label: 'Medical Registration Number', placeholder: 'MCI-123456' },
  { key: 'phone', label: 'Clinic Contact Phone' },
  { key: 'address', label: 'Clinic Physical Address' },
];

export default function SettingsPage() {
  const tenantId = getCurrentTenantId();
  const tenant = useLiveQuery(() => db.tenants.get(tenantId), [tenantId]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (tenant === undefined) {
    return <Loader2 className="mx-auto mt-10 h-6 w-6 animate-spin text-neutral-400" aria-hidden />;
  }

  const patch = (fields: Partial<Tenant>) => {
    setSaved(false);
    void db.tenants.update(tenant.id, fields);
  };

  const save = async () => {
    if (!tenant) return;
    setSaving(true);
    await db.tenants.update(tenant.id, {
      ...tenant,
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Settings &amp; Workspace Configuration</h1>
          <p className="text-xs text-neutral-500">Configure clinic letterhead, calibration, and AI services</p>
        </div>
        <Button asChild variant="outline" size="sm" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50">
          <Link href="/settings/billing">
            <CreditCard className="h-4 w-4 mr-1.5 text-emerald-600" />
            Billing &amp; Subscription
          </Link>
        </Button>
      </div>

      {/* 1. Clinic Letterhead */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600 flex items-center gap-1.5">
          <Sliders className="h-4 w-4 text-emerald-700" /> Clinic Letterhead &amp; Physician Credentials
        </h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {CLINICAL_FIELDS.map((f) => (
            <label key={f.key} className="grid gap-1 text-xs text-neutral-600">
              {f.label}
              <input
                className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-600"
                value={String(tenant[f.key] ?? '')}
                placeholder={f.placeholder}
                onChange={(e) => patch({ [f.key]: e.target.value })}
              />
            </label>
          ))}
        </div>
      </div>

      {/* 2. Print Margin Calibration */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
          Prescription Print Calibration (Pre-Printed Pads)
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex gap-6">
            <label className="flex flex-col gap-1 text-xs text-neutral-600">
              Top margin offset (mm)
              <input
                type="number"
                min={0}
                max={120}
                className="w-36 rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-600"
                value={tenant.print_margin_top_mm}
                onChange={(e) => patch({ print_margin_top_mm: Number(e.target.value) || 0 })}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-neutral-600">
              Left margin offset (mm)
              <input
                type="number"
                min={0}
                max={80}
                className="w-36 rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-600"
                value={tenant.print_margin_left_mm}
                onChange={(e) => patch({ print_margin_left_mm: Number(e.target.value) || 0 })}
              />
            </label>
          </div>
          <Separator />
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-emerald-700"
              checked={tenant.hide_header_for_print === true}
              onChange={(e) => patch({ hide_header_for_print: e.target.checked })}
            />
            <span>
              <span className="font-medium text-neutral-800">Hide Letterhead Header on Print</span>
              <span className="block text-xs text-neutral-500">
                Skips digital header and uses top margin offset for stationery with pre-printed doctor headers.
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* 3. AI Clinical Co-Pilot Config */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-emerald-600" /> AI Co-Pilot Provider Configuration
        </h2>
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="ai_provider"
                checked={(tenant.ai_provider || 'cloud') === 'cloud'}
                onChange={() => patch({ ai_provider: 'cloud' })}
                className="accent-emerald-700"
              />
              <span className="font-medium text-neutral-800">Cloud Provider (Google Gemini API)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="ai_provider"
                checked={tenant.ai_provider === 'local'}
                onChange={() => patch({ ai_provider: 'local' })}
                className="accent-emerald-700"
              />
              <span className="font-medium text-neutral-800">Local Offline Provider (Ollama)</span>
            </label>
          </div>

          {(tenant.ai_provider || 'cloud') === 'cloud' ? (
            <label className="grid gap-1 text-xs text-neutral-600">
              Custom Gemini API Key (optional override)
              <input
                type="password"
                placeholder="AIzaSy... (leave blank to use server environment variable)"
                className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-600 max-w-md font-mono"
                value={tenant.ai_api_key || ''}
                onChange={(e) => patch({ ai_api_key: e.target.value })}
              />
              <span className="text-[11px] text-neutral-400">
                If blank, system uses server-configured GEMINI_API_KEY. PII is always stripped.
              </span>
            </label>
          ) : (
            <label className="grid gap-1 text-xs text-neutral-600">
              Local Ollama Base URL
              <input
                type="text"
                placeholder="http://localhost:11434"
                className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-600 max-w-md font-mono"
                value={tenant.ollama_base_url || 'http://localhost:11434'}
                onChange={(e) => patch({ ollama_base_url: e.target.value })}
              />
              <span className="text-[11px] text-neutral-400">
                Connects directly to your local Ollama daemon for 100% air-gapped clinical suggestions.
              </span>
            </label>
          )}
        </div>
      </div>

      {/* 4. Local Database Backup & Restore */}
      <BackupRestoreCard />

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <Button onClick={() => void save()} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          Save Workspace Settings
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Saved locally — marked pending sync
          </span>
        )}
      </div>
    </div>
  );
}
