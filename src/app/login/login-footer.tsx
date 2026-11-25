'use client';

import { ArrowLeft, Loader2, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import type { AuthMode } from './auth-header';

interface LoginFooterProps {
  mode: AuthMode;
  loading: boolean;
  onModeChange: (mode: AuthMode) => void;
  onQuickDrSarwar: () => void;
}

export function LoginFooter({
  mode,
  loading,
  onModeChange,
  onQuickDrSarwar,
}: LoginFooterProps) {
  return (
    <CardFooter className="flex flex-col gap-2.5 pt-2 pb-5">
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
        ) : mode === 'signin' ? (
          'লগইন করুন (Sign In)'
        ) : mode === 'signup' ? (
          'রেজিস্ট্রেশন করে চেম্বার শুরু করুন (Create Account)'
        ) : mode === 'forgot' ? (
          'পাসওয়ার্ড রিসেট লিংক পাঠান (Send Reset Link)'
        ) : (
          'পাসওয়ার্ড আপডেট করুন (Update Password)'
        )}
      </Button>

      {mode === 'forgot' || mode === 'update-password' ? (
        <button
          type="button"
          onClick={() => onModeChange('signin')}
          className="text-xs text-slate-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          লগইনে ফিরে যান (Back to Sign In)
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
          className="text-xs text-slate-500 hover:text-teal-700 font-medium"
        >
          {mode === 'signin'
            ? 'নতুন ডাক্তার বন্ধু? এখানে ক্লিক করে নতুন চেম্বার খুলুন'
            : 'অলরেডি অ্যাকাউন্ট আছে? এখানে ক্লিক করে লগইন করুন'}
        </button>
      )}

      <div className="w-full pt-3 border-t border-slate-100 flex flex-col items-center">
        <button
          type="button"
          onClick={onQuickDrSarwar}
          className="text-[11px] font-semibold text-slate-600 hover:text-teal-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
          ডাঃ গোলাম সারোয়ার চেম্বারে সরাসরি প্রবেশ (Quick Access)
        </button>
      </div>
    </CardFooter>
  );
}
