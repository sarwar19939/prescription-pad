import type { DiseaseProtocolTemplate } from './types';

export const RESP_OBSTRUCTIVE_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'asthma-acute-exacerbation',
    title: 'Bronchial Asthma (Acute Mild-to-Moderate Exacerbation)',
    titleBn: 'অ্যাজমা / হাঁপানি (তীব্র শ্বাসকষ্ট ও বুক সাঁই সাঁই করা)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['asthma', 'হাঁপানি', 'acute asthma', 'wheezing', 'shortness of breath', 'শ্বাসকষ্ট'],
    description: 'GINA 2024 guidelines with inhaled SABA + systemic corticosteroid burst.',
    descriptionBn: 'ইনহেলার ওরাল স্টেরয়েড এবং ব্রঙ্কোডাইলেটর দিয়ে দ্রুত শ্বাসকষ্ট উপশম।',
    medicines: [
      {
        brand_name: 'Ventolin Inhaler',
        generic_name: 'Salbutamol Inhaler (100 mcg/puff)',
        adult: { dosage_form: 'Drop', strength: '100 mcg/puff', schedule: '2 puffs QDS (SOS)', meal_timing: 'Anytime', duration: 'As needed', special_instructions: 'শ্বাসকষ্ট হলে স্পেসার দিয়ে ২ চাপ টেনে গভীরভাবে শ্বাস নিন।' },
        pediatric: { dosage_form: 'Drop', strength: '100 mcg/puff', schedule: '2 puffs with baby mask', meal_timing: 'Anytime', duration: 'SOS', special_instructions: 'বেবি মাস্ক স্পেসার দিয়ে ২ চাপ দিন।' },
      },
      {
        brand_name: 'Prednisolone',
        generic_name: 'Prednisolone',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '2 tabs morning (40mg)', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'সকালে নাস্তার পর একবারে ২টি ট্যাবলেট। ৫ দিন পর বন্ধ করবেন।' },
        pediatric: { dosage_form: 'Syr', strength: '5 mg/5 ml', schedule: '1-2 mg/kg in morning', meal_timing: 'After Meal', duration: '3-5 Days', special_instructions: 'সকালে খাবারের পর দিন।' },
      },
      {
        brand_name: 'Monas',
        generic_name: 'Montelukast',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রাতে শোয়ার আগে চিবিয়ে বা গিলে সেব্য।' },
        pediatric: { dosage_form: 'Tab', strength: '4 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'শিশুদের চিবিয়ে খাওয়ার ট্যাবলেট।' },
      },
    ],
    adviceBn: [
      'ইনহেলার নেওয়ার সময় অবশ্যই স্পেসার (Spacer device) ব্যবহার করুন।',
      'ধুলাবালি, ঠান্ডা বাতাস, মশার কয়েলের ধোঁয়া, কার্পেট ও তুলার আঁশ থেকে দূরে থাকুন।',
      'কথা বলতে না পারলে বা আঙুলের ডগা নীল হলে দ্রুত জরুরি বিভাগে যান।',
    ],
  },
  {
    id: 'asthma-maintenance-ics-laba',
    title: 'Bronchial Asthma (Long-Term Maintenance ICS-LABA)',
    titleBn: 'অ্যাজমা দীর্ঘমেয়াদী নিয়ন্ত্রণ (ইনহেলড কর্টিকোস্টেরয়েড)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['asthma maintenance', 'chronic asthma', 'inhaler regular', 'ics-laba'],
    description: 'Budesonide/Formoterol maintenance and reliever therapy (SMART strategy).',
    descriptionBn: 'বুডেসোনাইড ও ফরমোটেরল কম্বিনেশন ইনহেলার দিয়ে ফুসফুসের প্রদাহ নিরাময়।',
    medicines: [
      {
        brand_name: 'Bexitrol-F Inhaler',
        generic_name: 'Budesonide + Formoterol (160/4.5 mcg)',
        adult: { dosage_form: 'Drop', strength: '160/4.5 mcg', schedule: '1 puff BD + SOS', meal_timing: 'Anytime', duration: '3-6 Months', special_instructions: 'সকালে ও রাতে ১ চাপ করে নিয়মিত টানবেন। সেবনের পর অবশ্যই পানি দিয়ে ভালো করে কুলকুচি করবেন।' },
      },
      {
        brand_name: 'Monas',
        generic_name: 'Montelukast',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'রাতে শোয়ার আগে ১টি।' },
      },
    ],
    adviceBn: [
      'লক্ষণ সম্পূর্ণ ভালো হলেও ইনহেলার কখনোই ডাক্তারের পরামর্শ ছাড়া বন্ধ করবেন না।',
      'ইনহেলার নেওয়ার পর সবসময় পানি দিয়ে ভালো করে মুখ ও গলা কুলকুচি করে ফেলে দিন (মুখের ঘা প্রতিরোধে)।',
    ],
  },
  {
    id: 'copd-stable-maintenance',
    title: 'COPD (Chronic Obstructive Pulmonary Disease - Stable)',
    titleBn: 'সিওপিডি (ধূমপায়ীদের দীর্ঘস্থায়ী কাশি ও শ্বাসটান)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['copd', 'সিওপিডি', 'smokers cough', 'chronic bronchitis', 'emphysema'],
    description: 'GOLD Group B/E management with long-acting muscarinic antagonist (LAMA) or LABA.',
    descriptionBn: 'ধূমপান বর্জন, ফুসফুসের কার্যক্ষমতা ধরে রাখা ও দীর্ঘমেয়াদী ব্রঙ্কোডাইলেটর।',
    medicines: [
      {
        brand_name: 'Tiotropium Rotacap',
        generic_name: 'Tiotropium Bromide (18 mcg)',
        adult: { dosage_form: 'Cap', strength: '18 mcg', schedule: '1 rotacap OD inhaler', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'ইনহেলেশন ক্যাপসুলটি মেশিনে ঢুকিয়ে সকালে ১ বার বুক ভরে টানবেন। এটি খাওয়ার জন্য নয়।' },
      },
      {
        brand_name: 'Doxovent',
        generic_name: 'Doxofylline',
        adult: { dosage_form: 'Tab', strength: '400 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'সকাল ও রাতে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'সিগারেট, বিড়ি, হুক্কা বা জর্দা সম্পূর্ণ বর্জন করা বাধ্যতামূলক।',
      'প্রতি বছর ইনফ্লুয়েঞ্জা ও নিউমোকক্কাল ভ্যাকসিন গ্রহণ করুন।',
      'প্রতিদিন ঠোঁট গোল করে ফুঁ দিয়ে শ্বাস ছাড়ার ব্যায়াম (Pursed lip breathing) করুন।',
    ],
  },
  {
    id: 'copd-acute-exacerbation',
    title: 'Acute Exacerbation of COPD (Mild OPD)',
    titleBn: 'সিওপিডি হঠাৎ বেড়ে যাওয়া (অতিরিক্ত কফ ও শ্বাসকষ্ট)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['copd exacerbation', 'aecopd', 'সিওপিডি শ্বাসকষ্ট বৃদ্ধি'],
    description: 'Short-course oral steroid, targeted antibiotic for purulent sputum, and nebulization/SABA.',
    descriptionBn: 'হলুদ/সবুজ কফ ও শ্বাসকষ্ট বৃদ্ধিতে অ্যান্টিবায়োটিক ও প্রেডনিসোলোন কোর্স।',
    medicines: [
      {
        brand_name: 'Azithral',
        generic_name: 'Azithromycin',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'খাবারের ১ ঘণ্টা আগে ১টি।' },
      },
      {
        brand_name: 'Prednisolone',
        generic_name: 'Prednisolone',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '2 tabs morning (40mg)', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'সকালে নাস্তার পর একবারে ২টি। টানা ৫ দিন।' },
      },
    ],
    adviceBn: [
      'কফের রঙ পরিবর্তন ও শ্বাসকষ্ট বাড়লে সাথে সাথে চিকিৎসা নিন।',
      'অক্সিজেন স্যাচুরেশন ৮৮-৯২% এর নিচে নামলে হাসপাতালে ভর্তি হন।',
    ],
  },
  {
    id: 'bronchiectasis-suppurative-cough',
    title: 'Bronchiectasis (Chronic Purulent Sputum)',
    titleBn: 'ব্রঙ্কিয়েক্টেসিস (অতিরিক্ত দুর্গন্ধযুক্ত পুঁজমিশ্রিত কফ ও কাশি)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['bronchiectasis', 'পুঁজযুক্ত কফ', 'chronic productive cough large volume'],
    description: 'Airway clearance techniques, postural drainage, and intermittent macrolide therapy.',
    descriptionBn: 'ফুসফুসের কফ পরিষ্কারের ব্যায়াম, পসচারাল ড্রেনেজ ও ম্যাক্রোলাইড থেরাপি।',
    medicines: [
      {
        brand_name: 'Zithrin',
        generic_name: 'Azithromycin',
        adult: { dosage_form: 'Tab', strength: '250 mg', schedule: 'Three times weekly', meal_timing: 'Before Meal', duration: '90 Days', special_instructions: 'সপ্তাহে ৩ দিন (শনি-সোম-বুধ) খাবারের পূর্বে ১টি।' },
      },
      {
        brand_name: 'Mucopect',
        generic_name: 'Ambroxol',
        adult: { dosage_form: 'Syr', strength: '15 mg/5 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'কফ পাতলা করতে খাবারের পর।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন সকালে উপুড় হয়ে শুয়ে ফুসফুসের কফ থুতুর পাত্রে ফেলে ড্রেনেজ করুন।',
      'প্রচুর কুসুম গরম পানি ও ভাপ নিয়ে ফুসফুস আর্দ্র রাখুন।',
    ],
  },
];
