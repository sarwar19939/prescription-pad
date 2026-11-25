'use client';

import { ArrowRight, Loader2, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailUnconfirmedAlertProps {
  resending: boolean;
  onResend: () => void;
  onInstantLogin: () => void;
}

export function EmailUnconfirmedAlert({
  resending,
  onResend,
  onInstantLogin,
}: EmailUnconfirmedAlertProps) {
  return (
    <div className="bg-white/95 rounded-xl p-3 border border-rose-200 text-xs text-slate-700 space-y-2.5 mt-1 shadow-xs">
      <div className="font-bold text-rose-950 flex items-center justify-between">
        <span>ইমেইল কনফার্মেশন প্রয়োজন:</span>
      </div>
      <p className="text-[11px] text-slate-600 leading-relaxed">
        আপনার জিমেইল ইনবক্স বা <strong>Spam (স্প্যাম)</strong> ফোল্ডারে পাঠানো Supabase লিংকে ক্লিক করে একাউন্ট ভেরিফাই করতে হবে।
      </p>

      <div className="flex flex-col gap-1.5 pt-1">
        {/* Instant 1-Click Access Button */}
        <Button
          type="button"
          size="sm"
          onClick={onInstantLogin}
          className="h-8 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white w-full flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-200" />
          ইমেইল কনফার্মেশন ছাড়াই সরাসরি প্রবেশ করুন
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>

        {/* Resend Confirmation Email */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={resending}
          onClick={onResend}
          className="h-7 text-[11px] font-semibold border-rose-300 text-rose-800 hover:bg-rose-50 w-full flex items-center justify-center gap-1.5"
        >
          {resending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
          ইনবক্সে মেইল পাননি? পুনরায় ইমেইল পাঠান (Resend)
        </Button>
      </div>
    </div>
  );
}
