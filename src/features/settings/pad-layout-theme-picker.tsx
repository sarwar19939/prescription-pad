'use client';

/**
 * PadLayoutThemePicker — Selection of 7 Rich Medical Color Themes
 * and Print Color Mode (Full Color vs Monochrome).
 */
import { Check, Palette, Printer } from 'lucide-react';
import type { PadLayoutStyle, Tenant } from '@/types/schema';
import { PAD_THEMES } from '@/lib/prescriptionTheme';

interface PadLayoutThemePickerProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

export function PadLayoutThemePicker({ tenant, onPatch }: PadLayoutThemePickerProps) {
  const currentStyle = tenant.pad_layout_style || 'modern_teal';
  const printColorMode = tenant.print_color_mode || 'full_color';

  return (
    <div className="space-y-3.5">
      {/* 1. Theme Selection */}
      <div>
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide mb-2">
          <Palette className="h-4 w-4 text-teal-600" /> ১. প্রেসক্রিপশন কালার থিম ও ডিজাইন নির্বাচন করুন:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {Object.values(PAD_THEMES).map((theme) => {
            const isSelected = currentStyle === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onPatch({ pad_layout_style: theme.id as PadLayoutStyle })}
                className={`relative flex flex-col items-start p-2.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-2 ring-teal-500/30 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className={`h-2 w-full rounded-full mb-1.5 ${theme.cardPreviewBg}`} />
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-900 leading-tight">{theme.nameBn}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-teal-700 shrink-0 font-bold" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Print Color Mode Toggle (Full Color vs Monochrome) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-teal-200/80 bg-teal-50/40 text-xs">
        <div>
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Printer className="h-4 w-4 text-teal-700" /> প্রিন্ট কালার মোড (Print Color Mode):
          </span>
          <span className="text-[11px] text-slate-500">
            রঙিন প্রিন্টারের জন্য কালার প্রিন্ট অথবা সাধারণ সাদাকালো প্রিন্ট বেছে নিন
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPatch({ print_color_mode: 'full_color' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              printColorMode === 'full_color'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            🌈 কালার প্রিন্ট (Full Color)
          </button>
          <button
            type="button"
            onClick={() => onPatch({ print_color_mode: 'monochrome' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              printColorMode === 'monochrome'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            ⬛ সাদাকালো প্রিন্ট (B&amp;W)
          </button>
        </div>
      </div>
    </div>
  );
}
