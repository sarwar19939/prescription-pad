import type { DiseaseProtocolTemplate } from './types';

export const ACUTE_EMERGENCY_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'dog-animal-bite-rabies-triage',
    title: 'Dog / Animal Bite (Rabies Post-Exposure Prophylaxis Category II/III)',
    titleBn: 'কুকুর বা বিড়ালের কামড় (জলাতঙ্ক প্রতিরোধ ও জরুরি চিকিৎসা)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['dog bite', 'animal bite', 'বিড়ালের কামড়', 'কুকুরের কামড়', 'rabies pep'],
    description: 'Immediate 15-minute soap-water wash, Tetanus toxoid, Rabies vaccine (Day 0, 3, 7, 28) and ERIG referral if bleeding.',
    descriptionBn: '১৫ মিনিট সাবান-পানি দিয়ে ধোয়া, টিটেনাস এবং ডে ০, ৩, ৭, ২৮ জলাতঙ্কের ভ্যাকসিন শিডিউল।',
    medicines: [
      {
        brand_name: 'Rabivax-S / Verorab',
        generic_name: 'Rabies Vaccine Inactivated',
        adult: { dosage_form: 'Inj', strength: '2.5 IU/dose', schedule: 'Day 0, 3, 7, 28 IM in deltoid', meal_timing: 'Anytime', duration: 'Schedule', special_instructions: 'কামড়ের দিন (Day 0), ৩য় দিন, ৭ম দিন এবং ২৮তম দিনে কাঁধের পেশীতে ১ ডোজ।' },
      },
      {
        brand_name: 'Tetanus Toxoid (TT)',
        generic_name: 'Tetanus Toxoid Vaccine',
        adult: { dosage_form: 'Inj', strength: '0.5 ml', schedule: '1 dose IM stat', meal_timing: 'Anytime', duration: 'Stat', special_instructions: 'যদি বিগত ৫ বছরে টিটি নেওয়া না থাকে।' },
      },
      {
        brand_name: 'Augmentin',
        generic_name: 'Amoxicillin + Clavulanic Acid',
        adult: { dosage_form: 'Tab', strength: '625 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '5 Days', special_instructions: 'সেকেন্ডারি ইনফেকশন প্রতিরোধে পশুর কামড়ে প্রথম পছন্দ।' },
      },
    ],
    adviceBn: [
      'সবচেয়ে জরুরি: কামড়ানো বা আঁচড় লাগা স্থানটি সাথে সাথে সাবান ও রানিং কলের পানিতে একটানা ১৫ মিনিট ভালো করে ধুয়ে ফেলুন।',
      'ক্ষতে চুন, মরিচ, ছাই বা পাতা লাগাবেন না এবং ডাক্তারের পরামর্শ ছাড়া সেলাই করবেন না।',
      'রক্তপাত হলে (Category III) অবশ্যই ভ্যাকসিনের পাশাপাশি র‍্যাবিস ইমিউনোগ্লোবুলিন (RIG) দিতে হবে।',
    ],
  },
  {
    id: 'tetanus-prone-wound-care',
    title: 'Tetanus-Prone Dirty Wound / Cut Injury',
    titleBn: 'মরিচাপড়া লোহা বা নোংরা ক্ষতের আঘাত (ধনুষ্টঙ্কার প্রতিরোধ)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['cut injury', 'rusty nail wound', 'লোহার আঘাত', 'কাটা ক্ষত', 'tetanus risk'],
    description: 'Wound debridement, Tetanus Toxoid booster, and prophylactic amoxicillin-clavulanate.',
    descriptionBn: 'ক্ষত পরিষ্কার, টিটেনাস ইনজেকশন ও অ্যান্টিসেপটিক ড্রেসিং।',
    medicines: [
      {
        brand_name: 'Tetanus Toxoid',
        generic_name: 'Tetanus Vaccine',
        adult: { dosage_form: 'Inj', strength: '0.5 ml', schedule: '1 ampoule IM stat', meal_timing: 'Anytime', duration: 'Stat', special_instructions: 'বাহুর ডেল্টয়েড পেশীতে ইনজেকশন।' },
      },
      {
        brand_name: 'Povidone Iodine Ointment',
        generic_name: 'Povidone Iodine 5% Ointment',
        adult: { dosage_form: 'Oint', strength: '5%', schedule: 'Apply BD with dressing', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'ক্ষত পরিষ্কার করে জীবাণুমুক্ত গজ দিয়ে ড্রেসিং করুন।' },
      },
    ],
    adviceBn: [
      'ক্ষতটি শুষ্ক রাখুন এবং গোসলের সময় পানি লাগাবেন না।',
      'ক্ষত লাল হয়ে ফুলে উঠলে বা পুঁজ জমলে অনতিবিলম্বে চিকিৎসকের শরণাপন্ন হোন।',
    ],
  },
  {
    id: 'minor-burn-first-aid',
    title: 'Superficial / Minor Thermal Burn (First Aid & Dressing)',
    titleBn: 'হালকা আগুনে বা গরম পানিতে পোড়া (ফার্স্ট এইড ও ড্রেসিং)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['burn', 'minor burn', 'হাত পোড়া', 'scald burn', 'fire burn'],
    description: 'Cool running water for 20 mins, Silver sulfadiazine burn ointment, avoid popping blisters.',
    descriptionBn: '২০ মিনিট কলের পানিতে ঠাণ্ডা করা, সিলভার সালফাডায়াজিন মলম এবং ফোসকা না ফাটানো।',
    medicines: [
      {
        brand_name: 'Silvazine Cream',
        generic_name: 'Silver Sulfadiazine 1% Cream',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: 'Apply thickly BD', meal_timing: 'Anytime', duration: '10-14 Days', special_instructions: 'পোড়া স্থানে ১-২ মিলিমিটার পুরু করে মেখে জীবাণুমুক্ত গজ দিয়ে ঢেকে দিন।' },
      },
      {
        brand_name: 'Napa',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'পোড়ার জ্বালাপোড়া ও ব্যথায়।' },
      },
    ],
    adviceBn: [
      'পোড়ার সাথে সাথে ২০ মিনিট সাধারণ তাপমাত্রার কলের পানির নিচে ধরে রাখুন (বরফ বা বরফ-পানি দেবেন না)।',
      'পোড়া স্থানে কোনো অবস্থাতেই টুথপেস্ট, ডিমের সাদা অংশ বা মাটি লাগাবেন না।',
      'ফোসকা নিজে নিজে ফাটাবেন না; এতে ভেতরের কাঁচা চামড়ায় ইনফেকশন ছড়িয়ে পড়ে।',
    ],
  },
  {
    id: 'acute-hypoglycemia-triage',
    title: 'Acute Hypoglycemia in Diabetic Patient (Low Blood Sugar)',
    titleBn: 'ডায়াবেটিস রোগীর সুগার কমে যাওয়া (হাইপোগ্লাইসেমিয়া জরুরি চিকিৎসা)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['hypoglycemia', 'low sugar', 'সুগার কমে যাওয়া', 'diabetic shakiness cold sweat'],
    description: 'The 15-15 Rule: 15 grams fast-acting simple carbohydrate, recheck blood glucose in 15 minutes.',
    descriptionBn: '১৫-১৫ নিয়ম: ৪ চামচ চিনি বা মিষ্টি শরবত পান, ১৫ মিনিট পর সুগার পুনরায় পরীক্ষা।',
    medicines: [
      {
        brand_name: 'Oral Glucose / Sugar Water',
        generic_name: 'Fast Acting Dextrose Carbohydrate',
        adult: { dosage_form: 'Syr', strength: '15-20 grams', schedule: 'Stat dose', meal_timing: 'Anytime', duration: 'Stat', special_instructions: '১ গ্লাস পানিতে ৪ চামচ চিনি বা গ্লুকোজ গুলিয়ে সাথে সাথে পান করুন।' },
      },
    ],
    adviceBn: [
      'রোগী অচেতন থাকলে মুখে কোনো তরল বা খাবার দেবেন না (ফুসফুসে চলে যাওয়ার মারাত্মক ঝুঁকি)।',
      'জ্ঞান ফিরলে একটি ভারী খাবার (যেমন: রুটি বা বিস্কুট) খেতে দিন যাতে সুগার পুনরায় না কমে।',
    ],
  },
  {
    id: 'insect-wasp-bee-sting',
    title: 'Insect, Wasp & Bee Sting (Local Reaction)',
    titleBn: 'মৌমাছি বা বোলতার কামড় (তীব্র জ্বালাপোড়া ও ফোলা)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['bee sting', 'wasp sting', 'মৌমাছির কামড়', 'insect bite reaction'],
    description: 'Stinger removal by scraping, ice compress, oral antihistamine and hydrocortisone cream.',
    descriptionBn: 'হুল বের করা, বরফ সেঁক, অ্যান্টিহিস্টামিন ও চুলকানি নিবারণ।',
    medicines: [
      {
        brand_name: 'Alatrol',
        generic_name: 'Cetirizine',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1 tab stat then OD', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'কামড়ানোর সাথে সাথেই ১টি সেব্য।' },
      },
      {
        brand_name: 'Hycort Cream',
        generic_name: 'Hydrocortisone 1% Cream',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: 'Apply TDS', meal_timing: 'Anytime', duration: '3-5 Days', special_instructions: 'ফোলা ও জ্বালাপোড়ার স্থানে আলতো করে লাগান।' },
      },
    ],
    adviceBn: [
      'হুল টেনে তোলার চেয়ে কার্ড বা ভোঁতা কাঠি দিয়ে চেঁছে হুল বের করুন (টিপলে বিষ আরও ভেতরে ঢোকে)।',
      'কামড়ের স্থানে বরফ সেঁক দিন। শ্বাসকষ্ট বা বুক ধড়ফড় হলে দ্রুত হাসপাতালে যান।',
    ],
  },
];
