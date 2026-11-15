'use client';

/**
 * PrescriptionPadSetupCard — Interactive Prescription Pad Customizer.
 * Provides complete control over:
 * 1. 7 Medical Color Themes & Print Color Mode (Full Color vs Monochrome).
 * 2. Clinic Logo Upload, Size, Full Color / Grayscale, and Alignment (Split, Centered, Left).
 * 3. Degrees Multi-line Paragraph Formatting & MS Word-style Column Width Ratios.
 * 4. Dedicated Background Watermark with Full Color / Grayscale & Opacity calibration.
 * 5. Chamber Visiting Hours & Special Footer Notes.
 */
import { Clock, Palette, Sparkles } from 'lucide-react';
import type { Tenant } from '@/types/schema';
import { PadLayoutThemePicker } from './pad-layout-theme-picker';
import { PadHeaderBranding } from './pad-header-branding';
import { PadTypographyColumns } from './pad-typography-columns';
import { PrescriptionWatermarkSection } from './prescription-watermark-section';

interface PrescriptionPadSetupCardProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

export function PrescriptionPadSetupCard({ tenant, onPatch }: PrescriptionPadSetupCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Palette className="h-5 w-5 text-teal-600" />
            প্রেসক্রিপশন প্যাড স্টাইল, কালার ও লেআউট সেটআপ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            পছন্দের কালার থিম, রঙিন লোগো, জলছাপ, কলামের মাপ ও ডিগ্রির প্যারাগ্রাফ কাস্টমাইজ করুন
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          ফুল এক্সেস সেটআপ
        </span>
      </div>

      {/* 1. Pad Layout Themes & Full Color Print Mode */}
      <PadLayoutThemePicker tenant={tenant} onPatch={onPatch} />

      {/* 2. Header Layout Alignment & Clinic Logo Branding */}
      <PadHeaderBranding tenant={tenant} onPatch={onPatch} />

      {/* 3. Degrees Paragraph & MS Word-style Column Width Controls */}
      <PadTypographyColumns tenant={tenant} onPatch={onPatch} />

      {/* 4. Dedicated Background Watermark (জলছাপ) Settings */}
      <PrescriptionWatermarkSection tenant={tenant} onPatch={onPatch} />

      {/* 5. Chamber Visiting Hours & Special Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
        <label className="grid gap-1 font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal-600" /> চেম্বারের সময়সূচী (Visiting Hours):
          </span>
          <input
            type="text"
            value={tenant.visiting_hours || ''}
            onChange={(e) => onPatch({ visiting_hours: e.target.value })}
            placeholder="যেমন: প্রতিদিন বিকাল ৫টা - রাত ৯টা (শুক্রবার বন্ধ)"
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-teal-600"
          />
        </label>

        <label className="grid gap-1 font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" /> প্রেসক্রিপশন ফুটার স্পেশাল নোট (Footer Note):
          </span>
          <input
            type="text"
            value={tenant.special_notes || ''}
            onChange={(e) => onPatch({ special_notes: e.target.value })}
            placeholder="যেমন: জরুরি প্রয়োজনে নিকটস্থ হাসপাতালে যোগাযোগ করুন। ৭ দিনের মধ্যে রিপোর্ট ফ্রি।"
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-teal-600"
          />
        </label>
      </div>
    </div>
  );
}
