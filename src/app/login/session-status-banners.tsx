'use client';

import { CloudOff, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionStatusBannersProps {
  isOnline: boolean;
  cachedUser: string | null;
  mode: string;
  onEnter: () => void;
}

export function SessionStatusBanners({
  isOnline,
  cachedUser,
  mode,
  onEnter,
}: SessionStatusBannersProps) {
  return (
    <>
      {!isOnline && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-800">
          <CloudOff className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="font-semibold">ইন্টারনেট অফলাইন:</strong>
            <p className="mt-0.5 text-[11px]">
              অফলাইনেও সম্পূর্ণ সফটওয়্যার কাজ করবে। পুনরায় ইন্টারনেট কানেক্ট হলে ক্লাউডে সিঙ্ক হয়ে যাবে।
            </p>
          </div>
        </div>
      )}

      {cachedUser && (mode === 'signin' || mode === 'signup') && (
        <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/50 p-2.5 text-teal-900">
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-teal-600 shrink-0" />
            <span className="text-xs">
              চলমান একাউন্ট: <strong>{cachedUser}</strong>
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEnter}
            className="h-7 text-xs border-teal-300 text-teal-900 hover:bg-teal-100 font-bold"
          >
            প্রবেশ করুন →
          </Button>
        </div>
      )}
    </>
  );
}
