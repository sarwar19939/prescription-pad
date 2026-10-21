'use client';

/**
 * Medicine Catalog:
 * Comprehensive local offline drug directory powered by MedEx Bangladesh (21,000+ items).
 * Instant live search by brand name, generic name, or pharmaceutical manufacturer.
 */
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  Loader2,
  Pill,
  Search,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { getCurrentTenantId } from '@/services/auth';
import { importMedexIntoDexie } from '@/services/medexService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeInView } from '@/components/ui/motion';

const PAGE_SIZE = 50;

export default function MedicinesPage() {
  const tenantId = getCurrentTenantId();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ imported: number; total: number; percent: number } | null>(null);

  const totalCount = useLiveQuery(
    () => db.medicine_catalog.count(),
    [],
    0,
  );

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
    setProgress({ imported: 0, total: 23656, percent: 0 });
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
          {totalCount >= 1000 && (
            <Badge variant="outline" className="border-teal-300 bg-teal-50 text-teal-800 py-1.5 px-3 text-sm font-semibold gap-1.5 rounded-xl hidden sm:inline-flex">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              MedEx Database ({totalCount.toLocaleString()} items)
            </Badge>
          )}

          <Button
            onClick={handleImportMedex}
            disabled={importing}
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
              <th className="px-5 py-3.5">Generic Formula</th>
              <th className="px-5 py-3.5">Form</th>
              <th className="px-5 py-3.5">Strength</th>
              <th className="px-5 py-3.5">Pharmaceutical Company</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {medicines.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-bold text-base text-slate-950">{m.brand_name}</td>
                <td className="px-5 py-3.5 text-slate-700 font-medium">{m.generic_name}</td>
                <td className="px-5 py-3.5">
                  <Badge variant="secondary" className="text-xs py-0.5 px-2.5 font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {m.dosage_form}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-slate-800 font-mono font-bold text-sm">{m.strength}</td>
                <td className="px-5 py-3.5 text-slate-500 font-medium">{m.manufacturer}</td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500 font-medium">
                  {totalCount === 0
                    ? 'Catalog is empty. Click "Import 21,000+ MedEx BD Database" above.'
                    : 'No medicines found matching your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </FadeInView>
  );
}
