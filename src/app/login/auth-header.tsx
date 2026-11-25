'use client';

import { KeyRound, Stethoscope } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type AuthMode = 'signin' | 'signup' | 'forgot' | 'update-password';

interface AuthHeaderProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthHeader({ mode, onModeChange }: AuthHeaderProps) {
  return (
    <CardHeader className="text-center pb-4">
      <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
        {mode === 'forgot' || mode === 'update-password' ? (
          <KeyRound className="h-6 w-6" />
        ) : (
          <Stethoscope className="h-6 w-6" />
        )}
      </div>
      <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
        {mode === 'signin' && 'লগইন করুন (Doctor Sign In)'}
        {mode === 'signup' && 'নতুন চেম্বার রেজিস্ট্রেশন (Doctor Sign Up)'}
        {mode === 'forgot' && 'পাসওয়ার্ড রিসেট (Forgot Password)'}
        {mode === 'update-password' && 'নতুন পাসওয়ার্ড সেট করুন'}
      </CardTitle>
      <CardDescription className="text-xs text-slate-500">
        {mode === 'signin' && 'আপনার চেম্বার একাউন্টে প্রবেশ করে প্রেসক্রিপশন ও রোগী দেখুন।'}
        {mode === 'signup' && 'আপনার নিজস্ব নাম, ডিগ্রি ও চেম্বার দিয়ে স্বাধীন অ্যাকাউন্ট খুলুন।'}
        {mode === 'forgot' && 'আপনার রেজিস্টার্ড ইমেইলটি দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠিয়ে দেব।'}
        {mode === 'update-password' && 'আপনার একাউন্টের জন্য একটি নতুন পাসওয়ার্ড সেট করুন।'}
      </CardDescription>

      {(mode === 'signin' || mode === 'signup') && (
        <div className="mt-3 grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-bold border border-slate-200">
          <button
            type="button"
            onClick={() => onModeChange('signin')}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            লগইন (Sign In)
          </button>
          <button
            type="button"
            onClick={() => onModeChange('signup')}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Clinic Workspace (রেজিস্ট্রেশন)
          </button>
        </div>
      )}
    </CardHeader>
  );
}
