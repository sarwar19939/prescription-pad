'use client';

/**
 * PrescriptionWatermarkSection — Dedicated Prescription Watermark (জলছাপ) Settings.
 * Allows uploading a distinct watermark graphic (different from the header logo),
 * using the clinic logo, or using custom watermark text, with opacity control.
 */
import { useRef, useState } from 'react';
import { Droplets, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import type { Tenant } from '@/types/schema';
import { Button } from '@/components/ui/button';

interface PrescriptionWatermarkSectionProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

export function PrescriptionWatermarkSection({
  tenant,
  onPatch,
}: PrescriptionWatermarkSectionProps) {
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const watermarkEnabled = tenant.watermark_enabled ?? false;
  const watermarkType = tenant.watermark_type || 'custom_image';
  const watermarkOpacity = tenant.watermark_opacity ?? 0.07;
  const watermarkImageUrl = tenant.watermark_image_url;

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
      const dataUrl = event.target?.result as string;
      onPatch({
        watermark_enabled: true,
        watermark_type: 'custom_image',
        watermark_image_url: dataUrl,
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
            <Droplets className="h-4 w-4 text-indigo-600" /> প্রেসক্রিপশনে জলছাপ (Watermark) সেটআপ:
          </label>
          <span className="text-[11px] text-slate-500">
            লোগো ছাড়াও যেকোনো আলাদা মনোগ্রাম, সিল বা ছবি জলছাপ হিসেবে ব্যবহার করতে পারেন
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
          {/* Watermark Type Selector */}
          <div>
            <span className="font-bold text-slate-700 block mb-1.5">জলছাপের উৎস বেছে নিন:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                  watermarkType === 'custom_image'
                    ? 'bg-white border-indigo-500 font-bold text-indigo-950 shadow-2xs ring-1 ring-indigo-400'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="watermark_type"
                  checked={watermarkType === 'custom_image'}
                  onChange={() => onPatch({ watermark_type: 'custom_image' })}
                  className="accent-indigo-600"
                />
                <span>আলাদা জলছাপ ছবি আপলোড</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                  watermarkType === 'logo'
                    ? 'bg-white border-indigo-500 font-bold text-indigo-950 shadow-2xs ring-1 ring-indigo-400'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="watermark_type"
                  checked={watermarkType === 'logo'}
                  onChange={() => onPatch({ watermark_type: 'logo' })}
                  className="accent-indigo-600"
                />
                <span>ক্লিনিক লোগোই জলছাপ হবে</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                  watermarkType === 'text'
                    ? 'bg-white border-indigo-500 font-bold text-indigo-950 shadow-2xs ring-1 ring-indigo-400'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="watermark_type"
                  checked={watermarkType === 'text'}
                  onChange={() => onPatch({ watermark_type: 'text' })}
                  className="accent-indigo-600"
                />
                <span>ক্লিনিক নাম / টেক্সট</span>
              </label>
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
                    className="max-h-16 max-w-20 object-contain"
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
              ⚠️ আপনি এখনো কোনো ক্লিনিক লোগো আপলোড করেননি। উপরের &quot;২. ক্লিনিক লোগো&quot; অপশনে গিয়ে ছবি আপলোড করুন।
            </div>
          )}

          {/* Option C: Custom Watermark Text */}
          {watermarkType === 'text' && (
            <div>
              <span className="font-semibold text-slate-700 block mb-1">জলছাপের টেক্সট:</span>
              <input
                type="text"
                value={tenant.watermark_text || ''}
                onChange={(e) => onPatch({ watermark_text: e.target.value })}
                placeholder={tenant.clinic_name || 'বসিরবানিয়া চেম্বার'}
                className="h-8 w-full max-w-sm rounded-md border border-slate-300 bg-white px-2.5 text-xs outline-none focus:border-indigo-600"
              />
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
              <option value={0.11}>১১% (স্পষ্ট দৃশ্যমান)</option>
              <option value={0.16}>১৬% (গাঢ় জলছাপ)</option>
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
