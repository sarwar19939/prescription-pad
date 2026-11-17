'use client';

/**
 * PadTypographyColumns — MS Word-style Column Width Customization,
 * Typography Font Scaling, and Degrees Multi-line Paragraph Formatting.
 */
import { Columns3, GraduationCap, TextQuote, Type } from 'lucide-react';
import type { ColumnRatio, NameFontSize, PadFontSize, Tenant } from '@/types/schema';
import { formatDegreesList, getPadTheme } from '@/lib/prescriptionTheme';

interface PadTypographyColumnsProps {
  tenant: Tenant;
  onPatch: (fields: Partial<Tenant>) => void;
}

const COLUMN_RATIOS: Array<{ id: ColumnRatio; label: string; desc: string }> = [
  { id: '25_75', label: '২৫% / ৭৫%', desc: 'বাম কলাম সরু, ডান কলাম চওড়া' },
  { id: '30_70', label: '৩০% / ৭০%', desc: 'স্ট্যান্ডার্ড চেম্বার রেশিও' },
  { id: '35_65', label: '৩৫% / ৬৫%', desc: 'লক্ষণ ও পরীক্ষার জন্য বাড়তি জায়গা' },
  { id: '40_60', label: '৪০% / ৬০%', desc: 'উভয় কলাম প্রায় সম-অনুপাতে' },
];

const PAD_FONT_SIZES: Array<{ id: PadFontSize; label: string; pxLabel: string; desc: string }> = [
  { id: 'compact', label: 'ছোট (Compact)', pxLabel: '১০px', desc: 'ছোট কাগজ বা বেশি ওষুধের জন্য' },
  { id: 'standard', label: 'সাধারণ (Standard)', pxLabel: '১২px', desc: 'ঝকঝকে ও স্পষ্ট (সুপারিশকৃত)' },
  { id: 'large', label: 'বড় (Large)', pxLabel: '১৩.৫px', desc: 'রোগীর সহজে পড়ার উপযোগী' },
  { id: 'xl', label: 'অতিরিক্ত বড় (XL)', pxLabel: '১৫px', desc: 'সর্বোচ্চ স্পষ্ট ও বড় ফন্ট' },
];

export function PadTypographyColumns({ tenant, onPatch }: PadTypographyColumnsProps) {
  const currentRatio = tenant.column_ratio || '30_70';
  const doctorNameSize = tenant.doctor_name_size || 'normal';
  const clinicNameSize = tenant.clinic_name_size || 'normal';
  const theme = getPadTheme(tenant.pad_layout_style);
  const degrees = tenant.degrees || '';
  const degreeLines = formatDegreesList(degrees);

  return (
    <div className="space-y-4 pt-3 border-t border-slate-100 text-xs text-slate-800">
      {/* 1. Degrees & Qualifications Paragraph Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <GraduationCap className="h-4 w-4 text-teal-600" /> ৪. ডিগ্রির টাইটেলস ও প্যারাগ্রাফ ফরম্যাটিং:
          </label>
          <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            অটো-র‍্যাপ প্যারাগ্রাফ
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          একাধিক ডিগ্রি থাকলে প্রতিটি ডিগ্রি নতুন লাইনে (Enter চেপে) লিখুন। প্রেসক্রিপশনে এটি ডিগ্রির নামের সাথে প্যারাগ্রাফ আকারে সুন্দরভাবে সাজানো থাকবে।
        </p>

        <textarea
          rows={3}
          value={degrees}
          onChange={(e) => onPatch({ degrees: e.target.value })}
          placeholder={`যেমন:\nMBBS (DMC), BCS (Health)\nFCPS (Medicine), MD (Cardiology)\nMACP (USA), Fellow WHO`}
          className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-500/30 leading-relaxed font-mono"
        />

        {/* Live Degrees Paragraph Preview */}
        {degreeLines.length > 0 && (
          <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/30 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              লাইভ প্রিভিউ (প্রেসক্রিপশন হেডারে যেভাবে আসবে):
            </div>
            <div className="text-sm font-black text-slate-900">
              {tenant.doctor_name || 'ডাঃ গোলাম সারোয়ার'}
            </div>
            <div className="space-y-0.5">
              {degreeLines.map((line, idx) => (
                <p key={idx} className={`text-xs font-semibold ${theme.accentColorClass} leading-snug whitespace-pre-wrap break-words`}>
                  {line}
                </p>
              ))}
            </div>
            <div className="text-xs font-medium text-slate-600">
              {tenant.specialty || 'General Physician'}
            </div>
          </div>
        )}
      </div>

      {/* 2. Column Ratio Customization (MS Word Style) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <Columns3 className="h-4 w-4 text-teal-600" /> ৫. প্রেসক্রিপশন কলাম রেশিও (কলাম বাই কলাম প্রস্থ নিয়ন্ত্রণ):
        </label>
        <p className="text-[11px] text-slate-500">
          এমএস ওয়ার্ডের মতো বাম কলাম (লক্ষণ ও পরীক্ষা) এবং ডান কলাম (Rx ওষুধ ও পরামর্শ)-এর প্রস্থ নির্বাচন করুন:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {COLUMN_RATIOS.map((r) => {
            const isSelected = currentRatio === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onPatch({ column_ratio: r.id })}
                className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/60 font-bold text-teal-950 shadow-2xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{r.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography Scaling (Doctor & Clinic Name Font Sizes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Type className="h-3.5 w-3.5 text-teal-600" /> ডাক্তারের নামের ফন্ট সাইজ:
          </label>
          <select
            value={doctorNameSize}
            onChange={(e) => onPatch({ doctor_name_size: e.target.value as NameFontSize })}
            className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium outline-none focus:border-teal-600"
          >
            <option value="normal">সাধারণ (Standard - 24px)</option>
            <option value="large">বড় (Large - 30px)</option>
            <option value="xl">অতিরিক্ত বড় (Extra Large - 36px)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Type className="h-3.5 w-3.5 text-teal-600" /> চেম্বার / ক্লিনিক নামের ফন্ট সাইজ:
          </label>
          <select
            value={clinicNameSize}
            onChange={(e) => onPatch({ clinic_name_size: e.target.value as NameFontSize })}
            className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium outline-none focus:border-teal-600"
          >
            <option value="normal">সাধারণ (Standard - 18px)</option>
            <option value="large">বড় (Large - 22px)</option>
            <option value="xl">অতিরিক্ত বড় (Extra Large - 26px)</option>
          </select>
        </div>
      </div>

      {/* 4. Prescription Body Writing Font Size (প্রেসক্রিপশনে ওষুধ ও লেখার মূল ফন্ট সাইজ ছোট/বড় করার অপশন) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <TextQuote className="h-4 w-4 text-teal-600" /> ৬. প্রেসক্রিপশনে লেখার ফন্ট সাইজ (ওষুধ, লক্ষণ ও পরামর্শের মাপ):
          </label>
          <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {PAD_FONT_SIZES.find((s) => s.id === (tenant.pad_font_size || 'standard'))?.pxLabel}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          প্রেসক্রিপশনের মুদ্রিত টেক্সট, ওষুধের নাম, ডোজের বিবরণ ও পরামর্শের সাইজ ছোট বা বড় করুন:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {PAD_FONT_SIZES.map((fs) => {
            const isSelected = (tenant.pad_font_size || 'standard') === fs.id;
            return (
              <button
                key={fs.id}
                type="button"
                onClick={() => onPatch({ pad_font_size: fs.id })}
                className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/60 font-bold text-teal-950 shadow-2xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{fs.label}</span>
                  <span className="text-[10px] font-mono font-bold text-teal-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {fs.pxLabel}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 leading-snug">{fs.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
