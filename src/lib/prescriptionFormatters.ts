/**
 * Subcontinent & Bangladesh Chamber Prescription Formatters.
 * Aligns prescription display with "Master The Chamber" & BMDC standards:
 * - Bengali Schedules (১+০+১, ১+১+১, ০+০+১, ১+০+০)
 * - Classical Bengali Meal Timing (খাবারের ২০ মিনিট পূর্বে খালি পেটে / ভরা পেটে)
 * - Duration in days/months (৫ দিন, ৭ দিন, ১৪ দিন, চলবে)
 */
import type { MealTiming, PrescriptionItem } from '@/types/schema';

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
  if (t === 'before meal' || t.includes('before')) {
    return 'খাবারের ২০ মিনিট পূর্বে (খালি পেটে)';
  }
  if (t === 'after meal' || t.includes('after')) {
    return 'খাবারের পরে (ভরা পেটে)';
  }
  if (t === 'with meal' || t.includes('with')) {
    return 'খাবারের সাথে';
  }
  if (t.includes('night') || t.includes('bedtime') || t.includes('sleep')) {
    return 'রাতে ঘুমানোর পূর্বে';
  }
  if (t === 'anytime' || t.includes('any')) {
    return 'যেকোনো সময় / প্রয়োজন অনুযায়ী';
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
} {
  const form = item.dosage_form || 'Tab';
  const brand = item.brand_name || 'Medicine';
  const strength = item.strength ? `(${item.strength})` : '';
  const title = `${form}. ${brand} ${strength}`.trim();

  const sched = formatSubcontinentSchedule(item.schedule);
  const meal = formatSubcontinentMealTiming(item.meal_timing);
  const dur = formatSubcontinentDuration(item.duration);

  const parts = [sched, meal, dur].filter(Boolean);
  const dosageDetails = parts.join(' — ');

  return { title, dosageDetails };
}
