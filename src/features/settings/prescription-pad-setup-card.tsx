'use client';

/**
 * PrescriptionPadSetupCard — Interactive Prescription Pad Customizer.
 * Supports:
 * 1. Multiple Pad Layout Themes (Modern Teal, Classic Clinical, Executive Navy, Minimal Elegant).
 * 2. Clinic Logo Upload from file/attachment (stored in Dexie offline).
 * 3. Prescription Watermark (জলছাপ) with separate custom image upload or logo/text modes.
 * 4. Chamber Visiting Hours & Special Footer Notes.
 */
import { useRef, useState } from 'react';
import {
  Check,
  Clock,
  FileText,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import type { Tenant } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { PrescriptionWatermarkSection } from './prescription-watermark-section';

interface PrescriptionPadSetupCardProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

export const PAD_STYLES = [
  {
    id: 'modern_teal',
    title: 'Modern Teal',
    titleBn: 'মডার্ন টিল (Prescriply)',
    accentColor: 'border-teal-600 text-teal-800 bg-teal-50',
    barColor: 'bg-teal-700',
    description: 'আধুনিক ও প্রফেশনাল প্রেসক্রিপশন লুক',
  },
  {
    id: 'classic_clinical',
    title: 'Classic Clinical',
    titleBn: 'ঐতিহ্যবাহী চেম্বার প্যাড',
    accentColor: 'border-slate-800 text-slate-900 bg-slate-50',
    barColor: 'bg-slate-900',
    description: 'সেন্টারড হেডার ও ক্লাসিক ফরমাল বর্ডার',
  },
  {
    id: 'executive_navy',
    title: 'Executive Navy',
    titleBn: 'এক্সিকিউটিভ নেভি ব্লু',
    accentColor: 'border-blue-800 text-blue-900 bg-blue-50',
    barColor: 'bg-blue-900',
    description: 'কর্পোরেট হসপিটাল ও এক্সিকিউটিভ স্টাইল',
  },
  {
    id: 'minimal_elegant',
    title: 'Minimal Elegant',
    titleBn: 'মার্জিত ক্লিন ও মিনিমাল',
    accentColor: 'border-zinc-400 text-zinc-800 bg-zinc-50',
    barColor: 'bg-zinc-600',
    description: 'কোমল বর্ডার ও প্রশান্ত স্পেশালিস্ট লুক',
  },
] as const;

export function PrescriptionPadSetupCard({ tenant, onPatch }: PrescriptionPadSetupCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const currentStyle = tenant.pad_layout_style || 'modern_teal';

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('লোগো ফাইলের সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে।');
      return;
    }

    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onPatch({ logo_url: dataUrl });
      setLogoUploading(false);
    };
    reader.onerror = () => {
      setLogoUploading(false);
      alert('ছবি আপলোডে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onPatch({ logo_url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Palette className="h-5 w-5 text-teal-600" />
            প্রেসক্রিপশন প্যাড স্টাইল ও ব্র্যান্ডিং সেটআপ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            পছন্দের প্যাড টেমপ্লেট নির্বাচন করুন, নিজস্ব লোগো ও আলাদা জলছাপ যুক্ত করুন
          </p>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          কাস্টমাইজেবল প্যাড
        </span>
      </div>

      {/* 1. Pad Layout Style Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
          <FileText className="h-3.5 w-3.5 text-teal-600" /> ১. প্রেসক্রিপশন প্যাড স্টাইল নির্বাচন করুন:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {PAD_STYLES.map((style) => {
            const isSelected = currentStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onPatch({ pad_layout_style: style.id as any })}
                className={`relative flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? `${style.accentColor} shadow-xs ring-2 ring-teal-500/30`
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className={`h-1.5 w-full rounded-full mb-2 ${style.barColor}`} />
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">{style.titleBn}</span>
                  {isSelected && <Check className="h-4 w-4 text-teal-700 shrink-0 font-bold" />}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">{style.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Clinic Logo Upload (Header) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
          <ImageIcon className="h-3.5 w-3.5 text-teal-600" /> ২. ক্লিনিক / ডাক্তারের নিজস্ব লোগো (হেডার):
        </label>

        <div className="flex flex-wrap items-center gap-4">
          {tenant.logo_url ? (
            <div className="relative group rounded-xl border-2 border-teal-500 bg-slate-50 p-2 flex items-center justify-center h-20 w-24">
              <img
                src={tenant.logo_url}
                alt="Clinic Logo"
                className="max-h-16 max-w-20 object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md"
                title="লোগো মুছে ফেলুন"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-3 flex flex-col items-center justify-center text-center h-20 w-24">
              <ImageIcon className="h-6 w-6 text-slate-400" />
              <span className="text-[9px] text-slate-400 mt-0.5">কোনো লোগো নেই</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleLogoFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={logoUploading}
              className="h-8 gap-1.5 border-teal-300 text-teal-800 hover:bg-teal-50 text-xs font-semibold"
            >
              <Upload className="h-3.5 w-3.5 text-teal-600" />
              {tenant.logo_url ? 'লোগো পরিবর্তন করুন' : '+ লোগো ছবি আপলোড করুন'}
            </Button>
            <span className="text-[10px] text-slate-400">
              হেডারে প্রদর্শনের জন্য লোগো আপলোড করুন (সর্বোচ্চ 2MB)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Dedicated Watermark (জলছাপ) Settings Section */}
      <PrescriptionWatermarkSection tenant={tenant} onPatch={onPatch} />

      {/* 4. Chamber Visiting Hours & Special Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
        <label className="grid gap-1 font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal-600" /> চেম্বারের সময়সূচী (Visiting Hours):
          </span>
          <input
            type="text"
            value={tenant.visiting_hours || ''}
            onChange={(e) => onPatch({ visiting_hours: e.target.value })}
            placeholder="যেমন: প্রতিদিন বিকাল ৫টা - রাত ৯টা (শুক্রবার বন্ধ)"
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-teal-600"
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
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-teal-600"
          />
        </label>
      </div>
    </div>
  );
}
