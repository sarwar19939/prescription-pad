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
    <div className="flex items-center gap-2">
      {!online ? (
        <Badge variant="destructive" className="gap-1.5 py-1 text-xs">
          <CloudOff className="h-3.5 w-3.5" aria-hidden />
          Offline Mode
        </Badge>
      ) : pendingCount > 0 ? (
        <Badge
          variant="outline"
          className="gap-1.5 border-amber-300 bg-amber-100 py-1 text-xs text-amber-800"
        >
          <CloudUpload className="h-3.5 w-3.5" aria-hidden />
          {pendingCount} pending sync
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-300 bg-emerald-100 py-1 text-xs text-emerald-800"
        >
          <CircleCheck className="h-3.5 w-3.5" aria-hidden />
          Online · all synced
        </Badge>
      )}

      {online && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleManualSync}
          disabled={syncing}
          className="h-7 px-2 text-xs text-neutral-600 hover:text-emerald-700 hover:bg-neutral-100"
          title="Manually trigger synchronization with Supabase"
        >
          {syncing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-emerald-600" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
          )}
          Sync Now
        </Button>
      )}
    </div>
  );
}
