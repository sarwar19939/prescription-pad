import type { DiseaseProtocolTemplate } from './types';

export const GASTRO_UPPER_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'pud-gerd-gastritis',
    title: 'Peptic Ulcer Disease & GERD',
    titleBn: 'গ্যাস্ট্রিক আলসার, বুকজ্বালা ও এসিডিটি',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['pud', 'gerd', 'gastric', 'acidity', 'গ্যাস্ট্রিক', 'বুক জ্বালাপোড়া', 'heartburn', 'peptic ulcer'],
    description: 'Proton-pump inhibitor acid suppression, prokinetic motility, and cytoprotective antacid.',
    descriptionBn: 'উন্নত পিপিআই, প্রো-কাইনেটিক এবং অ্যান্টাসিড কম্বিনেশন থেরাপি।',
    medicines: [
      {
        brand_name: 'Sergel',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14-28 Days', special_instructions: 'খাবারের ৩০-৬০ মিনিট পূর্বে খালি পেটে গিলে খাবেন।' },
        pediatric: { dosage_form: 'Syr', strength: '20 mg/sachet', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'পানিতে মিশিয়ে সকালে খালি পেটে।' },
      },
      {
        brand_name: 'Motigut',
        generic_name: 'Domperidone',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '7-14 Days', special_instructions: 'খাবারের ১৫-২০ মিনিট আগে সেব্য বমি বমি ভাব ও বুক জ্বালা রোধে।' },
      },
      {
        brand_name: 'Entacyd Plus',
        generic_name: 'Magaldrate + Simethicone',
        adult: { dosage_form: 'Syr', strength: '200 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাবারের ১ ঘণ্টা পর এবং রাতে শোয়ার সময় ২ চামচ।' },
      },
    ],
    adviceBn: [
      'খাওয়ার পরপরই শুয়ে পড়বেন না, অন্তত ২ ঘণ্টা পর ঘুমাতে যান।',
      'ধূমপান, চা, কফি, অতিরিক্ত তেল-মসলা ও কোমল পানীয় সম্পূর্ণ পরিহার করুন।',
      'রাতে ঘুমানোর সময় মাথার দিক সামান্য উঁচু (৬ ইঞ্চি) রাখুন।',
    ],
  },
  {
    id: 'h-pylori-eradication',
    title: 'H. Pylori Eradication (Standard 14-Day Triple Therapy)',
    titleBn: 'এইচ. পাইলোরি নির্মূল চিকিৎসা (১৪ দিনের ট্রিপল থেরাপি)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['h pylori', 'helicobacter pylori', 'hpylori', 'chronic gastric ulcer'],
    description: 'PPI + Clarithromycin + Amoxicillin 14-day standard eradication protocol.',
    descriptionBn: '১৪ দিনের উচ্চ কার্যকারিতাসম্পন্ন ব্যাকটেরিয়া নির্মূল কোর্স।',
    medicines: [
      {
        brand_name: 'Maxpro',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '40 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'সকাল ও রাতে খালি পেটে।' },
      },
      {
        brand_name: 'Moxacil',
        generic_name: 'Amoxicillin',
        adult: { dosage_form: 'Cap', strength: '1 g', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'প্রতিদিন সকাল ও রাতে ১ গ্রাম করে।' },
      },
      {
        brand_name: 'Claripex',
        generic_name: 'Clarithromycin',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'সকাল ও রাতে ১টি করে।' },
      },
    ],
    adviceBn: [
      '১৪ দিনের সম্পূর্ণ কোর্স কোনো অবস্থাতেই একদিনের জন্যও বাদ দেওয়া যাবে না।',
      'কোর্স শেষ করার ৪ সপ্তাহ পর স্টুল অ্যান্টিজেন টেস্ট করে নিরাময় নিশ্চিত করুন।',
    ],
  },
  {
    id: 'nafld-fatty-liver',
    title: 'Non-Alcoholic Fatty Liver Disease (Grade 1-2)',
    titleBn: 'ফ্যাটি লিভার (যকৃতে চর্বি জমা)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['fatty liver', 'nafld', 'ফ্যাটি লিভার', 'hepatic steatosis'],
    description: 'Antioxidant, cytoprotective bile acid and progressive weight loss counseling.',
    descriptionBn: 'লিভারের সুরক্ষা, চর্বি কমানো ও জীবনযাত্রার পরিবর্তন।',
    medicines: [
      {
        brand_name: 'Ursochol',
        generic_name: 'Ursodeoxycholic Acid',
        adult: { dosage_form: 'Tab', strength: '300 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '60-90 Days', special_instructions: 'লিভার এনজাইম স্বাভাবিক করতে খাবারের পর সেব্য।' },
      },
      {
        brand_name: 'E-Gel',
        generic_name: 'Vitamin E (Alpha Tocopherol)',
        adult: { dosage_form: 'Cap', strength: '400 IU', schedule: '1+0+0', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'অ্যান্টিঅক্সিডেন্ট হিসেবে সকালে ১টি।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন অন্তত ৪০ মিনিট ঘাম ঝরিয়ে জোরে হাঁটুন।',
      'চিনি, মিষ্টি, সফট ড্রিংকস ও অতিরিক্ত ভাত/কার্বোহাইড্রেট সম্পূর্ণ কমিয়ে দিন।',
      'শরীরের অতিরিক্ত ওজনের ৭-১০% ওজন কমালে লিভারের চর্বি উল্লেখযোগ্যভাবে কমে।',
    ],
  },
  {
    id: 'acute-viral-hepatitis-supportive',
    title: 'Acute Viral Hepatitis (A or E supportive)',
    titleBn: 'ভাইরাল জন্ডিস (হেপাটাইটিস এ বা ই)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['jaundice', 'hepatitis', 'জন্ডিস', 'yellow urine with fatigue'],
    description: 'Conservative hepatic supportive care, antiemetic, avoiding hepatotoxic drugs.',
    descriptionBn: 'সম্পূর্ণ বিশ্রাম, শর্করা সমৃদ্ধ খাদ্য ও লিভারের স্বাভাবিক নিরাময়।',
    medicines: [
      {
        brand_name: 'Silymarin',
        generic_name: 'Silymarin Herbal Extract',
        adult: { dosage_form: 'Cap', strength: '140 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'যকৃতের কোষে সুরক্ষা প্রদান করে।' },
      },
      {
        brand_name: 'Palgon',
        generic_name: 'Ondansetron',
        adult: { dosage_form: 'Tab', strength: '8 mg', schedule: '1+0+1 (SOS)', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'বমি বমি ভাব থাকলে খাবারের আধ ঘণ্টা আগে।' },
      },
    ],
    adviceBn: [
      'সম্পূর্ণ কায়িক বিশ্রাম নিন, কোনো অবস্থাতেই ভারী কাজ করবেন না।',
      'কবিরাজি, ঝাড়ফুঁক বা কড়া কোনো ওষুধ লিভার ফেইলিওরের ঝুঁকি বাড়িয়ে দেয়—বর্জন করুন।',
      'গ্লুকোজ পানি, আখের গুঁড়, ফলের রস ও সহজে হজমযোগ্য খাবার খান।',
    ],
  },
  {
    id: 'functional-dyspepsia',
    title: 'Functional Dyspepsia / Indigestion',
    titleBn: 'বদহজম ও পেট ফাঁপা (ইনডাইজেশন)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['dyspepsia', 'indigestion', 'বদহজম', 'early satiety', 'fullness after eating'],
    description: 'Digestive enzyme supplementation with prokinetic agents.',
    descriptionBn: 'হজম সহায়ক এনজাইম ও পেটের ফাঁপা ভাব দূরীকরণ।',
    medicines: [
      {
        brand_name: 'Enzystar',
        generic_name: 'Pancreatin Digestive Enzyme',
        adult: { dosage_form: 'Tab', strength: 'Standard', schedule: '1+1+1', meal_timing: 'With Meal', duration: '14 Days', special_instructions: 'ভারী খাবারের ঠিক মাঝামাঝি সময়ে সেবন করুন।' },
      },
      {
        brand_name: 'Disopan',
        generic_name: 'Simethicone',
        adult: { dosage_form: 'Tab', strength: '40 mg', schedule: '1+1+1 (Chewable)', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'পেটের গ্যাস কমাতে চিবিয়ে খাওয়ার ট্যাবলেট।' },
      },
    ],
    adviceBn: [
      'একসাথে বেশি খাবার না খেয়ে অল্প অল্প করে দিনে ৪-৫ বার খান।',
      'খাবার ভালোভাবে চিবিয়ে খান ও খাওয়ার মাঝে অতিরিক্ত পানি পান করবেন না।',
    ],
  },
];
