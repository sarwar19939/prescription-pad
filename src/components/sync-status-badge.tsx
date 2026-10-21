'use client';

/**
 * Header sync badge: browser network status (navigator.onLine) plus the
 * number of locally-pending records in Dexie awaiting cloud sync,
 * with a manual "Sync Now" trigger and background auto-sync scheduler.
 */
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CircleCheck, CloudOff, CloudUpload, Loader2, RefreshCw } from 'lucide-react';

import { db, TABLE_NAMES } from '@/db/localDb';
import { runSync, startSyncScheduler, subscribeSyncState } from '@/services/syncEngine';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function usePendingCount() {
  return useLiveQuery(
    async () => {
      const counts = await Promise.all(
        TABLE_NAMES.map(async (t) => {
          try {
            return await db[t].where('sync_status').equals('pending').count();
          } catch {
            return 0;
          }
        }),
      );
      return counts.reduce((a, b) => a + b, 0);
    },
    [],
    0,
  );
}

function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  return online;
}

export function SyncStatusBadge() {
  const online = useOnlineStatus();
  const pendingCount = usePendingCount();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Start 5-minute recurring background sync and online event listener
    const stop = startSyncScheduler();
    const unsub = subscribeSyncState((state) => {
      if (state.syncing !== undefined) setSyncing(state.syncing);
      else setSyncing(false);
    });
    return () => {
      stop();
      unsub();
    };
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await runSync({ force: true });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {!online ? (
        <Badge variant="destructive" className="gap-2 px-3 py-1.5 text-xs font-semibold">
          <CloudOff className="h-4 w-4" aria-hidden />
          Offline Mode
        </Badge>
      ) : pendingCount > 0 ? (
        <Badge
          variant="outline"
          className="gap-2 border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900"
        >
          <CloudUpload className="h-4 w-4 text-amber-600" aria-hidden />
          {pendingCount} Pending Sync
        </Badge>
      ) : (
        <Badge
          variant="default"
          className="gap-2 px-3 py-1.5 text-xs font-semibold"
        >
          <CircleCheck className="h-4 w-4 text-teal-600" aria-hidden />
          Online · Synced
        </Badge>
      )}

      {online && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleManualSync}
          disabled={syncing}
          className="h-9 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 hover:border-teal-300"
          title="Manually trigger synchronization with Supabase"
        >
          {syncing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1.5 text-teal-600" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1.5 text-slate-500" />
          )}
          Sync Now
        </Button>
      )}
    </div>
  );
}
