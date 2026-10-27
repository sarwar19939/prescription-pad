import type { DiseaseProtocolTemplate } from './types';

export const DERM_INFECTIONS_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'scabies-permethrin',
    title: 'Scabies Infestation (Family / Household Protocol)',
    titleBn: 'খোসপাঁচড়া ও চুলকানি (স্ক্যাবিস পারিবারিক চিকিৎসা)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['scabies', 'খোসপাঁচড়া', 'পাঁচড়া', 'nocturnal itching', 'finger web itch', 'চুলকানি'],
    description: 'Permethrin 5% neck-down 8-14 hour overnight protocol with simultaneous family treatment.',
    descriptionBn: 'পারমেথ্রিন ৫% লোশন দিয়ে পরিবারের সকল সদস্যের একসাথে চিকিৎসা।',
    medicines: [
      {
        brand_name: 'Scabex Cream',
        generic_name: 'Permethrin Cream 5%',
        adult: { dosage_form: 'Oint', strength: '5%', schedule: 'Apply overnight once', meal_timing: 'Anytime', duration: 'Repeat day 7', special_instructions: 'গলার নিচ থেকে পায়ের আঙুল পর্যন্ত মেখে ৮-১২ ঘণ্টা পর সাবান দিয়ে ধুয়ে ফেলবেন। ৭ দিন পর পুনরায় লাগাবেন।' },
        pediatric: { dosage_form: 'Oint', strength: '5%', schedule: 'Apply neck down', meal_timing: 'Anytime', duration: 'Repeat day 7', special_instructions: 'বাচ্চাদের ক্ষেত্রে মাথার তালু সহ সারা শরীরে মেখে ৮ ঘণ্টা পর স্নান করান।' },
      },
      {
        brand_name: 'Fenadin',
        generic_name: 'Fexofenadine',
        adult: { dosage_form: 'Tab', strength: '120 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতের তীব্র চুলকানি কমাতে শোয়ার আগে ১টি।' },
        pediatric: { dosage_form: 'Syr', strength: '30 mg/5 ml', schedule: '0+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'রাতের চুলকানিতে মাপমতো।' },
      },
    ],
    adviceBn: [
      'লক্ষণ থাকুক বা না থাকুক, পরিবারের সকল সদস্যকে একই রাতে একসাথে ওষুধ ব্যবহার করতে হবে।',
      'ব্যবহৃত সকল জামাকাপড়, বিছানার চাদর ও তোয়ালে গরম পানিতে ফুটিয়ে কড়া রোদে শুকিয়ে ইস্ত্রি করুন।',
      'জীবাণু ধ্বংস হলেও চুলকানি আরও ২-৩ সপ্তাহ থাকতে পারে, এতে আতঙ্কিত হবেন না।',
    ],
  },
  {
    id: 'tinea-corporis-cruris',
    title: 'Tinea Corporis / Tinea Cruris (Ringworm / Fungal Infection)',
    titleBn: 'দাদ ও ছত্রাক সংক্রমণ (টিনিয়া করপোরেস / ক্রুরিস)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['tinea', 'fungal', 'দাদ', 'ringworm', 'ছত্রাক', 'groin itch', 'jock itch', 'tinea cruris'],
    description: 'Topical terbinafine/luliconazole and oral antifungal. Avoid steroid combination creams.',
    descriptionBn: 'স্টেরয়েড মিশ্রিত মলম সম্পূর্ণ বর্জন করে বিশুদ্ধ অ্যান্টিফাঙ্গাল চিকিৎসা।',
    medicines: [
      {
        brand_name: 'Lulider Cream',
        generic_name: 'Luliconazole Cream 1%',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: '1+0+0', meal_timing: 'Anytime', duration: '2-4 Weeks', special_instructions: 'দাদ আক্রান্ত স্থান ভালো করে ধুয়ে শুকিয়ে দাগের বাইরে ১ ইঞ্চি পর্যন্ত পাতলা করে লাগাবেন।' },
      },
      {
        brand_name: 'Tinasil',
        generic_name: 'Terbinafine Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14-28 Days', special_instructions: 'প্রতিদিন দুপুরে ভারী খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'কোনো অবস্থাতেই বেটনোভেট বা স্টেরয়েডযুক্ত মিশ্র মলম লাগাবেন না (দাদ ভয়াবহ ছড়িয়ে পড়ে)।',
      'আক্রান্ত স্থান সবসময় শুষ্ক ও বাতাস চলাচলযুক্ত রাখুন। সুতির ঢিলেঢালা অন্তর্বাস পরুন।',
      'দাগ মিলিয়ে যাওয়ার পরও অন্তত আরও ১ সপ্তাহ মলম ব্যবহার চালিয়ে যান।',
    ],
  },
  {
    id: 'pityriasis-versicolor',
    title: 'Pityriasis Versicolor (Tinea Versicolor / Chhuli)',
    titleBn: 'ছুলি ও পিঠের ছত্রাক সংক্রমণ',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['versicolor', 'chhuli', 'ছুলি', 'tinea versicolor', 'white patches on back'],
    description: 'Ketoconazole 2% wash lather technique and oral itraconazole if extensive.',
    descriptionBn: 'কিটোকোনাজল শ্যাম্পু দিয়ে গা ধোয়া ও অ্যান্টিফাঙ্গাল কোর্স।',
    medicines: [
      {
        brand_name: 'Dan-Off Shampoo',
        generic_name: 'Ketoconazole 2% Shampoo/Wash',
        adult: { dosage_form: 'Drop', strength: '2%', schedule: 'Twice weekly wash', meal_timing: 'Anytime', duration: '4 Weeks', special_instructions: 'গোসলের সময় আক্রান্ত স্থানে ফেনা করে ৫-১০ মিনিট রেখে ধুয়ে ফেলবেন।' },
      },
      {
        brand_name: 'Canditral',
        generic_name: 'Itraconazole',
        adult: { dosage_form: 'Cap', strength: '100 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '7 Days', special_instructions: 'ভারী খাবারের সাথে ক্যাপসুল গিলে খাবেন।' },
      },
    ],
    adviceBn: [
      'ঘাম দ্রুত মুছে ফেলুন ও ভেজা জামাকাপড় বেশিক্ষণ গায়ে রাখবেন না।',
      'ছুলির দাগ ভালো হওয়ার পরও চামড়ার স্বাভাবিক রঙ ফিরে আসতে কয়েকমাস সময় লাগতে পারে।',
    ],
  },
  {
    id: 'herpes-zoster-shingles',
    title: 'Herpes Zoster / Shingles (Burning Painful Rash)',
    titleBn: 'হার্পিস জোস্টার (দাদুরা / একপাশে তীব্র ব্যথাসহ ফোসকা)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['herpes zoster', 'shingles', 'দাদুরা', 'painful blisters on one side of chest'],
    description: 'High-dose oral acyclovir within 72 hours of onset and neuropathic pain control.',
    descriptionBn: '৭২ ঘণ্টার মধ্যে অ্যাসাইক্লোভির এবং স্নায়বিক ব্যথা নিরাময়।',
    medicines: [
      {
        brand_name: 'Zovirax',
        generic_name: 'Acyclovir',
        adult: { dosage_form: 'Tab', strength: '800 mg', schedule: '5 times daily (every 4 hrs)', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'দিনে ৫ বার (৪ ঘণ্টা পর পর) প্রচুর পানিসহ ৭ দিন নিয়ম মেনে সেব্য।' },
      },
      {
        brand_name: 'Prebel',
        generic_name: 'Pregabalin',
        adult: { dosage_form: 'Cap', strength: '50 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14-30 Days', special_instructions: 'পোস্ট-হার্পেটিক নিউরালজিয়ার তীব্র জ্বালাপোড়ায় রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'ফোসকার পানি অন্য কারো শরীরে লাগতে দেবেন না (বিশেষ করে গর্ভবতী নারী ও শিশুদের থেকে দূরে থাকুন)।',
      'আক্রান্ত স্থানে ক্যালামাইন লোশন মেখে ঠাণ্ডা রাখুন, কোনো গরম সেঁক দেবেন না।',
    ],
  },
  {
    id: 'impetigo-contagiosa',
    title: 'Impetigo Contagiosa (Honey-Colored Crusted Sores)',
    titleBn: 'ইমপেটিগো (বাচ্চাদের মুখে মধু রঙের ক্ষতের ব্যাকটেরিয়াল ইনফেকশন)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['impetigo', 'স্কিন ইনফেকশন', 'honey crusted sores', 'bacterial skin sores'],
    description: 'Topical mupirocin 2% with oral cephalexin/flucloxacillin for widespread lesions.',
    descriptionBn: 'মিউপিরোসিন মলম ও ওরাল ফ্লুক্লক্সাসিলিন অ্যান্টিবায়োটিক।',
    medicines: [
      {
        brand_name: 'Bactroban Ointment',
        generic_name: 'Mupirocin Ointment 2%',
        adult: { dosage_form: 'Oint', strength: '2%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '7-10 Days', special_instructions: 'ক্ষত কুসুম গরম পানি দিয়ে পরিষ্কার করে দিনে ২ বার মেখে দিন।' },
        pediatric: { dosage_form: 'Oint', strength: '2%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'ক্ষতের ওপর আলতো করে মেখে দিন।' },
      },
      {
        brand_name: 'Flugal',
        generic_name: 'Flucloxacillin',
        adult: { dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাবারের আধা ঘণ্টা আগে খালি পেটে।' },
        pediatric: { dosage_form: 'Syr', strength: '125 mg/5 ml', schedule: '1+1+1+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাবারের পূর্বে দিনে ৪ বার।' },
      },
    ],
    adviceBn: [
      'শিশুর নখ কেটে ছোট রাখুন যাতে চুলকিয়ে ক্ষত না বাড়ে।',
      'ক্ষতের ওপর তৈরি হওয়া আস্তরণ জোর করে টেনে তুলবেন না।',
    ],
  },
  {
    id: 'furunculosis-boils',
    title: 'Furunculosis / Boils (Staphylococcal Abscess)',
    titleBn: 'ফোড়া ও পুঁজযুক্ত ক্ষত (বয়েল / ফোরোঙ্কুলোসিস)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['boil', 'abscess', 'ফোড়া', 'furuncle', 'pus pimple on skin'],
    description: 'Oral anti-staphylococcal penicillin, warm compresses and drainage care.',
    descriptionBn: 'ফোড়ার তীব্র ব্যথা ও পুঁজ নিরাময়ে ফ্লুক্লক্সাসিলিন ও গরম সেঁক।',
    medicines: [
      {
        brand_name: 'Flupen',
        generic_name: 'Flucloxacillin',
        adult: { dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাবারের ৩০ মিনিট পূর্বে খালি পেটে।' },
      },
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ফোড়ার ব্যথায় সেব্য।' },
      },
    ],
    adviceBn: [
      'ফোড়া হাত দিয়ে টিপবেন না বা সুচ দিয়ে ফাটাবেন না।',
      'দিনে ২-৩ বার পরিষ্কার কাপড় দিয়ে হালকা গরম পানির সেঁক দিন।',
    ],
  },
  {
    id: 'cellulitis-mild-opd',
    title: 'Cellulitis (Mild Non-purulent Outpatient)',
    titleBn: 'সেলুলাইটিস (ত্বকের তীব্র লালচে ফোলা ও সংক্রমণ)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['cellulitis', 'সেলুলাইটিস', 'red swollen leg warm skin'],
    description: 'Oral beta-lactam coverage, leg elevation, and marking the border of erythema.',
    descriptionBn: 'পা উঁচু করে রাখা ও স্ট্রেপ্টোকক্কাল নির্মূলে ফ্লুক্লক্সাসিলিন কোর্স।',
    medicines: [
      {
        brand_name: 'Flugal',
        generic_name: 'Flucloxacillin',
        adult: { dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'Before Meal', duration: '10-14 Days', special_instructions: 'খালি পেটে প্রতি ৬ ঘণ্টায় ১টি।' },
      },
    ],
    adviceBn: [
      'কলম দিয়ে লালের সীমানা দাগ দিয়ে রাখুন; সীমানা দ্রুত বাড়লে হাসপাতালে যাবেন।',
      'আক্রান্ত পা বালিশের ওপর উঁচুতে রাখুন রক্ত চলাচল স্বাভাবিক রাখতে।',
    ],
  },
];
