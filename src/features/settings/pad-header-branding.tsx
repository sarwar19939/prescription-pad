'use client';

/**
 * PadHeaderBranding — Clinic Logo Upload, Size, Color Mode,
 * and Header Alignment (Split, Centered, Left).
 */
import { useRef, useState } from 'react';
import { AlignCenter, AlignJustify, AlignLeft, Image as ImageIcon, Sparkles, Trash2, Upload } from 'lucide-react';
import type { HeaderAlignment, LogoPosition, LogoSize, Tenant } from '@/types/schema';
import { Button } from '@/components/ui/button';

interface PadHeaderBrandingProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

export function PadHeaderBranding({ tenant, onPatch }: PadHeaderBrandingProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const logoUrl = tenant.logo_url;
  const logoSize = tenant.logo_size || 'md';
  const logoGrayscale = tenant.logo_grayscale ?? false;
  const logoPosition = tenant.logo_position || 'left';
  const headerAlign = tenant.header_alignment || 'split';

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
    <div className="space-y-3.5 pt-3 border-t border-slate-100 text-xs text-slate-800">
      {/* 1. Header Layout Alignment */}
      <div>
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide mb-1.5">
          <AlignJustify className="h-4 w-4 text-teal-600" /> ২. প্রেসক্রিপশন হেডার অ্যালাইনমেন্ট (লেআউট):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onPatch({ header_alignment: 'split' })}
            className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all ${
              headerAlign === 'split'
                ? 'border-teal-600 bg-teal-50/60 font-bold text-teal-950 shadow-2xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <AlignJustify className="h-4 w-4 text-teal-600 shrink-0" />
            <div>
              <div className="text-xs">দুই পাশে (Split)</div>
              <div className="text-[10px] text-slate-500 font-normal">বামে ডাক্তার, ডানে চেম্বার</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onPatch({ header_alignment: 'centered' })}
            className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all ${
              headerAlign === 'centered'
                ? 'border-teal-600 bg-teal-50/60 font-bold text-teal-950 shadow-2xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <AlignCenter className="h-4 w-4 text-teal-600 shrink-0" />
            <div>
              <div className="text-xs">মাঝখানে (Centered)</div>
              <div className="text-[10px] text-slate-500 font-normal">মাঝখানে লোগো ও চেম্বার</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onPatch({ header_alignment: 'left' })}
            className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all ${
              headerAlign === 'left'
                ? 'border-teal-600 bg-teal-50/60 font-bold text-teal-950 shadow-2xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <AlignLeft className="h-4 w-4 text-teal-600 shrink-0" />
            <div>
              <div className="text-xs">বামপাশে (Left)</div>
              <div className="text-[10px] text-slate-500 font-normal">কমপ্যাক্ট বাম অ্যালাইন</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Clinic Logo Upload & Color Setting */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <ImageIcon className="h-4 w-4 text-teal-600" /> ৩. ক্লিনিক / ডাক্তারের নিজস্ব লোগো ও ব্র্যান্ডিং:
        </label>

        <div className="flex flex-wrap items-center gap-4 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
          {logoUrl ? (
            <div className="relative group rounded-xl border-2 border-teal-500 bg-white p-2 flex items-center justify-center h-20 w-24">
              <img
                src={logoUrl}
                alt="Clinic Logo"
                className={`max-h-16 max-w-20 object-contain ${logoGrayscale ? 'grayscale' : ''}`}
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
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 flex flex-col items-center justify-center text-center h-20 w-24">
              <ImageIcon className="h-6 w-6 text-slate-400" />
              <span className="text-[9px] text-slate-400 mt-0.5">কোনো লোগো নেই</span>
            </div>
          )}

          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
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
              className="h-8 gap-1.5 border-teal-300 text-teal-800 hover:bg-teal-50 text-xs font-semibold w-fit"
            >
              <Upload className="h-3.5 w-3.5 text-teal-600" />
              {logoUrl ? 'লোগো ছবি পরিবর্তন করুন' : '+ লোগো ছবি আপলোড করুন'}
            </Button>
            <span className="text-[10px] text-slate-500">
              হেডারে প্রদর্শনের জন্য লোগো আপলোড করুন (সর্বোচ্চ 2MB)
            </span>

            {/* Logo Color & Size Controls */}
            {logoUrl && (
              <>
                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-200 text-xs">
                  {/* Logo Color Mode */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">লোগোর রঙ:</span>
                    <button
                      type="button"
                      onClick={() => onPatch({ logo_grayscale: false })}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        !logoGrayscale ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      🌈 কালারফুল
                    </button>
                    <button
                      type="button"
                      onClick={() => onPatch({ logo_grayscale: true })}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        logoGrayscale ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      ⬛ সাদাকালো
                    </button>
                  </div>

                  {/* Logo Size */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">সাইজ:</span>
                    <select
                      value={logoSize}
                      onChange={(e) => onPatch({ logo_size: e.target.value as LogoSize })}
                      className="h-7 rounded border border-slate-300 bg-white px-1.5 text-xs font-medium"
                    >
                      <option value="sm">ছোট (Small)</option>
                      <option value="md">মাঝারি (Medium)</option>
                      <option value="lg">বড় (Large)</option>
                      <option value="xl">অতিরিক্ত বড় (XL)</option>
                    </select>
                  </div>
                </div>

                {/* Logo Position: Left, Center, Right */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1.5">লোগোর অবস্থান (পজিশন):</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onPatch({ logo_position: 'left' })}
                      className={`py-1 px-2 rounded-lg border text-center transition-all ${
                        logoPosition === 'left'
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      ⬅️ বামপাশে (Left)
                    </button>
                    <button
                      type="button"
                      onClick={() => onPatch({ logo_position: 'center' })}
                      className={`py-1 px-2 rounded-lg border text-center transition-all ${
                        logoPosition === 'center'
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      ⏺️ মাঝখানে (Center)
                    </button>
                    <button
                      type="button"
                      onClick={() => onPatch({ logo_position: 'right' })}
                      className={`py-1 px-2 rounded-lg border text-center transition-all ${
                        logoPosition === 'right'
                          ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      ➡️ ডানপাশে (Right)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
