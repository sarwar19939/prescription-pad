import type { DiseaseProtocolTemplate } from './types';

export const UROLOGY_LOWER_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'acute-uncomplicated-uti-cystitis',
    title: 'Acute Uncomplicated UTI / Cystitis (Burning Micturition)',
    titleBn: 'প্রস্রাবের ইনফেকশন ও তীব্র জ্বালাপোড়া (ইউটিআই / সিস্টাইটিস)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['uti', 'urinary tract infection', 'ইউটিআই', 'burning micturition', 'dysuria', 'প্রস্রাবে জ্বালাপোড়া'],
    description: 'Nitrofurantoin / Fosfomycin targeted urinary antimicrobial + urinary alkalinizer.',
    descriptionBn: 'নাইট্রোফিউরানটয়েন ক্যাপসুল ও প্রস্রাবের জ্বালাপোড়া নিবারণে সাইট্রেট দ্রবণ।',
    medicines: [
      {
        brand_name: 'Nifuran',
        generic_name: 'Nitrofurantoin (Macrobid)',
        adult: { dosage_form: 'Cap', strength: '100 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '5-7 Days', special_instructions: 'খাবারের সাথে ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Citrosol',
        generic_name: 'Disodium Hydrogen Citrate Liquid',
        adult: { dosage_form: 'Syr', strength: 'Standard', schedule: '2 spoons TDS with water', meal_timing: 'After Meal', duration: '5 Days', special_instructions: '১ গ্লাস পানিতে ২ চামচ মিশিয়ে দিনে ৩ বার পান করুন।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন অন্তত ৩ থেকে ৩.৫ লিটার পানি ও তরল খাবার পান করুন।',
      'প্রস্রাবের বেগ আটকে রাখবেন না; প্রতি ৩-৪ ঘণ্টা পরপর প্রস্রাব করুন।',
      'স্ত্রী-রোগীদের ক্ষেত্রে শৌচকার্যের সময় সবসময় সামনে থেকে পেছনের দিকে পানি ব্যবহার করতে হবে।',
    ],
  },
  {
    id: 'recurrent-uti-prophylaxis',
    title: 'Recurrent UTI Prophylaxis & Prevention Protocol',
    titleBn: 'ঘন ঘন প্রস্রাবের ইনফেকশন প্রতিরোধ (ক্র্যানবেরি ও প্রোবায়োটিক)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['recurrent uti', 'frequent uti', 'বারবার প্রস্রাবে ইনফেকশন', 'cranberry uti'],
    description: 'Cranberry extract PAC (proanthocyanidins) + D-mannose bacterial anti-adhesion therapy.',
    descriptionBn: 'ক্র্যানবেরি ও ডি-ম্যানোজ দিয়ে ব্যাকটেরিয়া মূত্রথলির দেয়ালে আটকে থাকা প্রতিরোধ।',
    medicines: [
      {
        brand_name: 'Urocare Cranberry',
        generic_name: 'Cranberry Extract + D-Mannose',
        adult: { dosage_form: 'Cap', strength: 'Standard', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30-60 Days', special_instructions: 'প্রচুর পানিসহ সকাল ও রাতে সেব্য।' },
      },
    ],
    adviceBn: [
      'সহবাসের পরপরই প্রস্রাব করে এক গ্লাস পানি পান করার অভ্যাস করুন।',
      'সুতির ঢিলেঢালা অন্তর্বাস ব্যবহার করুন ও সুগন্ধি সাবান যোনিপথে ব্যবহার পরিহার করুন।',
    ],
  },
  {
    id: 'bph-lower-urinary-symptoms',
    title: 'Benign Prostatic Hyperplasia (BPH / Prostate Enlargement)',
    titleBn: 'প্রস্টেট গ্রন্থি বৃদ্ধি ও প্রস্রাবের দুর্বল ধারা (বিপিএইচ)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['bph', 'prostate', 'প্রস্টেট', 'poor urinary stream', 'hesitancy urine'],
    description: 'Dual combination Alpha-1 blocker (Tamsulosin) + 5-Alpha reductase inhibitor (Dutasteride).',
    descriptionBn: 'ট্যামসুলোসিন ও ডুটাস্টেরাইড কম্বিনেশন দিয়ে প্রস্টেট সঙ্কোচন ও প্রস্রাব সহজীকরণ।',
    medicines: [
      {
        brand_name: 'Tamzel-D',
        generic_name: 'Tamsulosin + Dutasteride',
        adult: { dosage_form: 'Cap', strength: '0.4/0.5 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'প্রতিদিন রাতের খাবারের ৩০ মিনিট পর নির্দিষ্ট সময়ে ১টি।' },
      },
    ],
    adviceBn: [
      'সন্ধ্যা ৭টার পর অতিরিক্ত পানি, চা বা কফি পান করবেন না (রাতের প্রস্রাব কমাতে)।',
      'প্রস্রাবের বেগ হলে অতিরিক্ত চাপ দিয়ে করবেন না, স্বাভাবিকভাবে খালি হতে দিন।',
      'প্রস্রাব পুরোপুরি বন্ধ হয়ে গেলে জরুরিভাবে হাসপাতালে ক্যাথিটার করাতে হবে।',
    ],
  },
  {
    id: 'erectile-dysfunction-pde5i',
    title: 'Erectile Dysfunction (Organic / Psychogenic Vasogenic)',
    titleBn: 'পুরুষের যৌন দুর্বলতা ও উত্থানজনিত সমস্যা (ইডি)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['erectile dysfunction', 'ed', 'যৌন দুর্বলতা', 'impotence', 'sexual weakness'],
    description: 'Phosphodiesterase-5 inhibitor (Tadalafil/Sildenafil). Strict contraindication with nitrates.',
    descriptionBn: 'ট্যাডালাফিল থেরাপি ও নাইট্রোগ্লিসারিন জাতীয় হার্টের ওষুধের সাথে সম্পূর্ণ নিষিদ্ধের সতর্কতা।',
    medicines: [
      {
        brand_name: 'Tadaval',
        generic_name: 'Tadalafil',
        adult: { dosage_form: 'Tab', strength: '5 mg', schedule: '0+0+1 (Once daily)', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'প্রতিদিন রাতে নির্দিষ্ট সময়ে ১টি।' },
      },
    ],
    adviceBn: [
      'হার্টের রোগী বা যারা বুকে ব্যথার নাইট্রোগ্লিসারিন স্প্রে/বড়ি ব্যবহার করেন তাদের জন্য এই ওষুধ সম্পূর্ণ নিষিদ্ধ।',
      'ধূমপান ত্যাগ করুন, ওজন কমান ও ডায়াবেটিস নিয়ন্ত্রণে রাখুন।',
    ],
  },
  {
    id: 'chronic-bacterial-prostatitis',
    title: 'Chronic Bacterial Prostatitis (Pelvic Pain in Men)',
    titleBn: 'ক্রনিক প্রস্টাটাইটিস (তলপেট ও অণ্ডকোষের নিচে ক্রনিক অস্বস্তি ও প্রস্রাবে ব্যথা)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['prostatitis', 'chronic pelvic pain men', 'প্রস্টাটাইটিস', 'perineal pain'],
    description: 'Lipophilic fluoroquinolone (Levofloxacin) with high prostatic tissue penetration for 4-6 weeks.',
    descriptionBn: 'প্রস্টেট টিস্যুতে পৌঁছানোর মতো উচ্চ ক্ষমতাসম্পন্ন লেভোফ্লক্সাসিন অ্যান্টিবায়োটিক কোর্স।',
    medicines: [
      {
        brand_name: 'Levomax',
        generic_name: 'Levofloxacin',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '28 Days', special_instructions: 'প্রতিদিন নির্দিষ্ট সময়ে ১ গ্লাস পানিসহ।' },
      },
      {
        brand_name: 'Uromax',
        generic_name: 'Tamsulosin Hydrochloride',
        adult: { dosage_form: 'Cap', strength: '0.4 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রাতে শোয়ার আগে।' },
      },
    ],
    adviceBn: [
      'টানা ঘণ্টার পর ঘণ্টা শক্ত চেয়ার বা সাইকেলে বসে থাকা এড়িয়ে চলুন (কুশন ব্যবহার করুন)।',
      'মদ্যপান ও অতিরিক্ত মসলাযুক্ত খাবার বর্জন করুন।',
    ],
  },
  {
    id: 'elderly-nocturia-frequency',
    title: 'Elderly Nocturia & Nighttime Urinary Frequency',
    titleBn: 'বয়স্কদের রাতে বারবার প্রস্রাবের বেগ ও ঘুম নষ্ট হওয়া',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['nocturia', 'night urination', 'রাতে ঘন ঘন প্রস্রাব', 'elderly frequent urination'],
    description: 'Evening fluid restriction, elevation of legs in late afternoon to reduce nocturia.',
    descriptionBn: 'সন্ধ্যার পর তরল গ্রহণ নিয়ন্ত্রণ ও বিকেলের দিকে পা উঁচুতে রাখার অভ্যাস।',
    medicines: [
      {
        brand_name: 'Frusid',
        generic_name: 'Furosemide',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+0 (Midday)', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'দুপুরে খাওয়ার পর ১টি (রাতে নয়)।' },
      },
    ],
    adviceBn: [
      'রাত ৮টার পর তরল খাবার, ডাবের পানি, চা বা অতিরিক্ত পানি পান করবেন না।',
      'বিকেলের দিকে ১ ঘণ্টা পা বালিশের ওপর উঁচুতে রাখুন যাতে পায়ের অতিরিক্ত পানি রাতে ওঠার আগেই প্রস্রাবে বের হতে পারে।',
    ],
  },
];
