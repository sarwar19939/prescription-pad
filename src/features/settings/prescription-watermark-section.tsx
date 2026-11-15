'use client';

/**
 * PrescriptionWatermarkSection — Dedicated Prescription Watermark (জলছাপ) Settings.
 * Supports:
 * - Full color vs grayscale watermark rendering.
 * - Custom watermark graphic upload (different from logo), clinic logo, or custom text.
 * - Precision opacity control (4% to 20%).
 * - Custom text watermark color selection.
 */
import { useRef, useState } from 'react';
import { Droplets, Image as ImageIcon, Sparkles, Trash2, Upload } from 'lucide-react';
import type { Tenant, WatermarkPlacement } from '@/types/schema';
import { Button } from '@/components/ui/button';

interface PrescriptionWatermarkSectionProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

const WATERMARK_COLORS = [
  { label: 'থিম কালার', value: '' },
  { label: 'টিল (Teal)', value: '#0f766e' },
  { label: 'নেভি (Navy)', value: '#1e3a8a' },
  { label: 'এমারেল্ড (Emerald)', value: '#047857' },
  { label: 'পার্পল (Purple)', value: '#4338ca' },
  { label: 'রোজ মেরুন (Maroon)', value: '#9f1239' },
  { label: 'গ্রে (Slate)', value: '#475569' },
];

const WATERMARK_TYPES = [
  { id: 'custom_image', label: 'আলাদা জলছাপ ছবি আপলোড' },
  { id: 'logo', label: 'ক্লিনিক লোগোই জলছাপ হবে' },
  { id: 'text', label: 'ক্লিনিক নাম / টেক্সট' },
] as const;

const WATERMARK_PLACEMENTS: Array<{ id: WatermarkPlacement; label: string; desc: string }> = [
  { id: 'center', label: 'মাঝখানে (Center)', desc: 'প্রেসক্রিপশন বডির কেন্দ্রস্থলে' },
  { id: 'full_page', label: 'ফুল প্রেসক্রিপশন', desc: 'সম্পূর্ণ পাতা জুড়ে বিস্তৃত' },
  { id: 'rx_side', label: 'শুধুমাত্র ওষুধের সাইডে', desc: 'ডানপাশের ℞ কলামে' },
  { id: 'clinical_side', label: 'শুধুমাত্র ক্লিনিক্যাল সাইডে', desc: 'বামপাশের C/C ও O/E কলামে' },
];

export function PrescriptionWatermarkSection({ tenant, onPatch }: PrescriptionWatermarkSectionProps) {
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const watermarkEnabled = tenant.watermark_enabled ?? false;
  const watermarkType = tenant.watermark_type || 'custom_image';
  const watermarkPlacement = tenant.watermark_placement || 'center';
  const watermarkOpacity = tenant.watermark_opacity ?? 0.07;
  const watermarkImageUrl = tenant.watermark_image_url;
  const watermarkColorMode = tenant.watermark_color_mode || 'color';

  const handleWatermarkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('জলছাপ ছবির সাইজ সর্বোচ্চ ৩ মেগাবাইট (3MB) হতে পারবে।');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      onPatch({
        watermark_enabled: true,
        watermark_type: 'custom_image',
        watermark_image_url: event.target?.result as string,
      });
      setUploading(false);
    };
    reader.onerror = () => {
      setUploading(false);
      alert('ছবি আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveWatermarkImage = () => {
    onPatch({ watermark_image_url: '' });
    if (watermarkInputRef.current) watermarkInputRef.current.value = '';
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <Droplets className="h-4 w-4 text-indigo-600" /> প্রেসক্রিপশনে ব্যাকগ্রাউন্ড জলছাপ (Watermark):
          </label>
          <span className="text-[11px] text-slate-500">
            রঙিন বা মনোক্রোম জলছাপ দিয়ে প্রেসক্রিপশনে নিজস্ব ব্র্যান্ডিং তৈরি করুন
          </span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-200">
          <input
            type="checkbox"
            checked={watermarkEnabled}
            onChange={(e) => onPatch({ watermark_enabled: e.target.checked })}
            className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
          />
          <span>জলছাপ দেখান</span>
        </label>
      </div>

      {watermarkEnabled && (
        <div className="space-y-3 bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100 text-xs">
          {/* 1. Watermark Color Mode */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-lg border border-indigo-200/70">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> জলছাপ কালার মোড:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPatch({ watermark_color_mode: 'color' })}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  watermarkColorMode === 'color' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                🌈 রঙিন জলছাপ (Full Color)
              </button>
              <button
                type="button"
                onClick={() => onPatch({ watermark_color_mode: 'grayscale' })}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  watermarkColorMode === 'grayscale' ? 'bg-slate-800 text-white shadow-2xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                ⬛ সাদাকালো (Grayscale)
              </button>
            </div>
          </div>

          {/* 2. Watermark Placement (অবস্থান) */}
          <div>
            <span className="font-bold text-slate-700 block mb-1.5">জলছাপের অবস্থান (প্লেসমেন্ট):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WATERMARK_PLACEMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPatch({ watermark_placement: p.id })}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    watermarkPlacement === p.id
                      ? 'bg-white border-indigo-500 font-bold text-indigo-950 shadow-2xs ring-1 ring-indigo-400'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="text-xs">{p.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Watermark Type Selector */}
          <div>
            <span className="font-bold text-slate-700 block mb-1.5">জলছাপের উৎস বেছে নিন:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {WATERMARK_TYPES.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                    watermarkType === t.id
                      ? 'bg-white border-indigo-500 font-bold text-indigo-950 shadow-2xs ring-1 ring-indigo-400'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="watermark_type"
                    checked={watermarkType === t.id}
                    onChange={() => onPatch({ watermark_type: t.id })}
                    className="accent-indigo-600"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Option A: Dedicated Custom Watermark Image Upload */}
          {watermarkType === 'custom_image' && (
            <div className="flex flex-wrap items-center gap-3.5 bg-white p-3 rounded-xl border border-indigo-200/80">
              {watermarkImageUrl ? (
                <div className="relative group rounded-xl border-2 border-indigo-400 bg-slate-50 p-1 flex items-center justify-center h-20 w-24">
                  <img
                    src={watermarkImageUrl}
                    alt="Watermark Graphic"
                    className={`max-h-16 max-w-20 object-contain ${watermarkColorMode === 'grayscale' ? 'grayscale' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveWatermarkImage}
                    className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md"
                    title="জলছাপের ছবি মুছে ফেলুন"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 p-2 flex flex-col items-center justify-center text-center h-20 w-24">
                  <ImageIcon className="h-6 w-6 text-indigo-400" />
                  <span className="text-[9px] text-indigo-500 font-semibold mt-0.5">ছবি নেই</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5 flex-1">
                <input
                  type="file"
                  ref={watermarkInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleWatermarkFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => watermarkInputRef.current?.click()}
                  disabled={uploading}
                  className="h-8 gap-1.5 border-indigo-300 text-indigo-900 hover:bg-indigo-50 text-xs font-bold w-fit"
                >
                  <Upload className="h-3.5 w-3.5 text-indigo-600" />
                  {watermarkImageUrl ? 'জলছাপের ছবি পরিবর্তন করুন' : '+ জলছাপের জন্য আলাদা ছবি আপলোড করুন'}
                </Button>
                <span className="text-[10px] text-slate-500">
                  (যেমন: হাসপাতালের সিল, মনোগ্রাম বা জলছাপ ডিজাইন — সর্বোচ্চ 3MB)
                </span>
              </div>
            </div>
          )}

          {/* Option B: Fallback notice if Logo is selected */}
          {watermarkType === 'logo' && !tenant.logo_url && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
              ⚠️ আপনি এখনো কোনো ক্লিনিক লোগো আপলোড করেননি। উপরের &quot;৩. ক্লিনিক লোগো&quot; অপশনে গিয়ে ছবি আপলোড করুন।
            </div>
          )}

          {/* Option C: Custom Watermark Text */}
          {watermarkType === 'text' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-2.5 rounded-lg border border-indigo-200/80">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">জলছাপের টেক্সট:</span>
                <input
                  type="text"
                  value={tenant.watermark_text || ''}
                  onChange={(e) => onPatch({ watermark_text: e.target.value })}
                  placeholder={tenant.clinic_name || 'বসিরবানিয়া চেম্বার'}
                  className="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-xs outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-700 block mb-1">টেক্সট জলছাপের রঙ:</span>
                <select
                  value={tenant.watermark_color || ''}
                  onChange={(e) => onPatch({ watermark_color: e.target.value })}
                  className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs font-medium outline-none"
                >
                  {WATERMARK_COLORS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Opacity Control */}
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-indigo-100">
            <span className="font-semibold text-slate-700">জলছাপের দৃশ্যমানতা (Opacity):</span>
            <select
              value={watermarkOpacity}
              onChange={(e) => onPatch({ watermark_opacity: parseFloat(e.target.value) })}
              className="h-8 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-semibold outline-none"
            >
              <option value={0.04}>৪% (খুব হালকা - সূক্ষ্মতম)</option>
              <option value={0.07}>৭% (আদর্শ প্রেসক্রিপশন জলছাপ)</option>
              <option value={0.10}>১০% (স্পষ্ট দৃশ্যমান)</option>
              <option value={0.15}>১৫% (গাঢ় জলছাপ)</option>
              <option value={0.20}>২০% (অতিরিক্ত স্পষ্ট)</option>
            </select>
            <span className="text-[10px] text-slate-400">
              * ৭% রাখা সুপারিশকৃত, যাতে প্রেসক্রিপশনের ওষুধ পড়তে কোনো অসুবিধা না হয়।
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
