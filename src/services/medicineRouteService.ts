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
          defaultSpecialInstructions:
            'ঘাড় থেকে পায়ের পাতা পর্যন্ত সারা শরীরে ভালোভাবে মেখে ৮-১২ ঘণ্টা পর সাবান দিয়ে ধুয়ে ফেলবেন। পরিবারের সবার একসাথে ব্যবহার জরুরি।',
          routeOptions: [
            'সারা শরীরে (ঘাড় থেকে পা)',
            'আক্রান্ত স্থানে (ত্বকে)',
            'আক্রান্ত ত্বকে ও আঙুলের ফাঁকে',
          ],
          instructionPresets: [
            {
              label: 'স্ক্যাবিস সারা শরীরে মেখে ৮-১২ ঘণ্টা',
              text: 'ঘাড় থেকে পায়ের পাতা পর্যন্ত সারা শরীরে মেখে ৮-১২ ঘণ্টা পর সাবান দিয়ে ধুয়ে ফেলবেন। পরিবারের সবার একসাথে ব্যবহার জরুরি।',
            },
            {
              label: '৭ দিন পর পুনরায় ব্যবহার',
              text: 'ঠিক ৭ দিন পর একই নিয়মে পুনরায় সারা শরীরে একবার ব্যবহার করবেন।',
            },
            {
              label: 'আক্রান্ত স্থানে পাতলা করে',
              text: 'আক্রান্ত স্থানে পরিষ্কার করে শুকিয়ে দিনে ২ বার আলতো করে লাগাবেন।',
            },
            {
              label: 'পরিবারের সবার একসাথে',
              text: 'লক্ষণ থাকুক বা না থাকুক পরিবারের সকল সদস্য একই সাথে ব্যবহার করতে হবে।',
            },
            {
              label: 'গরম পানিতে কাপড় ধোয়া',
              text: 'ব্যবহারের পর সকল জামাকাপড় ও বিছানার চাদর ফুটন্ত গরম পানিতে ধুয়ে কড়া রোদে শুকাবেন।',
            },
          ],
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
        defaultSpecialInstructions: 'আক্রান্ত স্থান পরিষ্কার করে শুকিয়ে দিনে ২ বার পাতলা করে লাগাবেন।',
        routeOptions: [
          'আক্রান্ত স্থানে (ত্বকে)',
          'সারা শরীরে (ঘাড় থেকে পা)',
          'ক্ষতস্থানে পাতলা প্রলেপ',
          'মাথার তালুতে (Scalp)',
          'আক্রান্ত নখে ও ত্বকে',
        ],
        instructionPresets: [
          {
            label: 'দিনে ২ বার পাতলা করে',
            text: 'আক্রান্ত স্থান পরিষ্কার করে শুকিয়ে দিনে ২ বার পাতলা করে লাগাবেন।',
          },
          {
            label: 'দিনে ৩ বার হালকা মালিশ',
            text: 'আক্রান্ত স্থানে দিনে ৩ বার হালকাভাবে মালিশ করবেন।',
          },
          {
            label: 'রাতে শোবার সময় মেখে রাখবেন',
            text: 'রাতে শোবার পূর্বে আক্রান্ত স্থানে মেখে ঘুমাবেন।',
          },
          {
            label: 'গোসলের পর লাগাবেন',
            text: 'গোসল করে শরীর ভালো করে মুছে আক্রান্ত স্থানে মেখে নিবেন।',
          },
          {
            label: 'ক্ষতস্থান পরিষ্কার করে শুকিয়ে',
            text: 'ক্ষতস্থান অ্যান্টিসেপটিক দিয়ে পরিষ্কার করে শুকিয়ে পাতলা প্রলেপ দিন।',
          },
          {
            label: 'চোখ ও মুখে লাগানো নিষেধ',
            text: 'চোখ, নাক ও মুখের ভেতরের অংশ বাঁচিয়ে সাবধানে লাগাবেন।',
          },
        ],
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
        defaultSpecialInstructions: 'বোতল ভালো করে ঝাঁকিয়ে ১ চামচ (৫ মি.লি.) করে দিনে ৩ বার খাবারের পরে সেব্য।',
        routeOptions: ['মুখে (Oral)'],
        quickDoseUnits: [
          '১ চামচ (৫ মি.লি.)',
          '২ চামচ (১০ মি.লি.)',
          '১/২ চামচ (২.৫ মি.লি.)',
          '১.৫ চামচ (৭.৫ মি.লি.)',
          '১০-১৫ ফোঁটা',
        ],
        instructionPresets: [
          {
            label: '১ চামচ (৫ মি.লি.) দিনে ৩ বার',
            text: 'বোতল ভালো করে ঝাঁকিয়ে ১ চামচ (৫ মি.লি.) করে দিনে ৩ বার খাবারের পরে খাবেন।',
          },
          {
            label: '২ চামচ (১০ মি.লি.) দিনে ৩ বার',
            text: 'বোতল ভালো করে ঝাঁকিয়ে ২ চামচ (১০ মি.লি.) করে দিনে ৩ বার খাবারের পরে খাবেন।',
          },
          {
            label: '১ চামচ দিনে ২ বার',
            text: 'বোতল ঝাঁকিয়ে ১ চামচ (৫ মি.লি.) করে দিনে ২ বার খাবারের পর সেব্য।',
          },
          {
            label: 'খাবারের পূর্বে ১ চামচ',
            text: 'খাবারের ১৫-৩০ মিনিট পূর্বে ১ চামচ করে খাবেন।',
          },
          {
            label: 'জ্বর বা ব্যথায় ১ চামচ (SOS)',
            text: 'জ্বর বা ব্যথা অনুভূত হলে ১ চামচ (৫ মি.লি.) করে খাবেন (সর্বোচ্চ ৪ বার)।',
          },
        ],
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
        defaultSpecialInstructions: 'জ্বর ১০১°F এর বেশি বা তীব্র ব্যথায় ১টি করে সাপোজিটরি পায়ুপথে ব্যবহার করবেন।',
        routeOptions: ['পায়ুপথে (Per Rectum)'],
        instructionPresets: [
          {
            label: 'জ্বর ১০১°F বেশি হলে পায়ুপথে',
            text: 'জ্বর ১০১°F এর বেশি হলে ১টি করে সাপোজিটরি পায়ুপথে ব্যবহার করবেন (কমপক্ষে ৬ ঘণ্টা পর পর)।',
          },
          {
            label: 'তীব্র ব্যথায় পায়ুপথে (SOS)',
            text: 'তীব্র ব্যথা হলে ১টি সাপোজিটরি পায়ুপথে ব্যবহার করবেন।',
          },
          {
            label: 'পায়খানা না হলে ১টি পায়ুপথে',
            text: 'কোষ্ঠকাঠিন্য বা পায়খানা না হলে ১টি সাপোজিটরি পায়ুপথে ব্যবহার করবেন।',
          },
          {
            label: 'প্রতি ১২ ঘণ্টা পর পর ১টি',
            text: 'প্রতি ১২ ঘণ্টা পর পর ১টি করে সাপোজিটরি পায়ুপথে ব্যবহার করবেন।',
          },
        ],
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
        defaultSpecialInstructions: 'প্রতি রাতে শোবার সময় ১টি করে সাপোজিটরি/ট্যাবলেট যোনিপথে ব্যবহার করবেন।',
        routeOptions: ['যোনিপথে (Per Vaginam)'],
        instructionPresets: [
          {
            label: 'রাতে শোবার সময় যোনিপথে (৭ দিন)',
            text: 'প্রতি রাতে শোবার সময় ১টি করে সাপোজিটরি যোনিপথে ব্যবহার করবেন (টানা ৭ দিন)।',
          },
          {
            label: 'রাতে শোবার সময় যোনিপথে (১৪ দিন)',
            text: 'প্রতি রাতে শোবার সময় ১টি করে সাপোজিটরি যোনিপথে ব্যবহার করবেন (টানা ১৪ দিন)।',
          },
          {
            label: 'অ্যাপ্লিকেটর দিয়ে প্রবেশ করাবেন',
            text: 'শুয়ে হাঁটু ভাঁজ করে অ্যাপ্লিকেটরের সাহায্যে যোনিপথে গভীরভাবে প্রবেশ করাবেন।',
          },
          {
            label: 'সপ্তাহে ১টি করে যোনিপথে',
            text: 'সপ্তাহে ১ বার রাতে শোবার সময় ১টি করে ট্যাবলেট যোনিপথে দিবেন।',
          },
          {
            label: 'মাসিকের সময়ও বন্ধ করবেন না',
            text: 'মাসিক চলাকালীন সময়েও চিকিৎসকের পরামর্শ অনুযায়ী ওষুধ ব্যবহার অব্যাহত রাখবেন।',
          },
        ],
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
        defaultSpecialInstructions: 'শিরায় (IV) ধীরে ধীরে পুশ করতে হবে (অথবা চিকিৎসকের তত্ত্বাবধানে)।',
        routeOptions: [
          'শিরায় (IV)',
          'মাংসে (IM)',
          'ত্বকের নিচে (SC)',
          'IV ইনফিউশন (স্যালাইনে)',
          'গভীর মাংসে (Deep IM)',
        ],
        instructionPresets: [
          {
            label: 'শিরায় (IV) ধীরে ধীরে দিনে ১ বার',
            text: 'শিরায় (IV) ধীরে ধীরে পুশ করতে হবে — দিনে ১ বার।',
          },
          {
            label: 'শিরায় (IV) ধীরে ধীরে দিনে ২ বার',
            text: 'শিরায় (IV) ধীরে ধীরে পুশ করতে হবে — ১২ ঘণ্টা পর পর দিনে ২ বার।',
          },
          {
            label: 'মাংসে (IM) পুশ করতে হবে',
            text: 'গভীর মাংসে (Deep IM) পুশ করতে হবে — দিনে ১ বার।',
          },
          {
            label: '১০০ মি.লি. স্যালাইনে ধীরে ধীরে চলবে',
            text: '১০০ মি.লি. নরমাল স্যালাইনে মিশিয়ে শিরায় ধীরে ধীরে ইনফিউশন দিতে হবে।',
          },
          {
            label: 'ত্বকের নিচে (SC) পুশ করবেন',
            text: 'পেটের ত্বকের নিচে (SC) ইনসুলিন সিরিঞ্জ দিয়ে পুশ করবেন।',
          },
          {
            label: 'টেস্ট ডোজ দেখে ইনজেকশন দিন',
            text: 'অ্যালার্জি টেস্ট ডোজ (Skin sensitivity test) দেখে নিশ্চিত হয়ে ইনজেকশন দিতে হবে।',
          },
          {
            label: 'তীব্র ব্যথায় জরুরি প্রয়োজনে (SOS)',
            text: 'তীব্র ব্যথায় জরুরি প্রয়োজনে ১টি অ্যাম্পুল মাংসে/শিরায় পুশ করবেন।',
          },
        ],
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
        defaultSpecialInstructions: '১-২ ফোঁটা করে আক্রান্ত চোখে দিনে ৩-৪ বার দিবেন।',
        routeOptions: [
          'চোখে (Eye)',
          'কানে (Ear)',
          'নাকে (Nasal)',
          'আক্রান্ত চোখে ও কানে',
        ],
        instructionPresets: [
          {
            label: '১-২ ফোঁটা চোখে দিনে ৩-৪ বার',
            text: '১-২ ফোঁটা করে দুই চোখে দিনে ৩-৪ বার দিবেন।',
          },
          {
            label: '২-৩ ফোঁটা কানে দিনে ৩ বার',
            text: '২-৩ ফোঁটা করে আক্রান্ত কানে দিনে ৩ বার দিবেন এবং কিছুক্ষণ মাথা কাত করে রাখবেন।',
          },
          {
            label: '১-২ ড্রপ/পাফ নাকে দিনে ২ বার',
            text: '১-২ ড্রপ বা পাফ করে দুই নাসারন্ধ্রে দিনে ২ বার দিবেন।',
          },
          {
            label: 'ড্রপার স্পর্শ করবেন না',
            text: 'ড্রপারের মুখ হাত বা চোখের পাতার সাথে স্পর্শ করবেন না। খোলার ১ মাস পর ব্যবহার নিষেধ।',
          },
        ],
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
        defaultSpecialInstructions: '১-২ পাফ করে দিনে ২ বার বুক ভরে টেনে নিবেন এবং মুখ ভালো করে কুলি করবেন।',
        routeOptions: [
          'শ্বাস টেনে (Inhalation)',
          'স্পেসারের সাহায্যে',
          'নেবুলাইজারের মাধ্যমে',
        ],
        instructionPresets: [
          {
            label: '১-২ পাফ দিনে ২ বার + কুলি',
            text: '১-২ পাফ করে দিনে ২ বার টেনে নিবেন এবং ব্যবহারের পর মুখ ভালো করে কুলি করে ধুয়ে ফেলবেন।',
          },
          {
            label: 'শ্বাসকষ্ট হলে ১-২ পাফ (SOS)',
            text: 'তীব্র শ্বাসকষ্ট শুরু হলে সাথে সাথে ১-২ পাফ টেনে নিবেন (জরুরি প্রয়োজনে)।',
          },
          {
            label: 'স্পেসার দিয়ে টেনে নিবেন',
            text: 'স্পেসার (Spacer) ডিভাইসের সাথে লাগিয়ে ধীরে ধীরে বুক ভরে শ্বাস টেনে নিবেন।',
          },
        ],
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
        instructionPresets: [
          {
            label: 'খাবারের ৩০ মি. পূর্বে খালি পেটে',
            text: 'খাবারের ৩০-৬০ মিনিট পূর্বে এক গ্লাস পানিসহ খালি পেটে সেব্য।',
          },
          {
            label: 'খাবারের পরপরই ভরা পেটে',
            text: 'খাবারের ঠিক পরপরই ভরা পেটে এক গ্লাস পানি দিয়ে খাবেন।',
          },
          {
            label: 'রাতে শোবার পূর্বে',
            text: 'রাতে খাবারের পর শোবার পূর্বে সেব্য।',
          },
          {
            label: 'চুষে খাবেন',
            text: 'চিবিয়ে বা গিলে না খেয়ে মুখে রেখে ধীরে ধীরে চুষে খাবেন।',
          },
          {
            label: 'চিবিয়ে খাবেন',
            text: 'ভালোভাবে চিবিয়ে খেয়ে সামান্য পানি পান করবেন।',
          },
          {
            label: 'এক গ্লাস পানিতে গুলিয়ে',
            text: 'এক গ্লাস পানিতে পুরো প্যাকেট ভালো করে গুলিয়ে সাথে সাথে পান করবেন।',
          },
        ],
      };
  }
}
