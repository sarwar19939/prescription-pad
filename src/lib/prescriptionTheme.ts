import type {
  ColumnRatio,
  HeaderAlignment,
  LogoSize,
  NameFontSize,
  PadFontSize,
  PadLayoutStyle,
  PaperSizePreset,
  Tenant,
} from '@/types/schema';

export interface PadThemeConfig {
  id: PadLayoutStyle;
  name: string;
  nameBn: string;
  hex: string;
  borderClass: string;
  titleColorClass: string;
  accentColorClass: string;
  badgeClass: string;
  patientBarClass: string;
  rxColorClass: string;
  dividerClass: string;
  cardPreviewBg: string;
}

export const PAD_THEMES: Record<PadLayoutStyle, PadThemeConfig> = {
  modern_teal: {
    id: 'modern_teal',
    name: 'Modern Teal',
    nameBn: 'মডার্ন টিল (Modern Teal)',
    hex: '#0f766e',
    borderClass: 'border-teal-700',
    titleColorClass: 'text-teal-900',
    accentColorClass: 'text-teal-700',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    patientBarClass: 'border-teal-700 bg-teal-50/70',
    rxColorClass: 'text-teal-800',
    dividerClass: 'border-teal-300',
    cardPreviewBg: 'bg-teal-600',
  },
  executive_navy: {
    id: 'executive_navy',
    name: 'Executive Navy',
    nameBn: 'এক্সিকিউটিভ নেভি (Executive Navy)',
    hex: '#1e3a8a',
    borderClass: 'border-blue-900',
    titleColorClass: 'text-blue-950',
    accentColorClass: 'text-blue-800',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-200',
    patientBarClass: 'border-blue-900 bg-blue-50/70',
    rxColorClass: 'text-blue-900',
    dividerClass: 'border-blue-300',
    cardPreviewBg: 'bg-blue-900',
  },
  emerald_health: {
    id: 'emerald_health',
    name: 'Emerald Clinical',
    nameBn: 'এমারেল্ড গ্রিন (Emerald Green)',
    hex: '#047857',
    borderClass: 'border-emerald-700',
    titleColorClass: 'text-emerald-950',
    accentColorClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    patientBarClass: 'border-emerald-700 bg-emerald-50/70',
    rxColorClass: 'text-emerald-800',
    dividerClass: 'border-emerald-300',
    cardPreviewBg: 'bg-emerald-700',
  },
  royal_purple: {
    id: 'royal_purple',
    name: 'Royal Purple',
    nameBn: 'রয়্যাল পার্পল (Royal Purple)',
    hex: '#4338ca',
    borderClass: 'border-indigo-800',
    titleColorClass: 'text-indigo-950',
    accentColorClass: 'text-indigo-700',
    badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    patientBarClass: 'border-indigo-800 bg-indigo-50/70',
    rxColorClass: 'text-indigo-800',
    dividerClass: 'border-indigo-300',
    cardPreviewBg: 'bg-indigo-700',
  },
  rose_maroon: {
    id: 'rose_maroon',
    name: 'Rose Maroon',
    nameBn: 'রোজ মেরুন (Burgundy Maroon)',
    hex: '#9f1239',
    borderClass: 'border-rose-800',
    titleColorClass: 'text-rose-950',
    accentColorClass: 'text-rose-700',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-200',
    patientBarClass: 'border-rose-800 bg-rose-50/70',
    rxColorClass: 'text-rose-800',
    dividerClass: 'border-rose-300',
    cardPreviewBg: 'bg-rose-800',
  },
  classic_clinical: {
    id: 'classic_clinical',
    name: 'Classic Charcoal',
    nameBn: 'ক্লাসিক ফরমাল (Classic Charcoal)',
    hex: '#18181b',
    borderClass: 'border-slate-800',
    titleColorClass: 'text-slate-900 font-serif',
    accentColorClass: 'text-slate-800',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    patientBarClass: 'border-slate-800 bg-slate-100/70',
    rxColorClass: 'text-slate-900 font-serif',
    dividerClass: 'border-slate-400',
    cardPreviewBg: 'bg-slate-800',
  },
  minimal_elegant: {
    id: 'minimal_elegant',
    name: 'Minimal Slate',
    nameBn: 'মিনিমাল স্লেট (Minimal Slate)',
    hex: '#52525b',
    borderClass: 'border-zinc-500',
    titleColorClass: 'text-zinc-800',
    accentColorClass: 'text-zinc-700',
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    patientBarClass: 'border-zinc-500 bg-zinc-100/50',
    rxColorClass: 'text-zinc-800',
    dividerClass: 'border-zinc-300',
    cardPreviewBg: 'bg-zinc-600',
  },
};

export function getPadTheme(style?: PadLayoutStyle | null): PadThemeConfig {
  if (style && PAD_THEMES[style]) {
    return PAD_THEMES[style];
  }
  return PAD_THEMES.modern_teal;
}

export function getColumnGridClass(ratio?: ColumnRatio | null): string {
  switch (ratio) {
    case '25_75':
      return 'grid-cols-[25%_75%]';
    case '35_65':
      return 'grid-cols-[35%_65%]';
    case '40_60':
      return 'grid-cols-[40%_60%]';
    case '30_70':
    default:
      return 'grid-cols-[30%_70%]';
  }
}

export function getDesktopColumnGridClass(ratio?: ColumnRatio | null): string {
  switch (ratio) {
    case '25_75':
      return 'lg:grid-cols-[25%_75%]';
    case '35_65':
      return 'lg:grid-cols-[35%_65%]';
    case '40_60':
      return 'lg:grid-cols-[40%_60%]';
    case '30_70':
    default:
      return 'lg:grid-cols-[30%_70%]';
  }
}

export function getLogoSizeClasses(size?: LogoSize | null): string {
  switch (size) {
    case 'sm':
      return 'h-11 w-auto max-w-16';
    case 'lg':
      return 'h-20 w-auto max-w-32';
    case 'xl':
      return 'h-24 w-auto max-w-40';
    case 'md':
    default:
      return 'h-16 w-auto max-w-24';
  }
}

export function getNameSizeClasses(size?: NameFontSize | null): string {
  switch (size) {
    case 'large':
      return 'text-2xl sm:text-3xl';
    case 'xl':
      return 'text-3xl sm:text-4xl';
    case 'normal':
    default:
      return 'text-xl sm:text-2xl';
  }
}

export function getClinicNameSizeClasses(size?: NameFontSize | null): string {
  switch (size) {
    case 'large':
      return 'text-lg sm:text-xl';
    case 'xl':
      return 'text-xl sm:text-2xl';
    case 'normal':
    default:
      return 'text-base sm:text-lg';
  }
}

export function formatDegreesList(degrees?: string | null): string[] {
  if (!degrees) return [];
  // If user entered line breaks, split by line break
  if (degrees.includes('\n')) {
    return degrees
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);
  }
  // If user entered semicolon
  if (degrees.includes(';')) {
    return degrees
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean);
  }
  // Default single paragraph
  return [degrees.trim()];
}

export interface PaperDimensions {
  widthMm: number;
  heightMm: number;
  label: string;
  cssSize: string;
}

export function getPaperDimensions(
  preset?: PaperSizePreset | null,
  customWidth?: number | null,
  customHeight?: number | null
): PaperDimensions {
  switch (preset) {
    case 'a5':
      return { widthMm: 148, heightMm: 210, label: 'A5 (১৪৮ × ২১০ মিমি - চেম্বার হাফ প্যাড)', cssSize: '148mm 210mm' };
    case 'letter':
      return { widthMm: 216, heightMm: 279, label: 'Letter (২১৬ × ২৭৯ মিমি)', cssSize: 'letter' };
    case 'custom': {
      const w = customWidth && customWidth >= 80 && customWidth <= 400 ? customWidth : 210;
      const h = customHeight && customHeight >= 100 && customHeight <= 500 ? customHeight : 297;
      return { widthMm: w, heightMm: h, label: `কাস্টম (${w} × ${h} মিমি)`, cssSize: `${w}mm ${h}mm` };
    }
    case 'a4':
    default:
      return { widthMm: 210, heightMm: 297, label: 'A4 (২১০ × ২৯৭ মিমি - ফুল পেজ)', cssSize: 'A4' };
  }
}
