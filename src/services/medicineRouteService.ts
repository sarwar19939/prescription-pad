/**
 * Medicine Route & Preparation Specific Dosage Engine.
 * Automatically aligns routes, administration instructions, and dosage options
 * for:
 * - Creams / Ointments / Lotions / Gels (Scabies permethrin, topical steroid/antibiotic/antifungal)
 * - Syrups / Suspensions (Spoon/ml dosing, shake bottle)
 * - Rectal Suppositories (Per Rectum, fever/pain SOS)
 * - Vaginal Suppositories / Pessaries (Per Vaginam, bedtime)
 * - Injections (IV, IM, SC, IV Infusion)
 * - Eye / Ear / Nasal Drops & Sprays
 * - Inhalers & Rotahalers
 * - Oral Tablets & Capsules
 */

export type MedicineCategory =
  | 'topical'
  | 'syrup'
  | 'rectal_suppository'
  | 'vaginal_suppository'
  | 'injection'
  | 'drops'
  | 'inhaler'
  | 'oral_solid';

export interface RoutePresetOption {
  label: string;
  text: string;
}

export interface CategoryDosageProfile {
  category: MedicineCategory;
  categoryLabelBn: string;
  isTopical: boolean;
  defaultRoute: string;
  defaultSchedule: string;
  defaultMealTiming: string;
  defaultDuration: string;
  defaultSpecialInstructions: string;
  routeOptions: string[];
  instructionPresets: RoutePresetOption[];
  quickDoseUnits?: string[];
  hideMealTiming?: boolean;
}

/**
 * Detects medicine clinical category based on dosage form, brand name, and generic name.
 */
export function detectMedicineCategory(
  form?: string | null,
  brand?: string | null,
  generic?: string | null
): MedicineCategory {
  const f = (form || '').toLowerCase().trim();
  const b = (brand || '').toLowerCase().trim();
  const g = (generic || '').toLowerCase().trim();
  const combined = `${b} ${g} ${f}`;

  // 1. Vaginal Suppository / Pessary
  if (
    f === 'pessary' ||
    f.includes('vag') ||
    combined.includes('pessary') ||
    combined.includes('vaginal') ||
    combined.includes('gynomix') ||
    combined.includes('candid-v') ||
    combined.includes('candid v') ||
    combined.includes('ovule') ||
    combined.includes('gynostatin')
  ) {
    return 'vaginal_suppository';
  }

  // 2. Rectal Suppository
  if (
    f === 'supp' ||
    f.includes('suppos') ||
    combined.includes('suppository') ||
    combined.includes(' supp') ||
    b.endsWith('supp') ||
    combined.includes('glycerin supp') ||
    combined.includes('clofenac supp')
  ) {
    return 'rectal_suppository';
  }

  // 3. Injections
  if (
    f === 'inj' ||
    f.includes('inject') ||
    combined.includes(' injection') ||
    combined.includes(' inj') ||
    combined.includes('infusion') ||
    combined.includes('ampoule') ||
    combined.includes('vial') ||
    combined.includes('iv/im') ||
    combined.includes('iv/sc') ||
    combined.includes('ceftriaxone') ||
    combined.includes('ketorolac inj') ||
    combined.includes('tramadol inj') ||
    combined.includes('omeprazole iv')
  ) {
    return 'injection';
  }

  // 4. Drops & Sprays (Eye/Ear/Nasal)
  if (
    f === 'drop' ||
    f === 'drops' ||
    f === 'spray' ||
    combined.includes(' drop') ||
    combined.includes(' spray') ||
    combined.includes('eye drop') ||
    combined.includes('ear drop') ||
    combined.includes('nasal drop') ||
    combined.includes('nasal spray') ||
    combined.includes('moxifloxacin eye') ||
    combined.includes('otobiotic')
  ) {
    return 'drops';
  }

  // 5. Inhalers & Respules
  if (
    f === 'inhaler' ||
    f.includes('inhal') ||
    combined.includes('inhaler') ||
    combined.includes('rotacap') ||
    combined.includes('respule') ||
    combined.includes('rotahaler') ||
    combined.includes('aerocort') ||
    combined.includes('azmasol') ||
    combined.includes('budesonide resp') ||
    combined.includes('seretide')
  ) {
    return 'inhaler';
  }

  // 6. Creams / Ointments / Lotions / Gels
  if (
    f === 'cream' ||
    f === 'oint' ||
    f === 'gel' ||
    f === 'lotion' ||
    f.includes('cream') ||
    f.includes('oint') ||
    f.includes('gel') ||
    f.includes('lot') ||
    f.includes('ক্রিম') ||
    f.includes('মলম') ||
    f.includes('জেল') ||
    f.includes('লোশন') ||
    combined.includes(' cream') ||
    combined.includes(' oint') ||
    combined.includes(' gel') ||
    combined.includes(' lotion') ||
    combined.includes('ক্রিম') ||
    combined.includes('মলম') ||
    combined.includes('afun') ||
    combined.includes('এফান') ||
    combined.includes('halovar') ||
    combined.includes('halovate') ||
    combined.includes('হ্যালোভার') ||
    combined.includes('হ্যালোভেট') ||
    combined.includes('permin') ||
    combined.includes('পারমিন') ||
    combined.includes('permethrin') ||
    combined.includes('scabex') ||
    combined.includes('lorex') ||
    combined.includes('dermasol') ||
    combined.includes('betnovate') ||
    combined.includes('clobetasol') ||
    combined.includes('halobetasol') ||
    combined.includes('clotrimazole') ||
    combined.includes('miconazole') ||
    combined.includes('ketoconazole') ||
    combined.includes('terbinafine') ||
    combined.includes('econazole') ||
    combined.includes('luliconazole') ||
    combined.includes('fusidic') ||
    combined.includes('mupirocin') ||
    combined.includes('bactroban') ||
    combined.includes('clofenac gel') ||
    combined.includes('silver sulfadiazine') ||
    combined.includes('burnsil')
  ) {
    return 'topical';
  }

  // 7. Syrups & Suspensions
  if (
    f === 'syr' ||
    f === 'susp' ||
    f.includes('syrup') ||
    f.includes('susp') ||
    combined.includes(' syrup') ||
    combined.includes(' susp') ||
    combined.includes(' suspension') ||
    combined.includes('oral solution') ||
    combined.includes('elixir')
  ) {
    return 'syrup';
  }

  return 'oral_solid';
}

/**
 * Returns comprehensive category dosage configuration, intelligent defaults,
 * route of administration, and quick instruction presets.
 */
export function getCategoryDosageProfile(
  category: MedicineCategory,
  brand?: string | null,
  generic?: string | null
): CategoryDosageProfile {
  const combined = `${brand || ''} ${generic || ''}`.toLowerCase();
  const isPermethrinOrScabies =
    combined.includes('permethrin') ||
    combined.includes('scabex') ||
    combined.includes('lorex') ||
    combined.includes('scabies') ||
    combined.includes('elimite');

  switch (category) {
    case 'topical': {
      if (isPermethrinOrScabies) {
        return {
          category: 'topical',
          categoryLabelBn: 'ক্রিম / মলম (স্ক্যাবিস)',
          isTopical: true,
          hideMealTiming: true,
          defaultRoute: 'সারা শরীরে (ঘাড় থেকে পা)',
          defaultSchedule: '১ বার (রাতে)',
          defaultMealTiming: 'প্রযোজ্য নয়',
          defaultDuration: '১ দিন (৭ দিন পর পুনরায়)',
          defaultSpecialInstructions: '',
          routeOptions: [
            'সারা শরীরে (ঘাড় থেকে পা)',
            'আক্রান্ত স্থানে (ত্বকে)',
            'আক্রান্ত ত্বকে ও আঙুলের ফাঁকে',
          ],
          instructionPresets: [],
        };
      }

      return {
        category: 'topical',
        categoryLabelBn: 'ক্রিম / মলম / লোশন',
        isTopical: true,
        hideMealTiming: true,
        defaultRoute: 'আক্রান্ত স্থানে (ত্বকে)',
        defaultSchedule: 'দিনে ২ বার',
        defaultMealTiming: 'প্রযোজ্য নয়',
        defaultDuration: '৭ দিন',
        defaultSpecialInstructions: '',
        routeOptions: [
          'আক্রান্ত স্থানে (ত্বকে)',
          'সারা শরীরে (ঘাড় থেকে পা)',
          'ক্ষতস্থানে পাতলা প্রলেপ',
          'মাথার তালুতে (Scalp)',
          'আক্রান্ত নখে ও ত্বকে',
        ],
        instructionPresets: [],
      };
    }

    case 'syrup':
      return {
        category: 'syrup',
        categoryLabelBn: 'সিরাপ / সাসপেনশন',
        isTopical: false,
        hideMealTiming: false,
        defaultRoute: 'মুখে (Oral)',
        defaultSchedule: '১+১+১',
        defaultMealTiming: 'After Meal',
        defaultDuration: '৫ দিন',
        defaultSpecialInstructions: '',
        routeOptions: ['মুখে (Oral)'],
        quickDoseUnits: [],
        instructionPresets: [],
      };

    case 'rectal_suppository':
      return {
        category: 'rectal_suppository',
        categoryLabelBn: 'সাপোজিটরি (পায়ুপথে)',
        isTopical: false,
        hideMealTiming: true,
        defaultRoute: 'পায়ুপথে (Per Rectum)',
        defaultSchedule: 'প্রয়োজনে (SOS)',
        defaultMealTiming: 'প্রযোজ্য নয়',
        defaultDuration: '৩ দিন',
        defaultSpecialInstructions: '',
        routeOptions: ['পায়ুপথে (Per Rectum)'],
        instructionPresets: [],
      };

    case 'vaginal_suppository':
      return {
        category: 'vaginal_suppository',
        categoryLabelBn: 'ভেজাইনাল সাপোজিটরি / পেসারি',
        isTopical: false,
        hideMealTiming: true,
        defaultRoute: 'যোনিপথে (Per Vaginam)',
        defaultSchedule: '০+০+১ (রাতে)',
        defaultMealTiming: 'রাতে শোবার সময়',
        defaultDuration: '৭ দিন',
        defaultSpecialInstructions: '',
        routeOptions: ['যোনিপথে (Per Vaginam)'],
        instructionPresets: [],
      };

    case 'injection':
      return {
        category: 'injection',
        categoryLabelBn: 'ইনজেকশন',
        isTopical: false,
        hideMealTiming: true,
        defaultRoute: 'শিরায় (IV)',
        defaultSchedule: 'দিনে ১ বার',
        defaultMealTiming: 'প্রযোজ্য নয়',
        defaultDuration: '৩ দিন',
        defaultSpecialInstructions: '',
        routeOptions: [
          'শিরায় (IV)',
          'মাংসে (IM)',
          'ত্বকের নিচে (SC)',
          'IV ইনফিউশন (স্যালাইনে)',
          'গভীর মাংসে (Deep IM)',
        ],
        instructionPresets: [],
      };

    case 'drops':
      return {
        category: 'drops',
        categoryLabelBn: 'ড্রপ / স্প্রে (চোখ/কান/নাক)',
        isTopical: true,
        hideMealTiming: true,
        defaultRoute: 'চোখে (Eye)',
        defaultSchedule: '১-২ ফোঁটা',
        defaultMealTiming: 'প্রযোজ্য নয়',
        defaultDuration: '৭ দিন',
        defaultSpecialInstructions: '',
        routeOptions: [
          'চোখে (Eye)',
          'কানে (Ear)',
          'নাকে (Nasal)',
          'আক্রান্ত চোখে ও কানে',
        ],
        instructionPresets: [],
      };

    case 'inhaler':
      return {
        category: 'inhaler',
        categoryLabelBn: 'ইনহেলার / রোটাহেলার',
        isTopical: false,
        hideMealTiming: true,
        defaultRoute: 'শ্বাস টেনে (Inhalation)',
        defaultSchedule: '১-২ পাফ',
        defaultMealTiming: 'প্রযোজ্য নয়',
        defaultDuration: 'চলবে',
        defaultSpecialInstructions: '',
        routeOptions: [
          'শ্বাস টেনে (Inhalation)',
          'স্পেসারের সাহায্যে',
          'নেবুলাইজারের মাধ্যমে',
        ],
        instructionPresets: [],
      };

    case 'oral_solid':
    default:
      return {
        category: 'oral_solid',
        categoryLabelBn: 'ট্যাবলেট / ক্যাপসুল',
        isTopical: false,
        hideMealTiming: false,
        defaultRoute: 'মুখে (Oral)',
        defaultSchedule: '1+0+1',
        defaultMealTiming: 'After Meal',
        defaultDuration: '৭ দিন',
        defaultSpecialInstructions: '',
        routeOptions: ['মুখে (Oral)'],
        instructionPresets: [],
      };
  }
}
