'use client';

/**
 * Local Database Backup & Restore Card:
 * Exports all local Dexie tables to a timestamped JSON file (clinic-backup-YYYY-MM-DD.json)
 * and allows 1-click restore without cloud dependencies.
 */
import { useRef, useState } from 'react';
import { CheckCircle2, Download, HardDriveDownload, HardDriveUpload, Loader2, ShieldCheck, Upload } from 'lucide-react';

import { exportDatabaseBackup, restoreDatabaseFromJSON } from '@/services/backupService';
import { Button } from '@/components/ui/button';

export function BackupRestoreCard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    setError(null);
    try {
      const filename = await exportDatabaseBackup();
      setMessage(`Backup exported successfully: ${filename}`);
    } catch (err) {
      setError(`Export failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    setMessage(null);
    setError(null);

    try {
      const text = await file.text();
      const res = await restoreDatabaseFromJSON(text);

      if (res.success) {
        const details = Object.entries(res.restoredCounts)
          .map(([k, v]) => `${v} ${k}`)
          .join(', ');
        setMessage(`Database restored successfully (${details}).`);
      } else {
        setError(res.error || 'Restore failed.');
      }
    } catch (err) {
      setError(`File read error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600 flex items-center gap-1.5">
            <HardDriveDownload className="h-4 w-4 text-emerald-700" /> Local Database Backup &amp; Disaster Recovery
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            100% offline data portability. Export all clinic records to a JSON file or restore from a previous backup.
          </p>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Offline Guaranteed
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting || restoring}
          className="border-neutral-300 text-xs text-neutral-800 hover:bg-neutral-100"
        >
          {exporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
          ) : (
            <Download className="h-3.5 w-3.5 mr-1.5 text-emerald-700" />
          )}
          Export JSON Database Backup
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={exporting || restoring}
          className="border-neutral-300 text-xs text-neutral-800 hover:bg-neutral-100"
        >
          {restoring ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
          ) : (
            <Upload className="h-3.5 w-3.5 mr-1.5 text-emerald-700" />
          )}
          Restore from Backup File
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {message && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
