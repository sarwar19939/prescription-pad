import type { DiseaseProtocolTemplate } from './types';

export const CARDIO_HYPERTENSION_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'hypertension-stage-1',
    title: 'Essential Hypertension (Stage 1 / Initial)',
    titleBn: 'উচ্চ রক্তচাপ (প্রাথমিক পর্যায় - স্টেজ ১)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['hypertension', 'htn', 'high bp', 'উচ্চ রক্তচাপ', 'প্রেসার'],
    description: 'First-line monotherapy with ARB or CCB, DASH diet and sodium restriction.',
    descriptionBn: 'প্রথম সারির এআরবি/সিসিবি অ্যান্টিহাইপারটেনসিভ ও লবণমুক্ত জীবনযাত্রা।',
    medicines: [
      {
        brand_name: 'Camlosart',
        generic_name: 'Amlodipine + Olmesartan',
        adult: { dosage_form: 'Tab', strength: '5/20 mg', schedule: '1+0+0', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'প্রতিদিন সকালে নির্দিষ্ট সময়ে ১টি।' },
      },
    ],
    adviceBn: [
      'খাবারের সাথে কাঁচা লবণ সম্পূর্ণ বর্জন করুন ও রান্নায় লবণের পরিমাণ অর্ধেক করুন।',
      'প্রতিদিন অন্তত ৩০ মিনিট নিয়মিত জোরে হাঁটুন।',
      'প্রতি সপ্তাহে অন্তত একবার একই সময়ে রক্তচাপ মেপে লিখে রাখুন।',
    ],
  },
  {
    id: 'hypertension-stage-2',
    title: 'Hypertension (Stage 2 / Dual Drug Regimen)',
    titleBn: 'তীব্র উচ্চ রক্তচাপ (স্টেজ ২ কম্বিনেশন থেরাপি)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['stage 2 hypertension', 'severe htn', 'উচ্চ রক্তচাপ ২', 'bp > 160/100'],
    description: 'Dual agent therapy (ARB + Thiazide diuretic or ARB + CCB).',
    descriptionBn: 'দ্বৈত অ্যান্টিহাইপারটেনসিভ কম্বিনেশন ও অঙ্গের সুরক্ষা।',
    medicines: [
      {
        brand_name: 'Telma-H',
        generic_name: 'Telmisartan + Hydrochlorothiazide',
        adult: { dosage_form: 'Tab', strength: '40/12.5 mg', schedule: '1+0+0', meal_timing: 'Anytime', duration: '30-60 Days', special_instructions: 'সকালে নাস্তার পর ১টি।' },
      },
      {
        brand_name: 'Amlong',
        generic_name: 'Amlodipine',
        adult: { dosage_form: 'Tab', strength: '5 mg', schedule: '0+0+1', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'রাতে শোয়ার আগে ১টি।' },
      },
    ],
    adviceBn: [
      'ওষুধ কখনোই ডাক্তারের পরামর্শ ছাড়া হঠাৎ বন্ধ করবেন না (স্ট্রোকের মারাত্মক ঝুঁকি)।',
      'তীব্র মাথাব্যথা, চোখে ঝাপসা দেখা বা বুকে চাপ অনুভূত হলে দ্রুত হাসপাতালে যাবেন।',
    ],
  },
  {
    id: 'isolated-systolic-htn-elderly',
    title: 'Isolated Systolic Hypertension (Elderly)',
    titleBn: 'বয়স্কদের সিস্টোলিক উচ্চ রক্তচাপ',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['isolated systolic hypertension', 'elderly htn', 'systolic bp high with normal diastolic'],
    description: 'Dihydropyridine calcium channel blocker or indapamide for stiff arteries.',
    descriptionBn: 'ধমনীর শক্ত হয়ে যাওয়া রোধে অ্যামলোডিপাইন বা ক্লোরথ্যালিডন।',
    medicines: [
      {
        brand_name: 'Amlopin',
        generic_name: 'Amlodipine',
        adult: { dosage_form: 'Tab', strength: '5 mg', schedule: '1+0+0', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'সকালে অথবা দুপুরে ১টি।' },
      },
    ],
    adviceBn: [
      'শোয়া থেকে হঠাৎ উঠে দাঁড়াবেন না, এতে মাথা ঘুরে পড়ে যাওয়ার ঝুঁকি থাকে।',
      'নিয়মিত পায়ের গোড়ালি ফোলে কি না লক্ষ্য রাখুন।',
    ],
  },
  {
    id: 'hypertension-with-diabetes-ckd',
    title: 'Hypertension with Diabetes / Microalbuminuria',
    titleBn: 'ডায়াবেটিস ও কিডনি সুরক্ষাসহ উচ্চ রক্তচাপ',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['diabetic hypertension', 'htn with diabetes', 'microalbuminuria with htn', 'hypertension ckd'],
    description: 'Renoprotective ARB or ACE-inhibitor based blood pressure regimen.',
    descriptionBn: 'কিডনির ছাঁকনি ও রক্তনালী সুরক্ষায় টেলমিসারটান বা লসারটান ভিত্তিক থেরাপি।',
    medicines: [
      {
        brand_name: 'Telmi',
        generic_name: 'Telmisartan',
        adult: { dosage_form: 'Tab', strength: '40 mg', schedule: '1+0+0', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'সকালে নাস্তার পর নিয়মিত সেব্য।' },
      },
      {
        brand_name: 'Forxiga',
        generic_name: 'Dapagliflozin',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+0+0', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'কিডনি ও হার্টের সুরক্ষায় সেব্য।' },
      },
    ],
    adviceBn: [
      'প্রতি ৩-৬ মাস পর পর সিরাম ক্রিয়েটিনিন ও ইউরিন মাইক্রোঅ্যালবুমিন পরীক্ষা করান।',
      'লবণ পরিহার করুন ও রক্তের গ্লুকোজ কঠোর নিয়ন্ত্রণে রাখুন।',
    ],
  },
  {
    id: 'orthostatic-hypotension',
    title: 'Postural / Orthostatic Hypotension',
    titleBn: 'দাঁড়ালে মাথা ঘোরা ও লো প্রেশার (অর্থোস্ট্যাটিক হাইপোটেনশন)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['orthostatic hypotension', 'postural dizziness', 'low bp standing'],
    description: 'Volume expansion, salt intake optimization, compression and fludrocortisone if refractory.',
    descriptionBn: 'পর্যাপ্ত পানি-লবণ গ্রহণ ও শোয়া থেকে আস্তে ওঠার অভ্যাস।',
    medicines: [
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Syr', strength: '500 ml', schedule: '1+1+1', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'রক্তের ভলিউম বাড়াতে তরল স্যালাইন।' },
      },
    ],
    adviceBn: [
      'বিছানা থেকে ওঠার সময় প্রথমে ৩ মিনিট বসে থাকুন, তারপর আস্তে দাঁড়ান।',
      'প্রচুর পরিমাণে পানি ও তরল খাবার পান করুন।',
    ],
  },
];
