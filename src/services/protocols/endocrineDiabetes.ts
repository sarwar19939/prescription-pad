import type { DiseaseProtocolTemplate } from './types';

export const ENDOCRINE_DIABETES_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 't2dm-initial-monotherapy',
    title: 'Type 2 Diabetes Mellitus (Initial Monotherapy)',
    titleBn: 'টাইপ ২ ডায়াবেটিস (প্রাথমিক মেটফরমিন থেরাপি)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['diabetes', 't2dm', 'type 2 diabetes', 'ডায়াবেটিস', 'high blood sugar'],
    description: 'First-line biguanide metformin titration, lifestyle modification and glycemic goals.',
    descriptionBn: 'প্রথম সারির মেটফরমিন থেরাপি ও শৃঙ্খলাবদ্ধ জীবনযাপন।',
    medicines: [
      {
        brand_name: 'Combit',
        generic_name: 'Metformin Hydrochloride (Extended Release)',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '0+0+1', meal_timing: 'With Meal', duration: '30-90 Days', special_instructions: 'রাতের প্রধান খাবারের ঠিক সাথে বা পরপরই সেব্য।' },
      },
    ],
    adviceBn: [
      'মিষ্টি, চিনি, মধু, গুড়, পেস্ট্রি, সফট ড্রিংকস ও ফাস্টফুড সম্পূর্ণ বর্জন করুন।',
      'প্রতিদিন নিয়ম করে অন্তত ৪৫ মিনিট দ্রুত হাঁটুন (সপ্তাহে কমপক্ষে ১৫০ মিনিট)।',
      'প্রতি ৩ মাস পর পর রক্তের তিন মাসের গড় HbA1c পরীক্ষা করান (টার্গেট < ৭.০%)।',
    ],
  },
  {
    id: 't2dm-dual-therapy-dpp4',
    title: 'Type 2 Diabetes (Dual Therapy Metformin + DPP-4 Inhibitor)',
    titleBn: 'ডায়াবেটিস কম্বিনেশন থেরাপি (মেটফরমিন ও লিনাগ্লিপটিন)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['t2dm uncontrolled', 'diabetes dual therapy', 'hba1c > 8', 'uncontrolled diabetes'],
    description: 'Weight-neutral, low-hypoglycemia risk DPP-4 inhibitor combination.',
    descriptionBn: 'ওজন না বাড়িয়ে এবং সুগার কমে যাওয়ার ঝুঁকি ছাড়াই দ্বৈত নিয়ন্ত্রণ।',
    medicines: [
      {
        brand_name: 'Linaglip-M',
        generic_name: 'Linagliptin + Metformin Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '2.5/500 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '60-90 Days', special_instructions: 'সকাল ও রাতে খাবারের সাথে ১টি করে।' },
      },
    ],
    adviceBn: [
      'কখনো খালি পেটে ভারী ব্যায়াম করবেন না।',
      'ব্যাগ বা পকেটে সবসময় ২-৩টি মিষ্টি চকলেট বা ক্যান্ডি রাখুন (সুগার কমে মাথা ঘুরলে খেতে হবে)।',
    ],
  },
  {
    id: 't2dm-sglt2-cardiorenal',
    title: 'Type 2 Diabetes with Cardio-Renal Risk (SGLT2 Inhibitor)',
    titleBn: 'ডায়াবেটিসে কিডনি ও হার্ট সুরক্ষা (এসজিএলটি২ ইনহিবিটর)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['t2dm ckd', 't2dm heart failure', 'empagliflozin', 'dapagliflozin'],
    description: 'Empagliflozin / Dapagliflozin cardioprotective and renoprotective regimen.',
    descriptionBn: 'প্রস্রাবের মাধ্যমে বাড়তি সুগার বের করে হার্ট ও কিডনিকে সুরক্ষিত রাখে।',
    medicines: [
      {
        brand_name: 'Jardiance',
        generic_name: 'Empagliflozin',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+0+0', meal_timing: 'Anytime', duration: '60 Days', special_instructions: 'সকালে নাস্তার পর ১টি।' },
      },
    ],
    adviceBn: [
      'প্রস্রাবের ইনফেকশন রোধে প্রচুর পানি পান করুন ও ব্যক্তিগত পরিচ্ছন্নতা বজায় রাখুন।',
      'তীব্র পানিশূন্যতা বা অসুস্থতার সময় ডাক্তারের পরামর্শ নিয়ে ওষুধ চালিয়ে যান।',
    ],
  },
  {
    id: 'prediabetes-lifestyle-metformin',
    title: 'Prediabetes / Impaired Fasting Glucose',
    titleBn: 'প্রি-ডায়াবেটিস (বর্ডারলাইন সুগার নিয়ন্ত্রণ)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['prediabetes', 'impaired fasting glucose', 'borderline diabetes', 'প্রি ডায়াবেটিস'],
    description: 'Intense lifestyle intervention with low-dose metformin to delay type 2 diabetes onset.',
    descriptionBn: 'ডায়াবেটিসের রূপান্তর ঠেকাতে ওজন নিয়ন্ত্রণ ও লো-ডোজ মেটফরমিন।',
    medicines: [
      {
        brand_name: 'Combit',
        generic_name: 'Metformin Hydrochloride (XR)',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '0+0+1', meal_timing: 'With Meal', duration: '90 Days', special_instructions: 'রাতে খাবারের সাথে ১টি।' },
      },
    ],
    adviceBn: [
      'শরীরের মোট ওজনের অন্তত ৫-৭% ওজন কমালে ডায়াবেটিস হওয়ার ঝুঁকি ৬০% কমে যায়।',
      'সাদা ভাতের পরিমাণ কমিয়ে সবুজ শাকসবজি ও সালাদের অনুপাত দ্বিগুণ করুন।',
    ],
  },
  {
    id: 'gestational-diabetes-opd',
    title: 'Gestational Diabetes Mellitus (GDM Outpatient)',
    titleBn: 'গর্ভকালীন ডায়াবেটিস (জিডিএম)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['gdm', 'gestational diabetes', 'গর্ভকালীন ডায়াবেটিস', 'pregnancy high sugar'],
    description: 'Strict medical nutrition therapy, fasting and post-prandial glycemic targets for pregnancy.',
    descriptionBn: 'মা ও শিশুর নিরাপত্তায় নিরাপদ গ্লাইসেমিক নিয়ন্ত্রণ ও পুষ্টি থেরাপি।',
    medicines: [
      {
        brand_name: 'Combit',
        generic_name: 'Metformin Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '30 Days', special_instructions: 'খাবারের সাথে সেব্য।' },
      },
    ],
    adviceBn: [
      'টার্গেট: খালি পেটে রক্তে সুগার ৫.৩ এর নিচে এবং খাওয়ার ২ ঘণ্টা পর ৬.৭ এর নিচে রাখা জরুরি।',
      'প্রতি সপ্তাহে ৩ দিন বাড়িতে গ্লুকোমিটার দিয়ে সুগার মাপুন ও রেকর্ড রাখুন।',
    ],
  },
];
