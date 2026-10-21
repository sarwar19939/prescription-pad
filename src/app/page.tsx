'use client';

/**
 * Phase 1 diagnostic page — verifies the local Dexie database seeded
 * properly and reports row counts per table. Not a real product UI;
 * feature UIs arrive in later phases.
 */
import { useEffect, useState } from 'react';
import { CheckCircle2, Database, Loader2, RefreshCw, TriangleAlert } from 'lucide-react';

import { db, LOCAL_DB_NAME, TABLE_NAMES } from '@/db/localDb';
import { seedInitialData } from '@/db/seed';

interface RowInfo {
  table: (typeof TABLE_NAMES)[number];
  count: number;
  ok: boolean;
}

type Phase = 'idle' | 'initializing' | 'ready' | 'error';

export default function DiagnosticsPage() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<RowInfo[]>([]);

  const bootstrap = async () => {
    setPhase('initializing');
    setError(null);
    try {
      await seedInitialData();
      const counts = await Promise.all(
        TABLE_NAMES.map(async (table) => ({
          table,
          count: await db[table].count(),
          ok: (await db[table].count()) > 0,
        })),
      );
      setRows(counts);
      setPhase('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPhase('error');
    }
  };

  useEffect(() => {
    setMounted(true);
    void bootstrap();
    // Runs once on mount; explicit re-seed is user-triggered.
  }, []);

  if (!mounted) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-8 font-sans">
        <div className="flex items-center gap-2 text-neutral-600">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span>Initializing MedRecord workspace…</span>
        </div>
      </main>
    );
  }

  if (!('indexedDB' in globalThis)) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-red-600">IndexedDB is not available in this environment.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8 font-sans">
      <header className="flex items-center gap-3">
        <Database className="h-8 w-8 text-emerald-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-semibold">MedRecord — Phase 1 Diagnostics</h1>
          <p className="text-sm text-neutral-500">
            Local Dexie database: <code className="font-mono">{LOCAL_DB_NAME}</code>
          </p>
        </div>
      </header>

      {phase === 'initializing' && (
        <div className="flex items-center gap-2 text-neutral-600">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span>Opening IndexedDB and seeding initial data…</span>
        </div>
      )}

      {phase === 'error' && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <span>Seed failed: {error}</span>
        </div>
      )}

      {phase === 'ready' && (
        <>
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
            <span>Dexie.js opened and seeded successfully.</span>
          </div>
          <ul className="divide-y divide-neutral-200 overflow-hidden rounded-md border border-neutral-200">
            {rows.map((row) => (
              <li key={row.table} className="flex items-center justify-between px-4 py-3">
                <code className="font-mono text-sm">{row.table}</code>
                <span className={row.ok ? 'font-medium text-emerald-700' : 'text-neutral-500'}>
                  {row.count} row{row.count === 1 ? '' : 's'}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Enter Clinic Workspace
            </a>
            <button
              type="button"
              onClick={() => void bootstrap()}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Re-run seed check
            </button>
          </div>
        </>
      )}
    </main>
  );
}
