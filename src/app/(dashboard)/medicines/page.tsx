'use client';

/**
 * Medicine Catalog:
 * Comprehensive local offline drug directory powered by MedEx Bangladesh (21,000+ items).
 * Instant live search by brand name, generic name, or pharmaceutical manufacturer.
 */
import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  DownloadCloud,
  Loader2,
  Pill,
  Search,
} from 'lucide-react';

import { db } from '@/db/localDb';
import { DEFAULT_TENANT_ID } from '@/db/seedData';
import { getCurrentTenantId } from '@/services/auth';
import { importMedexIntoDexie } from '@/services/medexService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    setProgress({ imported: 0, total: 21382, percent: 0 });
    try {
      await importMedexIntoDexie(tenantId, (imported, total, percent) => {
        setProgress({ imported, total, percent });
      });
    } catch (err) {
      alert(`Import error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-emerald-700" />
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Medicine Directory (MedEx BD)</h1>
            <p className="text-xs text-neutral-500">
              {totalCount.toLocaleString()} medicines indexed locally for 0ms offline prescriptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalCount < 1000 && (
            <Button
              size="sm"
              onClick={handleImportMedex}
              disabled={importing}
              className="bg-emerald-700 hover:bg-emerald-800 text-xs shadow-xs"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <DownloadCloud className="h-4 w-4 mr-1.5" />
              )}
              {importing && progress
                ? `Importing ${progress.percent}% (${progress.imported.toLocaleString()}/${progress.total.toLocaleString()})`
                : 'Import 21,000+ MedEx BD Database'}
            </Button>
          )}

          {totalCount >= 1000 && (
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 py-1 text-xs gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              MedEx Database Loaded ({totalCount.toLocaleString()} items)
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Bar when importing */}
      {importing && progress && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-xs">
          <div className="flex justify-between font-medium text-emerald-900 mb-1">
            <span>Importing MedEx Bangladesh Pharmaceutical Index into Dexie...</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200">
            <div
              className="h-full bg-emerald-600 transition-all duration-200"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Search Bar & Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search by brand (Napa, Seclo), generic (Paracetamol), or pharma..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="pl-8 text-xs h-9 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <span>Page {page + 1}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={medicines.length < PAGE_SIZE}
            onClick={() => setPage((p) => p + 1)}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 font-semibold text-neutral-600">
            <tr>
              <th className="px-4 py-2.5">Brand Name</th>
              <th className="px-4 py-2.5">Generic Formula</th>
              <th className="px-4 py-2.5">Form</th>
              <th className="px-4 py-2.5">Strength</th>
              <th className="px-4 py-2.5">Pharmaceutical Company</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {medicines.map((m) => (
              <tr key={m.id} className="hover:bg-neutral-50/70 transition-colors">
                <td className="px-4 py-2.5 font-bold text-neutral-900">{m.brand_name}</td>
                <td className="px-4 py-2.5 text-neutral-700">{m.generic_name}</td>
                <td className="px-4 py-2.5">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-medium">
                    {m.dosage_form}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 text-neutral-600 font-mono text-[11px]">{m.strength}</td>
                <td className="px-4 py-2.5 text-neutral-500">{m.manufacturer}</td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  {totalCount === 0
                    ? 'Catalog is empty. Click "Import 21,000+ MedEx BD Database" above.'
                    : 'No medicines found matching your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
