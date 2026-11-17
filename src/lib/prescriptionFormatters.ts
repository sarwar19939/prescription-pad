/**
 * Subcontinent & Bangladesh Chamber Prescription Formatters.
 * Aligns prescription display with "Master The Chamber" & BMDC standards:
 * - Bengali Schedules (১+০+১, ১+১+১, ০+০+১, ১+০+০)
 * - Topical chamber phrases (দিনে ২ বার, রাতে ১ বার, সারা শরীরে মেখে ৮-১২ ঘণ্টা পর ধুয়ে ফেলবেন)
 * - Classical Bengali Meal Timing (খাবারের ২০ মিনিট পূর্বে খালি পেটে / ভরা পেটে)
 * - Duration in days/months (৫ দিন, ৭ দিন, ১৪ দিন, চলবে)
 */
import type { DosageForm, MealTiming, PrescriptionItem } from '@/types/schema';
import { detectMedicineCategory } from '@/services/medicineRouteService';

/**
 * Sanitizes special instructions to completely prevent internal developer/AI/pediatric debug notes
 * (e.g. "Pediatric patient (Age: 5 yrs)") from leaking onto patient-facing prescriptions.
 */
export function sanitizeSpecialInstructions(instructions?: string | null): string {
  if (!instructions) return '';
  const text = instructions.trim();
  if (
    /pediatric patient|paediatric patient|switched to oral|weight-based pediatric|titrated morning regimen|optimal 30 mins before|patient \(age:\s*\d+/i.test(
      text
    )
  ) {
    return '';
  }
  return text;
}

const FORM_PREFIX_REGEX =
  /^(tablet|tab|capsule|cap|syrup|syr|suspension|susp|injection|inj|ointment|oint|cream|gel|lotion|lot|drop|drops|suppository|supp|pessary|sachet|inhaler|spray)\.?\s+/i;

/**
 * Normalizes any free-form or AI dosage form into the standard BMDC short form:
 * e.g. "Tablet" -> "Tab", "Capsule" -> "Cap", "Cream" -> "Cream", "Ointment" -> "Oint", "Injection" -> "Inj".
 */
export function normalizeDosageForm(form?: string | null): DosageForm {
  if (!form) return 'Tab';
  const f = form.trim().toLowerCase();
  if (f.startsWith('cap') || f.includes('ক্যাপসুল')) return 'Cap';
  if (f.startsWith('susp') || f.includes('সাসপেনশন')) return 'Susp';
  if (f.startsWith('syr') || f.includes('সিরাপ')) return 'Syr';
  if (f.startsWith('inj') || f.includes('ইনজেকশন')) return 'Inj';
  if (f.startsWith('cream') || f.includes('cream') || f.includes('ক্রিম')) return 'Cream';
  if (f.startsWith('gel') || f.includes('gel') || f.includes('জেল')) return 'Gel';
  if (f.startsWith('lot') || f.includes('lot') || f.includes('লোশন')) return 'Lotion';
  if (f.startsWith('oint') || f.includes('oint') || f.includes('মলম')) return 'Oint';
  if (f.startsWith('drop') || f.includes('drop') || f.includes('ড্রপ')) return 'Drop';
  if (f.startsWith('pess') || f.includes('pess') || f.includes('পেসারি')) return 'Pessary';
  if (f.startsWith('supp') || f.includes('supp') || f.includes('সাপোজিটরি')) return 'Supp';
  if (f.startsWith('sachet') || f.includes('স্যাচেট')) return 'Sachet';
  if (f.startsWith('inhal') || f.includes('ইনহেলার')) return 'Inhaler';
  if (f.startsWith('spray') || f.includes('স্প্রে')) return 'Spray';
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
 * Formats patient age in standard English clinical notation (Years, Months, and Days):
 * e.g. age 42, months 5 -> "42 Y 5 M"
 * age 0, months 7 -> "7 Months"
 * age 0, days 15 -> "15 Days"
 * age 35 -> "35 Y"
 */
export function formatPatientAge(
  age?: number | null,
  months?: number | null,
  days?: number | null,
  unit?: 'years' | 'months' | 'days' | string
): string {
  if (unit === 'days' || (typeof days === 'number' && days > 0 && (!age || age === 0) && (!months || months === 0))) {
    const d = days ?? age ?? 0;
    return `${d} Days`;
  }
  if (unit === 'months' || (typeof months === 'number' && months > 0 && (!age || age === 0))) {
    const m = months ?? age ?? 0;
    return `${m} Months`;
  }
  const y = typeof age === 'number' ? age : 0;
  const m = typeof months === 'number' && months > 0 ? months : 0;
  const d = typeof days === 'number' && days > 0 ? days : 0;
  if (y > 0 && m > 0) return `${y} Y ${m} M`;
  if (y > 0) return `${y} Y`;
  if (m > 0) return `${m} Months`;
  if (d > 0) return `${d} Days`;
  return `${y} Y`;
}

/**
 * Formats patient age in Bengali notation:
 * e.g. "৫ বছর", "৫ মাস", "৫ দিন"
 */
export function formatPatientAgeBn(
  age?: number | null,
  months?: number | null,
  days?: number | null,
  unit?: 'years' | 'months' | 'days' | string
): string {
  if (unit === 'days' || (typeof days === 'number' && days > 0 && (!age || age === 0) && (!months || months === 0))) {
    const d = days ?? age ?? 0;
    return `${toBengaliNumerals(d)} দিন`;
  }
  if (unit === 'months' || (typeof months === 'number' && months > 0 && (!age || age === 0))) {
    const m = months ?? age ?? 0;
    return `${toBengaliNumerals(m)} মাস`;
  }
  const y = typeof age === 'number' ? age : 0;
  const m = typeof months === 'number' && months > 0 ? months : 0;
  const d = typeof days === 'number' && days > 0 ? days : 0;
  if (y > 0 && m > 0) return `${toBengaliNumerals(y)} বছর ${toBengaliNumerals(m)} মাস`;
  if (y > 0) return `${toBengaliNumerals(y)} বছর`;
  if (m > 0) return `${toBengaliNumerals(m)} মাস`;
  if (d > 0) return `${toBengaliNumerals(d)} দিন`;
  return `${toBengaliNumerals(y)} বছর`;
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
  if (
    t === 'প্রযোজ্য নয়' ||
    t === 'প্রযোজ্য নয়' ||
    t.includes('not applicable') ||
    t.includes('বাহ্যিক') ||
    t.includes('n/a')
  ) {
    return '';
  }
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
 * Formats a full prescription line matching BMDC & subcontinent chamber standards:
 * Automatically adapts format for:
 * - Creams / Ointments (instructions + route, e.g. "সারা শরীরে ভালোভাবে মেখে ৮-১২ ঘণ্টা পর ধুয়ে ফেলবেন — ১ দিন")
 * - Syrups (spoon/ml + meal timing, e.g. "১ চামচ করে দিনে ৩ বার — খাবারের পরে — ৫ দিন")
 * - Suppositories & Pessaries (rectal / vaginal route, e.g. "১টি করে সাপোজিটরি পায়ুপথে — প্রয়োজনে (SOS)")
 * - Injections (IV/IM route, e.g. "শিরায় (IV) ধীরে ধীরে পুশ করবেন — দিনে ১ বার — ৩ দিন")
 * - Drops / Inhalers
 * - Standard Oral Tablets / Capsules
 */
export function formatSubcontinentRxLine(item: Partial<PrescriptionItem>): {
  title: string;
  dosageDetails: string;
  taperingLines?: string[];
} {
  let form = normalizeDosageForm(item.dosage_form);
  const brand = cleanBrandName(item.brand_name) || item.brand_name || 'Medicine';
  const category = detectMedicineCategory(item.dosage_form, item.brand_name, item.generic_name);

  // Auto-correct dosage form if topical was mistakenly stored as Syr or Tab
  if (category === 'topical' && (form === 'Syr' || form === 'Tab')) {
    form = (item.brand_name?.toLowerCase().includes('oint') || item.generic_name?.toLowerCase().includes('oint'))
      ? 'Oint'
      : 'Cream';
  }

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

  let sched = formatSubcontinentSchedule(item.schedule);
  const dur = formatSubcontinentDuration(item.duration);
  const instructions = sanitizeSpecialInstructions(item.special_instructions);
  const route = (item.route || '').trim();

  let dosageDetails = '';

  // Non-oral routes (creams, suppositories, vaginal pessaries, injections, drops, inhalers)
  if (
    category === 'topical' ||
    category === 'rectal_suppository' ||
    category === 'vaginal_suppository' ||
    category === 'injection' ||
    category === 'drops' ||
    category === 'inhaler'
  ) {
    // For topicals specifically, normalize numeric schedules like "1+0+1" or "1+1" into standard clinical Bengali phrases:
    if (category === 'topical') {
      const rawSched = (item.schedule || '').trim();
      const combinedName = `${brand} ${item.generic_name || ''}`.toLowerCase();
      const isScabies =
        combinedName.includes('permin') ||
        combinedName.includes('permethrin') ||
        combinedName.includes('scabex') ||
        combinedName.includes('lorex');

      if (isScabies) {
        sched = '১ বার (রাতে)';
      } else if (/^(1\+0\+1|1\s*\+\s*1|2)$/i.test(rawSched)) {
        sched = 'দিনে ২ বার';
      } else if (/^(1\+1\+1|3)$/i.test(rawSched)) {
        sched = 'দিনে ৩ বার';
      } else if (/^(0\+0\+1|1\+0\+0|1\+0|1)$/i.test(rawSched)) {
        sched = 'রাতে ১ বার';
      } else if (/^(2-3|2\s*-\s*3)$/i.test(rawSched)) {
        sched = 'দিনে ২-৩ বার';
      }
    }

    const parts: string[] = [];

    // Schedule / Frequency
    if (sched) {
      parts.push(sched);
    }

    // Instructions or Route
    if (instructions) {
      if (!instructions.includes(sched)) {
        parts.push(instructions);
      } else {
        parts.length = 0;
        parts.push(instructions);
      }
    } else if (route && route !== 'প্রযোজ্য নয়' && route !== 'Topical') {
      parts.push(route);
    } else if (category === 'topical') {
      parts.push('আক্রান্ত স্থানে পাতলা করে লাগাবেন');
    }

    if (dur) parts.push(dur);
    dosageDetails = parts.filter(Boolean).join(' — ');
  } else if (category === 'syrup' || form === 'Syr' || form === 'Susp') {
    // Syrups & Liquid Suspensions: Clean spoon/ml and frequency display
    let cleanSched = sched;
    const rawSched = (item.schedule || '').trim();
    if (/^(1\+1\+1|1\s*\+\s*1\s*\+\s*1)$/.test(rawSched)) {
      cleanSched = '১ চামচ (৫ মি.লি.) করে দিনে ৩ বার';
    } else if (/^(1\+0\+1|1\s*\+\s*0\s*\+\s*1|1\+1)$/.test(rawSched)) {
      cleanSched = '১ চামচ (৫ মি.লি.) করে দিনে ২ বার';
    } else if (/^(1\+0\+0|0\+0\+1|1\s*\+\s*0\s*\+\s*0)$/.test(rawSched)) {
      cleanSched = '১ চামচ (৫ মি.লি.) করে দিনে ১ বার';
    } else if (/^(1\+1\+1\+1)$/.test(rawSched)) {
      cleanSched = '১ চামচ (৫ মি.লি.) করে দিনে ৪ বার';
    }

    const meal = formatSubcontinentMealTiming(item.meal_timing);
    const parts: string[] = [cleanSched];
    if (meal) parts.push(meal);
    if (dur) parts.push(dur);
    if (instructions && !cleanSched.includes(instructions) && !instructions.includes(cleanSched)) {
      parts.push(instructions);
    }
    dosageDetails = parts.filter(Boolean).join(' — ');
  } else {
    // Oral solid formulations (Tablets, Capsules, Sachets)
    const meal = formatSubcontinentMealTiming(item.meal_timing);
    const parts = [sched, meal, dur].filter(Boolean);
    if (instructions) {
      parts.push(instructions);
    }
    dosageDetails = parts.join(' — ');
  }

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
