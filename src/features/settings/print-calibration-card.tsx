'use client';

/**
 * PrintCalibrationCard — Professional Prescription Pad Sizing & Pre-Printed Stationery Calibration.
 * Provides granular control over:
 * 1. Paper size preset (A4 Full, A5 Chamber Half-Pad, Letter, or Custom Width x Height in mm).
 * 2. Pre-printed Header Offset (Top margin mm) + Skip digital header toggle.
 * 3. Pre-printed Footer Offset (Bottom margin mm) + Skip digital footer toggle.
 * 4. Left and Right margin fine-tuning.
 * 5. Interactive live visual preview diagram of the paper layout.
 */
import { FileText, Sliders, CheckCircle2, Ruler } from 'lucide-react';
import type { PaperSizePreset, Tenant } from '@/types/schema';
import { getPaperDimensions } from '@/lib/prescriptionTheme';
import { PadSimulationDiagram } from './pad-simulation-diagram';

interface PrintCalibrationCardProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

const PAPER_PRESETS: Array<{ id: PaperSizePreset; name: string; sizeLabel: string; desc: string }> = [
  { id: 'a4', name: 'A4 ফুল পেজ', sizeLabel: '২১০ × ২৯৭ মিমি', desc: 'হাসপাতাল ও বড় প্রেসক্রিপশন' },
  { id: 'a5', name: 'A5 হাফ প্যাড', sizeLabel: '১৪৮ × ২১০ মিমি', desc: 'চেম্বার প্র্যাকটিসের জনপ্রিয় হাফ সাইজ' },
  { id: 'letter', name: 'Letter সাইজ', sizeLabel: '২১৬ × ২৭৯ মিমি', desc: 'আমেরিকান স্ট্যান্ডার্ড পেপার' },
  { id: 'custom', name: 'কাস্টম সাইজ', sizeLabel: 'দৈর্ঘ্য × প্রস্থ', desc: 'নিজের প্যাডের স্কেল অনুযায়ী মাপ দিন' },
];

export function PrintCalibrationCard({ tenant, onPatch }: PrintCalibrationCardProps) {
  const activePreset: PaperSizePreset = tenant.paper_size_preset || 'a4';
  const customWidth = tenant.custom_paper_width_mm || 210;
  const customHeight = tenant.custom_paper_height_mm || 297;
  const topOffset = tenant.print_margin_top_mm ?? 12;
  const bottomOffset = tenant.print_margin_bottom_mm ?? 15;
  const defaultHMargin = activePreset === 'a5' ? 8 : 14;
  const leftOffset = tenant.print_margin_left_mm ?? defaultHMargin;
  const rightOffset =
    tenant.print_margin_right_mm != null && tenant.print_margin_right_mm > 8
      ? tenant.print_margin_right_mm
      : tenant.print_margin_right_mm != null && tenant.print_margin_right_mm === 0
      ? 0
      : (tenant.print_margin_left_mm ?? defaultHMargin);
  const hideHeader = tenant.hide_header_for_print === true;
  const hideFooter = tenant.hide_footer_for_print === true;

  const currentPaper = getPaperDimensions(activePreset, customWidth, customHeight);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-6 text-slate-800">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Ruler className="h-5 w-5 text-teal-600" />
            প্রেসক্রিপশন পেপার সাইজ ও প্রিন্ট ক্যালিব্রেশন
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            কাগজের দৈর্ঘ্য-প্রস্থ (A4, A5, কাস্টম) এবং প্রি-প্রিন্টেড প্যাডের হেডার ও ফুটার মার্জিন নিখুঁতভাবে সমন্বয় করুন
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          প্রফেশনাল মোড
        </span>
      </div>

      {/* 1. Paper Size Preset Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <FileText className="h-4 w-4 text-teal-600" /> ১. প্রেসক্রিপশন কাগজের সাইজ (Paper Size):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PAPER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPatch({ paper_size_preset: preset.id })}
              className={`p-3 rounded-xl border text-left transition-all ${
                activePreset === preset.id
                  ? 'border-teal-600 bg-teal-50/70 font-bold text-teal-950 shadow-2xs ring-1 ring-teal-500'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-xs font-bold">{preset.name}</div>
              <div className="text-[11px] font-mono text-teal-700 font-semibold mt-0.5">{preset.sizeLabel}</div>
              <div className="text-[10px] text-slate-500 font-normal mt-1 leading-tight">{preset.desc}</div>
            </button>
          ))}
        </div>

        {/* Custom Width x Height Input (Visible when Custom is chosen) */}
        {activePreset === 'custom' && (
          <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">কাগজের প্রস্থ (Width mm):</span>
              <input
                type="number"
                min={80}
                max={400}
                value={customWidth}
                onChange={(e) => onPatch({ custom_paper_width_mm: Number(e.target.value) || 210 })}
                className="w-24 h-8 rounded-lg border border-slate-300 bg-white px-2.5 font-mono text-xs font-bold outline-none focus:border-teal-600"
              />
              <span className="text-slate-400 font-mono">মিমি</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">কাগজের দৈর্ঘ্য (Height mm):</span>
              <input
                type="number"
                min={100}
                max={500}
                value={customHeight}
                onChange={(e) => onPatch({ custom_paper_height_mm: Number(e.target.value) || 297 })}
                className="w-24 h-8 rounded-lg border border-slate-300 bg-white px-2.5 font-mono text-xs font-bold outline-none focus:border-teal-600"
              />
              <span className="text-slate-400 font-mono">মিমি</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Pre-printed Stationery Offset & Digital Header/Footer Visibility */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <Sliders className="h-4 w-4 text-teal-600" /> ২. প্রি-প্রিন্টেড প্যাড হেডার ও ফুটার মার্জিন ক্যালিব্রেশন:
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Header Pre-printed Setting */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hideHeader}
                onChange={(e) => onPatch({ hide_header_for_print: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded accent-teal-600 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  ছাপানো প্যাড (হেডার আগে থেকেই ছাপা আছে)
                </span>
                <span className="text-[11px] text-slate-500">
                  ডিজিটাল হেডার প্রিন্ট হবে না, কাগজের ছাপা হেডারের নিচ থেকে লেখা শুরু হবে
                </span>
              </div>
            </label>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="font-semibold text-slate-700">হেডারের জন্য ফাঁকা জায়গা (Top Offset):</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={150}
                  value={topOffset}
                  onChange={(e) => onPatch({ print_margin_top_mm: Number(e.target.value) || 0 })}
                  className="w-20 h-8 rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-bold outline-none focus:border-teal-600"
                />
                <span className="text-slate-500 font-mono">মিমি</span>
              </div>
            </div>
          </div>

          {/* Footer Pre-printed Setting */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hideFooter}
                onChange={(e) => onPatch({ hide_footer_for_print: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded accent-teal-600 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  ছাপানো ফুটার (নিচে ঠিকানা/হেল্পলাইন ছাপা আছে)
                </span>
                <span className="text-[11px] text-slate-500">
                  নিচের ছাপা লেখার উপরে লেখা শেষ হবে এবং ডিজিটাল স্বাক্ষর লাইন বাদ থাকবে
                </span>
              </div>
            </label>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="font-semibold text-slate-700">ফুটারের জন্য ফাঁকা জায়গা (Bottom Offset):</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={bottomOffset}
                  onChange={(e) => onPatch({ print_margin_bottom_mm: Number(e.target.value) || 0 })}
                  className="w-20 h-8 rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-bold outline-none focus:border-teal-600"
                />
                <span className="text-slate-500 font-mono">মিমি</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left & Right Margin Calibration */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">
              বাম ও ডান মার্জিন (Left & Right Margins):
            </span>
            <button
              type="button"
              onClick={() => onPatch({
                print_margin_left_mm: leftOffset,
                print_margin_right_mm: leftOffset,
              })}
              className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
              title="বাম মার্জিনের সমান করে ডান মার্জিন সেট করুন"
            >
              দুই পাশ সমান করুন ({leftOffset} মিমি)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="font-semibold text-slate-700 block">বাম মার্জিন (Left Margin):</span>
                <span className="text-[10px] text-slate-400">ক্লিপবোর্ড ও ফাইলিং স্পেস</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={leftOffset}
                  onChange={(e) => onPatch({ print_margin_left_mm: Number(e.target.value) || 0 })}
                  className="w-20 h-8 rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-bold outline-none focus:border-teal-600"
                />
                <span className="text-slate-500 font-mono">মিমি</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="font-semibold text-slate-700 block">ডান মার্জিন (Right Margin):</span>
                <span className="text-[10px] text-slate-400">প্রিন্টারের ডান কাটিং ও সেফ স্পেস</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={rightOffset}
                  onChange={(e) => onPatch({ print_margin_right_mm: Number(e.target.value) || 0 })}
                  className="w-20 h-8 rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-bold outline-none focus:border-teal-600"
                />
                <span className="text-slate-500 font-mono">মিমি</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            💡 প্রেসক্রিপশন প্রিন্ট মেশিনে দুই পাশ সুন্দর ও ব্যালান্সড দেখাতে সাধারণত ১২ থেকে ১৫ মিমি মার্জিন আদর্শ।
          </p>
        </div>
      </div>

      {/* 3. Interactive Visual Pad Simulation Diagram */}
      <PadSimulationDiagram
        currentPaperLabel={currentPaper.label}
        leftOffset={leftOffset}
        rightOffset={rightOffset}
        topOffset={topOffset}
        bottomOffset={bottomOffset}
        hideHeader={hideHeader}
        hideFooter={hideFooter}
      />
    </div>
  );
}
