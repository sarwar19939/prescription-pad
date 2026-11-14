/**
 * Subcontinent & Bangladesh Chamber Prescription Formatters.
 * Aligns prescription display with "Master The Chamber" & BMDC standards:
 * - Bengali Schedules (১+০+১, ১+১+১, ০+০+১, ১+০+০)
 * - Classical Bengali Meal Timing (খাবারের ২০ মিনিট পূর্বে খালি পেটে / ভরা পেটে)
 * - Duration in days/months (৫ দিন, ৭ দিন, ১৪ দিন, চলবে)
 */
import type { DosageForm, MealTiming, PrescriptionItem } from '@/types/schema';

const FORM_PREFIX_REGEX = /^(tablet|tab|capsule|cap|syrup|syr|injection|inj|ointment|oint|cream|gel|drop|drops|suppository|supp|sachet|inhaler)\.?\s+/i;

/**
 * Normalizes any free-form or AI dosage form into the standard BMDC short form:
 * e.g. "Tablet" -> "Tab", "Capsule" -> "Cap", "Syrup" -> "Syr", "Injection" -> "Inj".
 */
export function normalizeDosageForm(form?: string | null): DosageForm {
  if (!form) return 'Tab';
  const f = form.trim().toLowerCase();
  if (f.startsWith('cap')) return 'Cap';
  if (f.startsWith('syr')) return 'Syr';
  if (f.startsWith('inj')) return 'Inj';
  if (f.startsWith('oint') || f.startsWith('cream') || f.startsWith('gel')) return 'Oint';
  if (f.startsWith('drop')) return 'Drop';
  if (f.startsWith('supp')) return 'Supp';
  if (f.startsWith('sachet')) return 'Sachet';
  if (f.startsWith('inhal')) return 'Inhaler';
  return 'Tab';
}

/**
 * Strips redundant dosage form prefixes from brand name to prevent duplicate labels like "Tablet. Tab. Bisocor":
 * e.g. "Tab. Bisocor" -> "Bisocor"
 * "Tablet Tab Bisocor" -> "Bisocor"
 * "Tab Ecosprin" -> "Ecosprin"
 * "Cap. Maxpro" -> "Maxpro"
 */
export function cleanBrandName(brandName?: string | null): string {
  if (!brandName) return '';
  let clean = brandName.trim();
  while (FORM_PREFIX_REGEX.test(clean)) {
    clean = clean.replace(FORM_PREFIX_REGEX, '').trim();
  }
  return clean;
}

const EN_TO_BN_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts English numerals to Bengali numerals.
 */
export function toBengaliNumerals(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => EN_TO_BN_DIGITS[d] || d);
}

/**
 * Formats prescription schedule into standard Subcontinent chamber notation:
 * e.g. "1+0+1" -> "১ + ০ + ১"
 * "1+1+1" -> "১ + ১ + ১"
 * "1 tab SOS" -> "প্রয়োজনে (SOS)"
 */
export function formatSubcontinentSchedule(schedule?: string | null): string {
  if (!schedule) return '';
  const s = schedule.trim();
  if (/sos/i.test(s)) {
    return 'প্রয়োজনে (SOS)';
  }
  if (/^\d+\s*\+\s*\d+\s*\+\s*\d+(\s*\+\s*\d+)?$/.test(s)) {
    const parts = s.split('+').map((p) => toBengaliNumerals(p.trim()));
    return parts.join(' + ');
  }
  return toBengaliNumerals(s);
}

/**
 * Formats meal timing into clinical Subcontinent chamber guidance.
 */
export function formatSubcontinentMealTiming(timing?: MealTiming | string | null): string {
  if (!timing) return '';
  const t = timing.trim().toLowerCase();
  if (t === 'before meal' || t.includes('before') || t.includes('খালি পেট') || t.includes('পূর্বে')) {
    return 'খাবারের পূর্বে';
  }
  if (t === 'after meal' || t.includes('after') || t.includes('ভরা পেট') || t.includes('পরে')) {
    return 'খাবারের পরে';
  }
  if (t === 'with meal' || t.includes('with') || t.includes('সাথে')) {
    return 'খাবারের সাথে';
  }
  if (t.includes('night') || t.includes('bedtime') || t.includes('sleep') || t.includes('রাতে')) {
    return 'রাতে শোবার আগে';
  }
  if (t === 'anytime' || t.includes('any')) {
    return 'যেকোনো সময়';
  }
  return timing;
}

/**
 * Formats duration into standard Bengali duration representation:
 * e.g. "5 Days" -> "৫ দিন"
 * "14 Days" -> "১৪ দিন"
 * "1 Month" -> "১ মাস"
 * "Ongoing" -> "চলবে (নিয়মিত)"
 */
export function formatSubcontinentDuration(duration?: string | null): string {
  if (!duration) return '';
  const d = duration.trim();
  if (/ongoing|long\s*term|continue/i.test(d)) {
    return 'চলবে (নিয়মিত)';
  }
  if (/(\d+)\s*days?/i.test(d)) {
    return d.replace(/(\d+)\s*days?/i, (_, n) => `${toBengaliNumerals(n)} দিন`);
  }
  if (/(\d+)\s*weeks?/i.test(d)) {
    return d.replace(/(\d+)\s*weeks?/i, (_, n) => `${toBengaliNumerals(n)} সপ্তাহ`);
  }
  if (/(\d+)\s*months?/i.test(d)) {
    return d.replace(/(\d+)\s*months?/i, (_, n) => `${toBengaliNumerals(n)} মাস`);
  }
  return toBengaliNumerals(d);
}

/**
 * Formats a full prescription line matching "Master The Chamber" layout:
 * "Tab. Napa Extend (665 mg) — ১ + ০ + ১ — খাবারের পরে (ভরা পেটে) — ৫ দিন"
 */
export function formatSubcontinentRxLine(item: Partial<PrescriptionItem>): {
  title: string;
  dosageDetails: string;
  taperingLines?: string[];
} {
  const form = normalizeDosageForm(item.dosage_form);
  const brand = cleanBrandName(item.brand_name) || item.brand_name || 'Medicine';
  const hasStrengthInBrand = item.strength && brand.toLowerCase().includes(item.strength.toLowerCase());
  const strengthPart = item.strength && !hasStrengthInBrand ? item.strength : '';
  const title = `${form}. ${brand}${strengthPart ? ' ' + strengthPart : ''}`.trim();

  let taperingLines: string[] | undefined;
  if (item.tapering_steps && item.tapering_steps.length > 0) {
    taperingLines = item.tapering_steps.map((st, i) => {
      const stepPrefix = i === 0 ? 'ধাপ ১' : `অতঃপর ধাপ ${toBengaliNumerals(i + 1)}`;
      const s = formatSubcontinentSchedule(st.schedule);
      const m = formatSubcontinentMealTiming(st.meal_timing || item.meal_timing);
      const d = formatSubcontinentDuration(st.duration);
      const note = st.note ? ` (${st.note})` : '';
      return `${stepPrefix}: ${[s, m, d].filter(Boolean).join(' — ')}${note}`;
    });
  }

  const sched = formatSubcontinentSchedule(item.schedule);
  const meal = formatSubcontinentMealTiming(item.meal_timing);
  const dur = formatSubcontinentDuration(item.duration);

  const parts = [sched, meal, dur].filter(Boolean);
  const dosageDetails = parts.join(' — ');

  return { title, dosageDetails, taperingLines };
}

/**
 * Strips AI vision observations, automated lab OCR lines, and AI diagnostic notes
 * from clinical findings so that the printed prescription and manual O/E field
 * contain ONLY the physician's manually entered physical examination findings.
 */
export function stripAiGeneratedFindings(text?: string | null): string {
  if (!text) return '';
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      // Filter out AI photo vision notes: e.g. "AI Findings (Onychomycosis): ..."
      if (/^AI Findings\b/i.test(line)) return false;
      if (/^\[AI Vision\b/i.test(line)) return false;
      if (/^AI Exam\b/i.test(line)) return false;
      if (/^AI Diagnostic\b/i.test(line)) return false;
      // Filter out automated investigation report tags: e.g. "[12-Lead Electrocardiogram]: ..."
      if (/^\[.+\]:\s*.+/i.test(line)) return false;
      return true;
    })
    .join('\n')
    .trim();
}

/**
 * Extracts solely the AI-generated findings from a text blob so they can be
 * preserved in `encounter.ai_suggested_notes` for AI Co-Pilot decision support.
 */
export function extractAiGeneratedFindings(text?: string | null): string {
  if (!text) return '';
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      if (/^AI Findings\b/i.test(line)) return true;
      if (/^\[AI Vision\b/i.test(line)) return true;
      if (/^AI Exam\b/i.test(line)) return true;
      if (/^AI Diagnostic\b/i.test(line)) return true;
      if (/^\[.+\]:\s*.+/i.test(line)) return true;
      return false;
    })
    .join('\n')
    .trim();
}
