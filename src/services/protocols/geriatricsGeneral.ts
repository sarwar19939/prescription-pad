import type { DiseaseProtocolTemplate } from './types';

export const GERIATRICS_GENERAL_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'nutritional-anemia-general-debility',
    title: 'Nutritional Anemia & General Weakness / Debility',
    titleBn: 'সাধারণ দুর্বলতা ও পুষ্টিহীনতাজনিত রক্তশূন্যতা',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['anemia', 'weakness', 'রক্তশূন্যতা', 'দুর্বলতা', 'fatigue', 'general debility', 'durbolota'],
    description: 'Comprehensive hematinic, active methylcobalamin, folic acid and zinc restoration.',
    descriptionBn: 'আয়রন, ফলিক এসিড, জিংক ও ভিটামিন বি-১২ সমৃদ্ধ পুনরুজ্জীবন চিকিৎসা।',
    medicines: [
      {
        brand_name: 'Fefol-CI',
        generic_name: 'Iron + Vitamin B-Complex + Vitamin C',
        adult: { dosage_form: 'Cap', strength: 'Standard', schedule: '1+0+0', meal_timing: 'After Meal', duration: '60-90 Days', special_instructions: 'প্রতিদিন দুপুরে ভারী খাবারের পর ১টি।' },
      },
      {
        brand_name: 'Neurobion Forte',
        generic_name: 'Vitamin B1 + B6 + B12 High Potency',
        adult: { dosage_form: 'Tab', strength: 'Standard', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'সকাল ও রাতে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'ডাল, ডিম, লাল শাক, কচু শাক, কাঁচকলা, কলিজা ও তাজা মৌসুমি ফলমূল নিয়মিত খান।',
      'খাবারের সাথে সাথে কড়া চা বা কফি পান করবেন না (চা খাবারের আয়রন নষ্ট করে দেয়)।',
      'প্রচুর বিশুদ্ধ পানি ও পুষ্টিকর খাবার গ্রহণ করুন।',
    ],
  },
  {
    id: 'chronic-fatigue-burnout',
    title: 'Chronic Fatigue & Physical Exhaustion',
    titleBn: 'অতিরিক্ত ক্লান্তি, শারীরিক অবসাদ ও দুর্বলতা',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['fatigue', 'exhaustion', 'অবসাদ', 'tiredness all day', 'low energy'],
    description: 'Coenzyme Q10 + Ginseng vitality supplementation with sleep hygiene.',
    descriptionBn: 'কো-এনজাইম কিউ-১০ ও জিনসেং এনার্জি সাপ্লিমেন্ট।',
    medicines: [
      {
        brand_name: 'CoQ10 Vital',
        generic_name: 'Coenzyme Q10 100mg',
        adult: { dosage_form: 'Cap', strength: '100 mg', schedule: '1+0+0', meal_timing: 'With Meal', duration: '30-60 Days', special_instructions: 'সকালে নাস্তার সাথে ১টি।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন অন্তত ৭ থেকে ৮ ঘণ্টা একটানা ঘুম নিশ্চিত করুন।',
      'কাজের মাঝে মাঝে বিশ্রাম নিন এবং হালকা স্ট্রেচিং বা ব্যায়াম করুন।',
    ],
  },
  {
    id: 'angular-cheilitis-mouth-corner',
    title: 'Angular Cheilitis (Cracked Painful Mouth Corners)',
    titleBn: 'ঠোঁটের কোণে ঘা বা ফেটে যাওয়া (অ্যাঙ্গুলার চিলাইটিস)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['angular cheilitis', 'cracked mouth corner', 'ঠোঁটের কোণে ঘা', 'mouth corner crack'],
    description: 'Riboflavin (Vitamin B2) supplementation + topical mupirocin/clotrimazole.',
    descriptionBn: 'রিবোফ্লাভিন ভিটামিন ঘাটতি পূরণ ও অ্যান্টিব্যাকটেরিয়াল মলম।',
    medicines: [
      {
        brand_name: 'B-2 / Riboflavin',
        generic_name: 'Riboflavin (Vitamin B2)',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'খাবারের পর দিনে ৩ বার।' },
      },
      {
        brand_name: 'Bactroban Ointment',
        generic_name: 'Mupirocin 2%',
        adult: { dosage_form: 'Oint', strength: '2%', schedule: 'Apply BD', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'ঠোঁটের দুই কোণে আলতো করে মেখে রাখুন।' },
      },
    ],
    adviceBn: [
      'জিহ্বা দিয়ে বারবার ঠোঁটের কোণ ভেজাবেন না (এতে ছত্রাক ও ব্যাকটেরিয়া বাড়ে)।',
      'দুধ, ডিম, সবুজ শাকসবজি ও বাদাম খাদ্যতালিকায় রাখুন।',
    ],
  },
  {
    id: 'telogen-effluvium-hair-fall',
    title: 'Telogen Effluvium (Excessive Hair Fall / Post-Infection Shedding)',
    titleBn: 'চুল পড়া ও চুল পাতলা হয়ে যাওয়া (টেলোজেন এফলুভিয়াম)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['hair fall', 'hair loss', 'চুল পড়া', 'telogen effluvium', 'alopecia'],
    description: 'Biotin + Zinc + Amino acid hair follicle nutrition with topical minoxidil.',
    descriptionBn: 'বায়োটিন, জিংক ও অ্যামাইনো এসিড সমৃদ্ধ চুলের ফলিকল পুষ্টি।',
    medicines: [
      {
        brand_name: 'Biotin Plus',
        generic_name: 'Biotin 5mg + Zinc 15mg',
        adult: { dosage_form: 'Tab', strength: '5 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'প্রতিদিন দুপুরে খাবারের পর ১টি করে টানা ৩ মাস।' },
      },
    ],
    adviceBn: [
      'ভেজা চুল জোরে তোয়ালে দিয়ে ঘষবেন না বা শক্ত করে বাঁধবেন না।',
      'প্রোটিনযুক্ত খাবার (মাছ, মাংস, ডিম, ডাল) ও প্রচুর শাকসবজি খান।',
      'কড়া রাসায়নিক হেয়ার কালার বা অতিরিক্ত হিট দেওয়া এড়িয়ে চলুন।',
    ],
  },
  {
    id: 'motion-sickness-travel',
    title: 'Motion Sickness / Travel Vomiting Prevention',
    titleBn: 'গাড়িতে উঠলে মাথা ঘোরা ও বমি (মোশন সিকনেস প্রতিরোধ)',
    category: 'ENT & Eye',
    diagnosisMatch: ['motion sickness', 'travel sickness', 'গাড়িতে বমি', 'car sickness'],
    description: 'Dimenhydrinate / Cinnarizine vestibular prophylaxis before travel.',
    descriptionBn: 'যাত্রার ৩০ মিনিট পূর্বে প্রতিরোধক ওষুধ সেবন।',
    medicines: [
      {
        brand_name: 'Stugeron',
        generic_name: 'Cinnarizine',
        adult: { dosage_form: 'Tab', strength: '25 mg', schedule: '1 tab 30 mins before travel', meal_timing: 'After Meal', duration: 'On demand', special_instructions: 'গাড়িতে ওঠার আধা ঘণ্টা আগে সেব্য।' },
      },
    ],
    adviceBn: [
      'গাড়ির পেছনের সিটে না বসে জানালার পাশের সামনের সিটে বসুন।',
      'চলন্ত গাড়িতে মোবাইল দেখা বা বই পড়া সম্পূর্ণ পরিহার করুন; দূরে দিগন্তের দিকে তাকান।',
    ],
  },
  {
    id: 'sarcopenia-elderly-muscle-loss',
    title: 'Sarcopenia & Muscle Wasting in Elderly',
    titleBn: 'বয়স্কদের পেশী ক্ষয় ও দুর্বলতা (সারকোপেনিয়া)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['sarcopenia', 'muscle wasting elderly', 'বয়স্কদের পেশী ক্ষয়', 'senile debility'],
    description: 'High-protein nutritional supplementation, branched-chain amino acids and resistance exercises.',
    descriptionBn: 'উচ্চমানের প্রোটিন, ক্যালসিয়াম-ভিটামিন ডি ও হালকা রেজিস্ট্যান্স ব্যায়াম।',
    medicines: [
      {
        brand_name: 'Calbo-D Forte',
        generic_name: 'Calcium Carbonate 600mg + Vitamin D3 400IU',
        adult: { dosage_form: 'Tab', strength: '600mg/400IU', schedule: '1+0+1', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'খাবারের পর সকাল ও রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন অন্তত ২টি ডিমের সাদা অংশ, এক গ্লাস দুধ ও ডাল খাদ্যতালিকায় রাখুন।',
      'প্রতিদিন চেয়ার থেকে ওঠা-বসার হালকা ব্যায়াম করুন পেশির শক্তি ধরে রাখতে।',
    ],
  },
  {
    id: 'geriatric-anorexia-loss-of-appetite',
    title: 'Senile Anorexia (Loss of Appetite in Elderly)',
    titleBn: 'বয়স্কদের অরুচি ও ক্ষুধামন্দা (খাবারে অনীহা)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['anorexia elderly', 'ক্ষুধামন্দা', 'loss of appetite', 'অরুচি', 'elderly not eating'],
    description: 'Zinc + Vitamin B-Complex appetite stimulation and small frequent nutrient-dense meals.',
    descriptionBn: 'জিঙ্ক ও ভিটামিন বি-কমপ্লেক্স দিয়ে রুচি বৃদ্ধি ও সহজপাচ্য পুষ্টি।',
    medicines: [
      {
        brand_name: 'Aristovit-B',
        generic_name: 'Vitamin B-Complex Syrup/Tablet',
        adult: { dosage_form: 'Syr', strength: 'Standard', schedule: '2 spoons BD', meal_timing: 'Before Meal', duration: '30 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে রুচি বাড়াতে।' },
      },
      {
        brand_name: 'Zincita',
        generic_name: 'Zinc Sulphate',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'স্বাদ ও রুচি ফেরাতে সকালে ১টি।' },
      },
    ],
    adviceBn: [
      'একসাথে বেশি খাবার না দিয়ে অল্প অল্প করে দিনে ৫-৬ বার পুষ্টিকর খাবার দিন।',
      'সুস্বাদু ও সহজে চিবানো যায় এমন নরম খাবার (যেমন: সুজি, নরম খিচুড়ি, পুডিং, ফল) খেতে দিন।',
    ],
  },
  {
    id: 'post-stroke-rehab-spasticity',
    title: 'Post-Stroke Hemiplegia & Spasticity Rehabilitation Support',
    titleBn: 'স্ট্রোক পরবর্তী অবশ অঙ্গের পুনর্বাসন ও মাংসপেশির শক্ত ভাব',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['post stroke', 'stroke rehab', 'স্ট্রোক', 'hemiplegia spasticity'],
    description: 'Muscle relaxant (Baclofen) for tone control + antiplatelet secondary prevention + physiotherapy.',
    descriptionBn: 'পেশির নমনীয়তায় ব্যাকলোফেন, স্ট্রোক প্রতিরোধে অ্যাসপিরিন ও ফিজিওথেরাপি।',
    medicines: [
      {
        brand_name: 'Baclof',
        generic_name: 'Baclofen',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'খাবারের পর সকাল ও রাতে সেব্য।' },
      },
      {
        brand_name: 'Ecosprin',
        generic_name: 'Aspirin (Enteric Coated)',
        adult: { dosage_form: 'Tab', strength: '75 mg', schedule: '0+1+0', meal_timing: 'After Meal', duration: 'Long term', special_instructions: 'দুপুরে ভরা পেটে নিয়মিত।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন নিয়ম মেনে ফিজিওথেরাপি করান এবং আক্রান্ত হাত-পায়ের জয়েন্ট নাড়াচাড়া করুন।',
      'রক্তচাপ ও সুগার নিয়মিত মেপে নিয়ন্ত্রণে রাখুন।',
    ],
  },
];
