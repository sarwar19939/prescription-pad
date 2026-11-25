'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuotaAlertProps {
  onResetDatabase: () => Promise<void>;
}

export function QuotaAlert({ onResetDatabase }: QuotaAlertProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800 text-xs space-y-2">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
        <div className="space-y-1">
          <strong className="font-bold text-rose-900 block">
            কম্পিউটারের C: ড্রাইভের জায়গা শেষ (Disk Full) বা ব্রাউজার স্টোরেজ এরর
          </strong>
          <p className="text-[11px] leading-relaxed text-rose-800">
            আপনার ব্রাউজার বা কম্পিউটারের সি (C:) ড্রাইভের স্টোরেজ ফুল হয়ে গেছে, যার কারণে ব্রাউজার লোকাল ডাটাবেজ খুলতে পারছে না।
          </p>
        </div>
      </div>

      <div className="bg-white/90 rounded-lg p-2.5 border border-rose-200 text-[11px] text-slate-700 space-y-1.5 mt-1">
        <div className="font-bold text-rose-950">সমাধানের উপায়:</div>
        <ol className="list-decimal pl-4 space-y-1 text-slate-600">
          <li>কম্পিউটারের <strong>C: ড্রাইভ</strong> থেকে অপ্রয়োজনীয় ফাইল/ভিডিও মুছে অন্তত ১-২ জিবি খালি করুন।</li>
          <li>ব্রাউজারটি সম্পূর্ণ বন্ধ করে (বা কম্পিউটার রিস্টার্ট দিয়ে) পুনরায় চেষ্টা করুন।</li>
          <li>অথবা নিচের বাটনে ক্লিক করে ব্রাউজারের আটকে যাওয়া ডাটাবেজ ক্যাশ রিসেট করে নিন।</li>
        </ol>
        <div className="pt-1.5">
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="h-7 text-xs font-bold"
            onClick={onResetDatabase}
          >
            ক্যাশ রিসেট ও রিলোড করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
