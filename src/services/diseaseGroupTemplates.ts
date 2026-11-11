/**
 * Disease-Grouped and Age-Calibrated Clinical Prescription Templates.
 * Standard Outpatient Chamber Protocols (DGHS, icddr,b, BIRDEM & Master The Chamber).
 * Structured by: System -> Disease Group -> Age-Grouped Sub-templates.
 */
import type { AgeGroupCategory, TemplateMedicineItem } from '@/types/schema';

export interface DiseaseGroupTemplateDef {
  id: string;
  systemCategory: string;
  diseaseGroup: string;
  diseaseGroupBn: string;
  subTemplates: Array<{
    subId: string;
    title: string;
    titleBn: string;
    ageGroup: AgeGroupCategory;
    ageRangeLabel: string;
    diagnosis: string[];
    medicines: TemplateMedicineItem[];
    advice: string[];
    investigations: string[];
  }>;
}

export const DISEASE_SYSTEM_CATEGORIES = [
  'All',
  'Respiratory (শ্বাসতন্ত্র ও ফুসফুস)',
  'Infectious & Fever (জ্বর ও সংক্রামক)',
  'Gastrointestinal (পরিপাকতন্ত্র ও পেট)',
  'Cardiovascular (হৃদরোগ ও রক্তচাপ)',
  'Pediatrics (শিশুরোগ)',
  'Nephrology (কিডনি ও মূত্রতন্ত্র)',
  'Dermatology (চর্মরোগ)',
  'Musculoskeletal (হাড় ও বাতব্যথা)',
];

export const BUILTIN_DISEASE_GROUPS: DiseaseGroupTemplateDef[] = [
  {
    id: 'grp_pneumonia',
    systemCategory: 'Respiratory (শ্বাসতন্ত্র ও ফুসফুস)',
    diseaseGroup: 'Pneumonia',
    diseaseGroupBn: 'নিউমোনিয়া (Pneumonia)',
    subTemplates: [
      {
        subId: 'pneu_infant',
        title: 'Pneumonia in Infant (< 1 yr)',
        titleBn: 'নিউমোনিয়া (শিশু < ১ বছর)',
        ageGroup: 'infant',
        ageRangeLabel: 'নবজাতক ও শিশু (< ১ বছর)',
        diagnosis: ['Acute Lower Respiratory Tract Infection / Infantile Pneumonia'],
        medicines: [
          { brand_name: 'Moxacil Paediatric Drops', generic_name: 'Amoxicillin', dosage_form: 'Drop', strength: '100mg/ml', schedule: '1.25 ml TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাওয়ানোর পর ভালো করে মুখ মুছে দিন।' },
          { brand_name: 'Napa Paediatric Drops', generic_name: 'Paracetamol', dosage_form: 'Drop', strength: '80mg/0.8ml', schedule: '0.8 ml TDS (জ্বর থাকলে)', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর ১০০°F এর উপরে উঠলে।' },
          { brand_name: 'Solina Nasal Drops', generic_name: '0.9% Sodium Chloride', dosage_form: 'Drop', strength: '0.9%', schedule: '1 drop both nostrils QDS', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'দুধ খাওয়ানোর ১০ মিনিট আগে নাক পরিষ্কার করতে।' },
        ],
        advice: ['বুকের দুধ ঘন ঘন খাওয়ান', 'শ্বাসকষ্ট হলে বা বুকের খাঁচা দেবে গেলে দ্রুত হাসপাতালে নিন', 'ঠান্ডা বাতাস পরিহার করুন'],
        investigations: ['Complete Blood Count (CBC) with ESR', 'CXR P/A view (if not improving)'],
      },
      {
        subId: 'pneu_child_1_5',
        title: 'Pneumonia in Young Child (1 - 5 yrs)',
        titleBn: 'নিউমোনিয়া (শিশু ১ - ৫ বছর)',
        ageGroup: 'child',
        ageRangeLabel: 'শিশু (১ - ৫ বছর)',
        diagnosis: ['Community-Acquired Pneumonia (Paediatric)'],
        medicines: [
          { brand_name: 'Kilbac Suspension', generic_name: 'Cefuroxime Axetil', dosage_form: 'Syr', strength: '125mg/5ml', schedule: '1 tea spoon (5ml) 1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাওয়ার পর চামচে মেপে খাওয়াবেন।' },
          { brand_name: 'Napa Suspension', generic_name: 'Paracetamol', dosage_form: 'Syr', strength: '120mg/5ml', schedule: '1 tea spoon TDS', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর ও ব্যথার জন্য।' },
          { brand_name: 'Monas Paediatric Sachet / Chewable', generic_name: 'Montelukast', dosage_form: 'Tab', strength: '4 mg', schedule: '0+0+1 (রাতে ১টি)', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে চিবিয়ে অথবা পানিতে গুলে।' },
        ],
        advice: ['পর্যাপ্ত কুসুম গরম পানি ও তরল খাবার দিন', 'ধোঁয়া ও ধুলাবালি থেকে দূরে রাখুন', '৭ দিন পর পুনরায় ফলোআপ করুন'],
        investigations: ['CBC with ESR', 'CXR P/A view'],
      },
      {
        subId: 'pneu_adult',
        title: 'Community-Acquired Pneumonia (Adult 12+ yrs)',
        titleBn: 'কমিউনিটি অ্যাকোয়ার্ড নিউমোনিয়া (পূর্ণবয়স্ক)',
        ageGroup: 'adult',
        ageRangeLabel: 'পূর্ণবয়স্ক (১২+ বছর)',
        diagnosis: ['Community-Acquired Pneumonia (CAP)'],
        medicines: [
          { brand_name: 'Ceftron / Kilbac', generic_name: 'Cefuroxime Axetil', dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'নির্দিষ্ট সময়ে নিয়মিত সেব্য।' },
          { brand_name: 'Zimax / Azith', generic_name: 'Azithromycin', dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'খাওয়ার ১ ঘণ্টা আগে।' },
          { brand_name: 'Montene / Monas', generic_name: 'Montelukast', dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '1 Month', special_instructions: 'প্রতিদিন রাতে।' },
          { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খাওয়ার ২০ মিনিট পূর্বে।' },
        ],
        advice: ['পর্যাপ্ত বিশ্রাম নিন এবং প্রতিদিন অন্তত ২.৫ লিটার তরল পান করুন', 'ধূমপান সম্পূর্ণ পরিহার করুন', 'শ্বাসকষ্ট বাড়লে নিকটস্থ হাসপাতালে যোগাযোগ করুন'],
        investigations: ['CXR P/A view', 'CBC with ESR', 'S. Creatinine'],
      },
      {
        subId: 'pneu_elderly',
        title: 'Severe / Elderly Pneumonia with Comorbidities',
        titleBn: 'জটিল নিউমোনিয়া (বয়োজ্যেষ্ঠ / ডায়াবেটিস ও সিওপিডি সহ)',
        ageGroup: 'elderly',
        ageRangeLabel: 'বয়োজ্যেষ্ঠ ও জটিল কেস',
        diagnosis: ['Severe Pneumonia with COPD / Diabetes Overlap'],
        medicines: [
          { brand_name: 'Levo / Levomax', generic_name: 'Levofloxacin', dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'প্রচুর পানি সহ দিনে ১ বার।' },
          { brand_name: 'Doxovent / Pulmodox', generic_name: 'Doxophylline', dosage_form: 'Tab', strength: '400 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'শ্বাসকষ্ট উপশমে।' },
          { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '40 mg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'সকালে খালি পেটে।' },
        ],
        advice: ['অক্সিজেন স্যাচুরেশন (SpO2) নিয়মিত পরিমাপ করুন', 'SpO2 ৯২% এর নিচে নামলে অবিলম্বে অক্সিজেন সাপোর্ট প্রয়োজন', 'সুগার ও ব্লাড প্রেশার নিয়ন্ত্রণে রাখুন'],
        investigations: ['CXR P/A view', 'CBC with ESR', 'S. Creatinine', 'RBS'],
      },
    ],
  },
  {
    id: 'grp_fever',
    systemCategory: 'Infectious & Fever (জ্বর ও সংক্রামক)',
    diseaseGroup: 'Fever',
    diseaseGroupBn: 'জ্বর ও সংক্রামক প্রটোকল (Fever Protocols)',
    subTemplates: [
      {
        subId: 'fever_child',
        title: 'Fever / Viral Syndrome in Child (1 - 5 yrs)',
        titleBn: 'সাধারণ জ্বর (শিশু ১ - ৫ বছর)',
        ageGroup: 'child',
        ageRangeLabel: 'শিশু (১ - ৫ বছর)',
        diagnosis: ['Acute Febrile Illness / Viral Fever'],
        medicines: [
          { brand_name: 'Napa Suspension', generic_name: 'Paracetamol', dosage_form: 'Syr', strength: '120mg/5ml', schedule: '1 tea spoon (5ml) 1+1+1+1 (৬ ঘণ্টা পর পর)', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর ১০০°F এর বেশি হলে।' },
          { brand_name: 'ORS Saline-N', generic_name: 'Oral Rehydration Salts', dosage_form: 'Sachet', strength: '1 Packet / 500ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রচুর তরল ও পানি খাওয়ান।' },
        ],
        advice: ['মাথা ও কপালে ভেজা কাপড় দিয়ে আলতো করে মুছে দিন (Tepid sponging)', 'কোনো অবস্থাতেই ব্যথানাশক ওষুধ বা অ্যাসপিরিন খাওয়াবেন না', '৩ দিনের বেশি জ্বর থাকলে রক্ত পরীক্ষা করান'],
        investigations: ['CBC with ESR', 'Urine R/M/E'],
      },
      {
        subId: 'fever_adult_viral',
        title: 'Acute Viral Fever / Pyrexia (Adult)',
        titleBn: 'ভাইরাল ফিভার (পূর্ণবয়স্ক)',
        ageGroup: 'adult',
        ageRangeLabel: 'পূর্ণবয়স্ক (১২+ বছর)',
        diagnosis: ['Acute Febrile Illness / Viral Pyrexia'],
        medicines: [
          { brand_name: 'Napa Extra / Ace Plus', generic_name: 'Paracetamol + Caffeine', dosage_form: 'Tab', strength: '500mg+65mg', schedule: '1+1+1+1 (জ্বর থাকলে)', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'সর্বোচ্চ দিনে ৪টি ট্যাবলেট।' },
          { brand_name: 'Fexo / Fexodol', generic_name: 'Fexofenadine', dosage_form: 'Tab', strength: '120 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'সর্দি ও হাঁচির জন্য রাতে।' },
          { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাওয়ার ২০ মিনিট আগে।' },
        ],
        advice: ['প্রতিদিন অন্তত ৩ লিটার পানি ও ওআরএস স্যালাইন পান করুন', 'পর্যাপ্ত বিশ্রাম নিন', 'অ্যাসপিরিন বা ব্যথানাশক বর্জন করুন'],
        investigations: ['CBC with Platelet Count', 'Dengue NS1 Antigen (যদি জ্বরের ১ম-৩য় দিন হয়)'],
      },
      {
        subId: 'fever_dengue',
        title: 'Dengue Fever Protocol (Early Phase - DGHS Protocol)',
        titleBn: 'ডেঙ্গু জ্বর প্রোটোকল (DGHS জাতীয় নির্দেশিকা)',
        ageGroup: 'all',
        ageRangeLabel: 'সকল বয়স (Adult & Paediatric)',
        diagnosis: ['Dengue Fever Syndrome (Non-severe)'],
        medicines: [
          { brand_name: 'Napa / Fast', generic_name: 'Paracetamol only', dosage_form: 'Tab', strength: '500 mg', schedule: '1 Tab 6 hourly SOS', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'শুধুমাত্র প্যারাসিটামল। কখনোই ব্যথানাশক খাবেন না।' },
          { brand_name: 'ORS Saline-N', generic_name: 'Oral Rehydration Salts', dosage_form: 'Sachet', strength: '500 ml', schedule: '2 to 3 Litres Daily', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'রক্তনালীর প্লাজমা লিকেজ রোধে স্যালাইন ও তরল বাধ্যতামূলক।' },
        ],
        advice: ['কখনোই NSAIDs (যেমন Aceclofenac, Naproxen, Diclofenac, Ibuprofen) বা স্টেরয়েড খাবেন না', 'প্রতিদিন রক্তের প্লেটলেট ও হেমাটোক্রিট পরীক্ষা করুন', 'পেটে প্রচণ্ড ব্যথা, অবিরাম বমি বা মাড়ি দিয়ে রক্তপাত হলে তাৎক্ষণিক হাসপাতালে ভর্তি হোন'],
        investigations: ['CBC with Platelet & Haematocrit (প্রতিদিন)', 'Dengue NS1 Antigen (১ম-৩য় দিন)', 'Dengue IgM/IgG (৫ম দিনের পর)'],
      },
      {
        subId: 'fever_enteric',
        title: 'Enteric (Typhoid) Fever Protocol',
        titleBn: 'টাইফয়েড জ্বর (Enteric Fever)',
        ageGroup: 'adult',
        ageRangeLabel: 'পূর্ণবয়স্ক (১২+ বছর)',
        diagnosis: ['Enteric (Typhoid) Fever'],
        medicines: [
          { brand_name: 'Cef-3 / Triocim', generic_name: 'Cefixime', dosage_form: 'Cap', strength: '400 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'টাইফয়েড নিশ্চিত হলে পুরো ১৪ দিন চলবে।' },
          { brand_name: 'Napa / Ace', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1+1 (জ্বর থাকলে)', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'জ্বরের উপশমে।' },
          { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খাওয়ার পূর্বে।' },
        ],
        advice: ['বাইরের খোলা পানি বা অস্বাস্থ্যকর খাবার সম্পূর্ণ নিষেধ', 'ফুটানো বিশুদ্ধ পানি পান করুন', 'জ্বর কমে গেলেও অ্যান্টিবায়োটিকের পূর্ণ কোর্স সম্পন্ন করুন'],
        investigations: ['CBC with ESR', 'Blood Culture (১ম সপ্তাহে)', 'Widal Test / Typhidot IgM'],
      },
    ],
  },
  {
    id: 'grp_diarrhea',
    systemCategory: 'Gastrointestinal (পরিপাকতন্ত্র ও পেট)',
    diseaseGroup: 'Diarrhea',
    diseaseGroupBn: 'ডায়রিয়া ও বমি (Diarrhea & GE)',
    subTemplates: [
      {
        subId: 'diarrhea_child',
        title: 'Acute Watery Diarrhea in Child (icddr,b Protocol)',
        titleBn: 'ডায়রিয়া ও বমি (শিশু - icddr,b প্রোটোকল)',
        ageGroup: 'child',
        ageRangeLabel: 'শিশু (< ৫ বছর)',
        diagnosis: ['Acute Watery Diarrhea with Mild Dehydration'],
        medicines: [
          { brand_name: 'ORS Saline-N', generic_name: 'Oral Rehydration Salts', dosage_form: 'Sachet', strength: '1 Sachet / 500ml', schedule: 'প্রতিবার পাতলা পায়খানার পর আধা গ্লাস', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'স্যালাইন কখনোই গরম পানিতে বা রেখে দেওয়া বাসি পানিতে বানাবেন না।' },
          { brand_name: 'Baby Zinc', generic_name: 'Zinc Sulphate', dosage_form: 'Syr', strength: '20mg/5ml', schedule: '১ চামচ (৫ মিলি) দিনে ১ বার', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'ডায়রিয়া ভালো হয়ে গেলেও পুরো ১৪ দিন খাওয়াতে হবে।' },
          { brand_name: 'Motigut Paediatric Drops', generic_name: 'Domperidone', dosage_form: 'Drop', strength: '5mg/ml', schedule: '৫ ফোঁটা দিনে ৩ বার (খাওয়ার ১৫ মিনিট আগে)', meal_timing: 'Before Meal', duration: '3 Days', special_instructions: 'বমি বন্ধের জন্য।' },
          { brand_name: 'Enterogermina Paediatric', generic_name: 'Bacillus clausii', dosage_form: 'Drop', strength: '2 billion spores', schedule: '১টি মিনি শিশি দিনে ২ বার', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'মুখের ভেতরে সরাসরি খাইয়ে দিন।' },
        ],
        advice: ['স্যালাইনের পাশাপাশি বুকের দুধ ও স্বাভাবিক খাবার চালু রাখুন', 'কখনোই লোপ্রামাইড বা মোশন বন্ধ করার কোনো ওষুধ শিশুকে দেবেন না', 'শিশু নিস্তেজ হয়ে পড়লে দ্রুত হাসপাতালে নিন'],
        investigations: ['Stool R/M/E', 'Serum Electrolytes (if sunken eyes/lethargy)'],
      },
      {
        subId: 'diarrhea_adult',
        title: 'Acute Gastroenteritis & AWD (Adult Protocol)',
        titleBn: 'অ্যাকিউট ডায়রিয়া ও বমি (পূর্ণবয়স্ক)',
        ageGroup: 'adult',
        ageRangeLabel: 'পূর্ণবয়স্ক (১২+ বছর)',
        diagnosis: ['Acute Gastroenteritis / Watery Diarrhea'],
        medicines: [
          { brand_name: 'ORS Saline-N', generic_name: 'Oral Rehydration Salts', dosage_form: 'Sachet', strength: '500 ml', schedule: 'প্রতিবার পাতলা পায়খানার পর ১ গ্লাস', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'দিনে অন্তত ৩ লিটার তরল পান করুন।' },
          { brand_name: 'Motigut / Deflux', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'খাওয়ার ১৫ মিনিট আগে।' },
          { brand_name: 'Enterogermina / Progut', generic_name: 'Bacillus clausii', dosage_form: 'Cap', strength: '2 billion spores', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'অন্ত্রের স্বাভাবিক ব্যাকটেরিয়া পুনরুদ্ধারে।' },
        ],
        advice: ['কখনোই অ্যান্টি-মোটিলিটি ওষুধ (ইমোডিয়াম/লোপ্রামাইড) খাবেন না', 'ডাবের পানি ও কাঁচাকলার খিচুড়ি খান', 'প্রস্রাবের পরিমাণ কমে গেলে আইভি স্যালাইনের জন্য ক্লিনিকে যান'],
        investigations: ['Stool R/M/E', 'Serum Electrolytes'],
      },
    ],
  },
  {
    id: 'grp_pud',
    systemCategory: 'Gastrointestinal (পরিপাকতন্ত্র ও পেট)',
    diseaseGroup: 'PUD / GERD',
    diseaseGroupBn: 'গ্যাস্ট্রিক ও বুকজ্বালা (PUD / GERD)',
    subTemplates: [
      {
        subId: 'pud_standard_adult',
        title: 'Peptic Ulcer & GERD Protocol (Adult)',
        titleBn: 'গ্যাস্ট্রিক আলসার ও এসিডিটি (পূর্ণবয়স্ক)',
        ageGroup: 'adult',
        ageRangeLabel: 'পূর্ণবয়স্ক (১২+ বছর)',
        diagnosis: ['Peptic Ulcer Disease (PUD) / GERD'],
        medicines: [
          { brand_name: 'Sergel / Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খাওয়ার ২০-৩০ মিনিট পূর্বে খালি পেটে।' },
          { brand_name: 'Motigut', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'খাওয়ার ১৫ মিনিট আগে।' },
          { brand_name: 'Entacyd Plus', generic_name: 'Magaldrate + Simethicone', dosage_form: 'Syr', strength: '200 ml', schedule: '২ চা চামচ খাওয়ার ১ ঘণ্টা পর ও রাতে', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'তীব্র বুকজ্বালা ও গ্যাস্ট্রিকের ব্যথায়।' },
        ],
        advice: ['তেল-মসলাযুক্ত, ভাজাপোড়া খাবার ও ধূমপান পরিহার করুন', 'খাওয়ার পরপরই শুয়ে পড়বেন না, অন্তত ২ ঘণ্টা পর ঘুমান', 'একবারে বেশি না খেয়ে অল্প অল্প করে বারবার খান'],
        investigations: ['USG of Whole Abdomen', 'Upper GI Endoscopy (যদি উপসর্গ না কমে)'],
      },
    ],
  },
  {
    id: 'grp_hypertension',
    systemCategory: 'Cardiovascular (হৃদরোগ ও রক্তচাপ)',
    diseaseGroup: 'Hypertension',
    diseaseGroupBn: 'উচ্চ রক্তচাপ (Hypertension)',
    subTemplates: [
      {
        subId: 'htn_young_adult',
        title: 'Stage 1 Essential HTN (< 55 yrs)',
        titleBn: 'উচ্চ রক্তচাপ (তরুণ ও মধ্যবয়সী)',
        ageGroup: 'adult',
        ageRangeLabel: 'প্রাপ্তবয়স্ক (< ৫৫ বছর)',
        diagnosis: ['Essential Hypertension (Stage 1)'],
        medicines: [
          { brand_name: 'Osartil / Angilock', generic_name: 'Losartan Potassium', dosage_form: 'Tab', strength: '50 mg', schedule: '0+0+1 (রাতে ১টি)', meal_timing: 'After Meal', duration: '1 Month', special_instructions: 'প্রতিদিন নির্দিষ্ট সময়ে নিয়মিত সেব্য।' },
        ],
        advice: ['কাঁচা লবণ খাওয়া সম্পূর্ণ বন্ধ করুন', 'প্রতিদিন অন্তত ৩০ মিনিট দ্রুত হাঁটুন', 'প্রতি সপ্তাহে অন্তত ২ দিন রক্তচাপ মেপে লিখে রাখুন'],
        investigations: ['ECG (12 Lead)', 'Serum Creatinine', 'Lipid Profile', 'Urine for microalbumin'],
      },
      {
        subId: 'htn_elderly',
        title: 'Stage 2 HTN in Elderly (> 60 yrs) / Dual Therapy',
        titleBn: 'উচ্চ রক্তচাপ (বয়োজ্যেষ্ঠ / কম্বিনেশন থেরাপি)',
        ageGroup: 'elderly',
        ageRangeLabel: 'বয়োজ্যেষ্ঠ (> ৬০ বছর)',
        diagnosis: ['Essential Hypertension (Stage 2)'],
        medicines: [
          { brand_name: 'Camlosart / Amlopin-Plus', generic_name: 'Amlodipine + Losartan', dosage_form: 'Tab', strength: '5mg+50mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '1 Month', special_instructions: 'প্রতিদিন রাতে।' },
        ],
        advice: ['কখনোই নিজে থেকে ওষুধ বন্ধ করবেন না', 'লবণ ও চর্বিযুক্ত খাবার এড়িয়ে চলুন', 'মাথা ঘোরা বা চোখের ঝাপসা দেখা দিলে চিকিৎসকের পরামর্শ নিন'],
        investigations: ['ECG', 'Echocardiogram', 'Serum Creatinine & Electrolytes'],
      },
    ],
  },
];
