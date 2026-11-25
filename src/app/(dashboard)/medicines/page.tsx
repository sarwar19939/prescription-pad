'use client';

/**
 * MedRecord — Offline-First Medicine Directory (MedEx Bangladesh Index).
 *
 * Provides lightning-fast local search across 23,600+ BD medicines.
 * Includes automated deduplication to detect and purge accidental duplicate uploads.
 */
import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  Loader2,
  Pill,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { getCurrentTenantId } from '@/services/auth';
import { deduplicateMedicineCatalog, importMedexIntoDexie } from '@/services/medexService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeInView } from '@/components/ui/motion';

const PAGE_SIZE = 50;
const EXPECTED_CATALOG_COUNT = 23684;

export default function MedicinesPage() {
  const tenantId = getCurrentTenantId();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [importing, setImporting] = useState(false);
  const [deduplicating, setDeduplicating] = useState(false);
  const [dedupeMessage, setDedupeMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ imported: number; total: number; percent: number } | null>(null);

  const totalCount = useLiveQuery(
    () => db.medicine_catalog.count(),
    [],
    0,
  );

  // Only consider bloated if duplicate mass-uploads occurred (> 30,000 items)
  const isBloated = totalCount > 30000;

  const handleDeduplicate = useCallback(async () => {
    setDeduplicating(true);
    setDedupeMessage(null);
    try {
      const { removed, remaining } = await deduplicateMedicineCatalog(tenantId);
      setDedupeMessage(
        `সফলভাবে ${removed.toLocaleString()} টি ডুপ্লিকেট আইটেম মুছে ফেলা হয়েছে! অবশিষ্ট মূল আইটেম: ${remaining.toLocaleString()} টি।`,
      );
    } catch (err) {
      alert(`Deduplication error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeduplicating(false);
    }
  }, [tenantId]);

  // Auto-deduplicate on initial load if bloated (> 30,000 items)
  useEffect(() => {
    if (isBloated && !deduplicating && !importing) {
      void handleDeduplicate();
    }
  }, [isBloated, deduplicating, importing, handleDeduplicate]);

  const medicines = useLiveQuery(
    async () => {
      const q = query.trim().toLowerCase();
      if (!q) {
        return db.medicine_catalog.offset(page * PAGE_SIZE).limit(PAGE_SIZE).toArray();
      }
      return db.medicine_catalog
        .filter(
          (m) =>
            m.brand_name.toLowerCase().includes(q) ||
            m.generic_name.toLowerCase().includes(q) ||
            m.manufacturer.toLowerCase().includes(q),
        )
        .offset(page * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .toArray();
    },
    [query, page],
    [],
  );

  const handleImportMedex = async () => {
    setImporting(true);
    setProgress({ imported: 0, total: EXPECTED_CATALOG_COUNT, percent: 0 });
    try {
      await importMedexIntoDexie(tenantId, (imported, total, percent) => {
        setProgress({ imported, total, percent });
      }, true);
    } catch (err) {
      alert(`Import error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <FadeInView className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medicine Directory (MedEx BD)</h1>
            <p className="text-sm text-slate-500 font-medium">
              {totalCount.toLocaleString()} medicines indexed locally for instant 0ms offline prescriptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalCount >= 1000 && !isBloated && (
            <Badge variant="outline" className="border-teal-300 bg-teal-50 text-teal-800 py-1.5 px-3 text-sm font-semibold gap-1.5 rounded-xl hidden sm:inline-flex">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              MedEx Database ({totalCount.toLocaleString()} items)
            </Badge>
          )}

          {isBloated && (
            <Button
              onClick={handleDeduplicate}
              disabled={deduplicating}
              className="h-11 px-5 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {deduplicating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              ডুপ্লিকেট রিমুভ করুন ({Math.max(0, totalCount - EXPECTED_CATALOG_COUNT).toLocaleString()} টি অতিরিক্ত)
            </Button>
          )}

          <Button
            onClick={handleImportMedex}
            disabled={importing || deduplicating}
            className="h-11 px-5 rounded-xl font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <DownloadCloud className="h-4 w-4 mr-2" />
            )}
            {importing && progress
              ? `Syncing ${progress.percent}% (${progress.imported.toLocaleString()}/${progress.total.toLocaleString()})`
              : totalCount < 1000
                ? 'Import 23,600+ MedEx BD Catalog'
                : 'Re-sync / Update MedEx (Cap + Tab)'}
          </Button>
        </div>
      </div>

      {/* Duplicate Alert Banner */}
      {isBloated && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-950 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <strong className="font-bold text-sm block">
                মেডিসিন তালিকায় ডুপ্লিকেট পাওয়া গেছে ({totalCount.toLocaleString()} টি আইটেম)
              </strong>
              <span className="text-xs text-rose-800">
                ভুলবশত একাধিকবার আপলোড হওয়ার কারণে অতিরিক্ত {Math.max(0, totalCount - EXPECTED_CATALOG_COUNT).toLocaleString()} টি ডুপ্লিকেট রয়েছে।
              </span>
            </div>
          </div>
          <Button
            size="sm"
            disabled={deduplicating}
            onClick={handleDeduplicate}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs"
          >
            {deduplicating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1.5" />
            )}
            ডুপ্লিকেট মুছে মূল ডাটা ({EXPECTED_CATALOG_COUNT.toLocaleString()}) রাখুন
          </Button>
        </div>
      )}

      {/* Deduplication Success Message */}
      {dedupeMessage && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{dedupeMessage}</span>
        </div>
      )}

      {/* Progress Bar when importing */}
      {importing && progress && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 text-sm font-medium">
          <div className="flex justify-between font-semibold text-teal-900 mb-2">
            <span>Importing MedEx Bangladesh Pharmaceutical Index into Dexie...</span>
            <span className="font-mono">{progress.percent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-teal-200">
            <div
              className="h-full bg-teal-600 transition-all duration-200"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Search Bar & Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by brand (Napa, Seclo), generic, or pharma..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="h-11 pl-10 rounded-xl border-slate-300 text-sm font-medium bg-white"
          />
        </div>

        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <span>Page {page + 1}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="h-9 w-9 p-0 rounded-lg border-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={medicines.length < PAGE_SIZE}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 w-9 p-0 rounded-lg border-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-5 py-3.5">Brand Name</th>
              <th className="px-5 py-3.5">Generic Name</th>
              <th className="px-5 py-3.5">Strength</th>
              <th className="px-5 py-3.5">Dosage Form</th>
              <th className="px-5 py-3.5">Manufacturer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {medicines.map((med) => (
              <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3 font-bold text-slate-900">{med.brand_name}</td>
                <td className="px-5 py-3 text-slate-600">{med.generic_name}</td>
                <td className="px-5 py-3 text-slate-500 font-mono text-xs">{med.strength}</td>
                <td className="px-5 py-3">
                  <Badge variant="secondary" className="font-semibold text-xs rounded-md">
                    {med.dosage_form}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-slate-600 text-xs">{med.manufacturer}</td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No medicines found matching &ldquo;{query}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </FadeInView>
  );
}
