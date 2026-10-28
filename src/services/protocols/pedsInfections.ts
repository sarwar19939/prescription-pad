import type { DiseaseProtocolTemplate } from './types';

export const PEDS_INFECTIONS_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'intestinal-worm-infestation',
    title: 'Intestinal Worm Infestation (Pediatric & Family Deworming)',
    titleBn: 'কৃমি সংক্রমণ ও কৃমিনাশক পারিবারিক চিকিৎসা',
    category: 'Pediatrics',
    diagnosisMatch: ['worms', 'কৃমি', 'pinworm', 'roundworm', 'deworming', 'anal itching night'],
    description: 'Albendazole 400 mg single dose with repeat at 2 weeks for enterobiasis.',
    descriptionBn: 'পরিবারের সবার জন্য অ্যালবেনডাজল চিবিয়ে খাওয়ার বড়ি ও হাত ধোয়ার নিয়ম।',
    medicines: [
      {
        brand_name: 'Almex Chewable Tablet',
        generic_name: 'Albendazole 400 mg',
        adult: { dosage_form: 'Tab', strength: '400 mg', schedule: '1 tab single dose', meal_timing: 'After Meal', duration: 'Repeat day 14', special_instructions: 'রাতে খাবারের পর ভালো করে চিবিয়ে খাবেন। ১৪ দিন পর আরেকবার সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '200 mg/5 ml', schedule: '10 ml single dose', meal_timing: 'After Meal', duration: 'Repeat day 14', special_instructions: '২ বছরের ওপরের শিশুদের ক্ষেত্রে একবারে ১০ মিলি (৪০০ মিগ্রা)।' },
      },
    ],
    adviceBn: [
      'পরিবারের সকল সদস্যের একই দিনে একসাথে কৃমির ওষুধ খেতে হবে।',
      'শিশুর হাতের নখ ছোট করে কেটে রাখুন ও খাওয়ার আগে সাবান দিয়ে হাত ধোয়ানোর অভ্যাস করুন।',
      'খোলা বা রাস্তার অপরিচ্ছন্ন খাবার খাওয়া বন্ধ করুন।',
    ],
  },
  {
    id: 'oral-thrush-candidiasis-infants',
    title: 'Oral Thrush (Infantile Oral Candidiasis)',
    titleBn: 'শিশুর মুখের ঘা ও সাদা ছত্রাক (ওরাল থ্রাশ)',
    category: 'Pediatrics',
    diagnosisMatch: ['oral thrush', 'mouth fungal baby', 'বাচ্চার মুখের ঘা', 'white patches on tongue baby'],
    description: 'Nystatin oral suspension 100,000 units/ml dropped directly on mucosal lesions.',
    descriptionBn: 'মুখে নাইস্ট্যাটিন ড্রপ ও স্তন্যপান করানোর পরিচ্ছন্নতা।',
    medicines: [
      {
        brand_name: 'Nystat Oral Drop',
        generic_name: 'Nystatin Oral Suspension (100,000 units/ml)',
        adult: { dosage_form: 'Drop', strength: '100,000 U/ml', schedule: '1 ml QDS', meal_timing: 'After Meal', duration: '7-10 Days', special_instructions: 'মুখে ড্রপ দিয়ে কিছুক্ষণ রেখে গিলে ফেলবেন।' },
        pediatric: { dosage_form: 'Drop', strength: '100,000 U/ml', schedule: '1 ml QDS after feeds', meal_timing: 'After Meal', duration: '7-10 Days', special_instructions: 'দুধ খাওয়ানোর পর মুখের ঘাগুলোর ওপর ড্রপার দিয়ে ১ মিলি মেখে দিন।' },
      },
    ],
    adviceBn: [
      'ফিডিং বোতল, চুষনি বা চামচ প্রতিবার ব্যবহারের পূর্বে ফুটন্ত গরম পানিতে জীবাণুমুক্ত করুন।',
      'মা স্তন্যপান করানোর আগে স্তনের বোঁটা পরিষ্কার পানি দিয়ে ধুয়ে শুকিয়ে নেবেন।',
    ],
  },
  {
    id: 'croup-laryngotracheobronchitis',
    title: 'Croup / Acute Laryngotracheobronchitis (Barking Cough)',
    titleBn: 'ক্রুপ (শিশুদের তীব্র ঘেউ-ঘেউ কাশি ও শ্বাসকষ্ট)',
    category: 'Pediatrics',
    diagnosisMatch: ['croup', 'barking cough child', 'stridor child', 'বাচ্চার ঘেউ ঘেউ কাশি'],
    description: 'Single-dose oral dexamethasone 0.15 mg/kg with cool mist/steam exposure.',
    descriptionBn: 'একক মাত্রার ডেক্সামিথাসোন এবং বাষ্পীয় ভাপ দিয়ে শ্বাসনালী উন্মুক্তকরণ।',
    medicines: [
      {
        brand_name: 'Oradexon',
        generic_name: 'Dexamethasone Oral Solution/Tablet',
        adult: { dosage_form: 'Tab', strength: '0.5 mg', schedule: 'Single dose stat', meal_timing: 'After Meal', duration: '1 Day', special_instructions: 'এককালীন চিকিৎসায় সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '0.5 mg/5 ml', schedule: 'Single stat dose (0.15 mg/kg)', meal_timing: 'After Meal', duration: '1 Day', special_instructions: 'এককালীন একক মাত্রায় ডাক্তারের তত্ত্বাবধানে দিন।' },
      },
    ],
    adviceBn: [
      'বাচ্চাকে বাথরুমে নিয়ে গরম পানির বাষ্পে (Steam) ১০-১৫ মিনিট রাখুন বা খোলা ঠাণ্ডা বাতাসে রাখুন।',
      'শ্বাস নেওয়ার সময় বাঁশির মতো শব্দ (Stridor) বা বুক দেবে গেলে দ্রুত হাসপাতালে নিন।',
    ],
  },
  {
    id: 'acute-diarrhea-pediatric-plan-a',
    title: 'Acute Watery Diarrhea in Children (WHO Plan A)',
    titleBn: 'শিশুদের পাতলা পায়খানা (হু প্ল্যান-এ পানিশূন্যতা প্রতিরোধ)',
    category: 'Pediatrics',
    diagnosisMatch: ['pediatric diarrhea', 'বাচ্চার পাতলা পায়খানা', 'infant diarrhea', 'who plan a'],
    description: 'Home oral rehydration solution + Zinc for 14 days + continuous feeding (breastmilk).',
    descriptionBn: 'আইসিডিডিআর,বি নির্দেশিত খাবার স্যালাইন, জিঙ্ক সিরাপ ও বুকের দুধ চালু রাখা।',
    medicines: [
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Sachet', strength: '1 Sachet / 500ml', schedule: '1 glass after each stool', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিবার মলত্যাগের পর ১ গ্লাস।' },
        pediatric: { dosage_form: 'Sachet', strength: '1 Sachet / 500ml', schedule: 'Half glass after each loose stool', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিবার পায়খানার পর আধা গ্লাস স্যালাইন চামচ দিয়ে ধীরে ধীরে খাওয়ান।' },
      },
      {
        brand_name: 'Baby Zinc Syrup',
        generic_name: 'Zinc Sulphate Syrup (20 mg/5 ml)',
        adult: { dosage_form: 'Syr', strength: '20 mg/5 ml', schedule: '1 spoon OD', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'টানা ১৪ দিন সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '20 mg/5 ml', schedule: '1 spoon (5 ml) daily for 14 days', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'ডায়রিয়া ভালো হয়ে গেলেও টানা ১৪ দিন সম্পূর্ণ কোর্স শেষ করুন।' },
      },
    ],
    adviceBn: [
      'বুকের দুধ খাওয়ানো কোনো অবস্থাতেই বন্ধ করবেন না, বরং আরও ঘন ঘন খাওয়ান।',
      'স্যালাইন বানানোর পর ১২ ঘণ্টার বেশি রাখবেন না, নতুন স্যালাইন গুলিয়ে খাওয়ান।',
      'প্রস্রাব ৬ ঘণ্টার বেশি বন্ধ থাকলে বা চোখ গর্তে ঢুকে গেলে দ্রুত হাসপাতালে যান।',
    ],
  },
  {
    id: 'pediatric-acute-bronchiolitis',
    title: 'Acute Viral Bronchiolitis (Infant Wheeze Under 2 Yrs)',
    titleBn: 'ব্রঙ্কিওলাইটিস (২ বছরের নিচের শিশুদের বুক ঘড়ঘড় ও শ্বাসকষ্ট)',
    category: 'Pediatrics',
    diagnosisMatch: ['bronchiolitis', 'infant wheeze', 'বাচ্চার বুক ঘরঘর', 'rsv wheeze'],
    description: 'Nasal saline irrigation, suction, frequent hydration. Antibiotics & steroids NOT recommended.',
    descriptionBn: 'নরমাল স্যালাইন ড্রপ দিয়ে নাক পরিষ্কার, পর্যাপ্ত বুকের দুধ ও পর্যবেক্ষণ।',
    medicines: [
      {
        brand_name: 'Solina Nasal Drops',
        generic_name: 'Sodium Chloride 0.9% Nasal Drops',
        adult: { dosage_form: 'Drop', strength: '0.9%', schedule: '2 drops BD', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'নাক বন্ধ থাকলে।' },
        pediatric: { dosage_form: 'Drop', strength: '0.9%', schedule: '2 drops each nostril before feed', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'দুধ খাওয়ানোর আগে দুই নাকে ২ ফোঁটা দিয়ে নাক পরিষ্কার করুন।' },
      },
    ],
    adviceBn: [
      'অপ্রয়োজনীয় অ্যান্টিবায়োটিক বা কড়া কাশির সিরাপ খাওয়াবেন না।',
      'বাচ্চার শ্বাসের গতি যদি মিনিটে ৫০ এর বেশি হয় বা বুকের খাঁচা দেবে যায় তবে হাসপাতালে নিন।',
    ],
  },
  {
    id: 'pediatric-strep-tonsillitis',
    title: 'Pediatric Acute Tonsillitis / Pharyngitis',
    titleBn: 'শিশুদের টনসিলাইটিস (গলাব্যথা ও তীব্র জ্বর)',
    category: 'Pediatrics',
    diagnosisMatch: ['pediatric tonsillitis', 'বাচ্চার গলা ব্যথা', 'child tonsil fever'],
    description: 'Oral amoxicillin suspension for 7-10 days to eradicate Group A Streptococcus.',
    descriptionBn: 'এমোক্সিসিলিন সিরাপ সম্পূর্ণ কোর্স ও কুসুম গরম তরল খাবার।',
    medicines: [
      {
        brand_name: 'Moxacil Suspension',
        generic_name: 'Amoxicillin Dry Syrup (125 mg/5 ml)',
        adult: { dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাবারের পর।' },
        pediatric: { dosage_form: 'Syr', strength: '125 mg/5 ml', schedule: '1 spoon TDS', meal_timing: 'After Meal', duration: '7-10 Days', special_instructions: '৮ ঘণ্টা পর পর পরিমাপ অনুযায়ী টানা ৭ দিন খাওয়াবেন।' },
      },
      {
        brand_name: 'Napa Syrup',
        generic_name: 'Paracetamol Syrup',
        adult: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর ও গলা ব্যথায়।' },
        pediatric: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '6 hourly SOS', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর বা ব্যথায় মাপমতো।' },
      },
    ],
    adviceBn: [
      'অ্যান্টিবায়োটিকের সম্পূর্ণ কোর্স শেষ করুন বাতের জ্বর (Rheumatic Fever) প্রতিরোধে।',
      'নরম খিচুড়ি, স্যুপ ও কুসুম গরম পানি খাওয়ান।',
    ],
  },
  {
    id: 'pediatric-atopic-eczema-infants',
    title: 'Infantile Atopic Eczema (Cheek & Flexural Rash)',
    titleBn: 'শিশুদের একজিমা (গালে ও ভাঁজে চুলকানি ও খসখসে লাল দাগ)',
    category: 'Pediatrics',
    diagnosisMatch: ['infantile eczema', 'বাচ্চার একজিমা', 'baby atopic dermatitis', 'red cheeks baby itch'],
    description: 'Mild hydrocortisone 1% cream short course with intensive emollient moisturizing.',
    descriptionBn: 'হাইড্রোকর্টিসোন ১% ক্রিম ও প্রচুর ময়েশ্চারাইজিং ব্যারিয়ার ক্রিম।',
    medicines: [
      {
        brand_name: 'Hycort Cream',
        generic_name: 'Hydrocortisone Cream 1%',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'রাতে পাতলা করে লাগাবেন।' },
        pediatric: { dosage_form: 'Oint', strength: '1%', schedule: 'Apply thin layer OD', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'লালচে চুলকানির অংশে রাতে একবার খুব পাতলা করে ৫ দিন লাগান।' },
      },
      {
        brand_name: 'Cetaphil Baby Lotion',
        generic_name: 'Baby Emollient Moisturizer',
        adult: { dosage_form: 'Oint', strength: 'Standard', schedule: 'TDS apply', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'গা ধোয়ার পর মেখে দিন।' },
        pediatric: { dosage_form: 'Oint', strength: 'Standard', schedule: '3 times daily after bath', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'গোসলের পর সারাদেহে ভালো করে লোশন মেখে দিন।' },
      },
    ],
    adviceBn: [
      'বাচ্চাকে ক্ষারযুক্ত কড়া সাবান দিয়ে স্নান করাবেন না।',
      'সবসময় সুতির নরম কাপড় পরাবেন।',
    ],
  },
];
