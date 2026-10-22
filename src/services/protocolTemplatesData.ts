/**
 * Clinical Disease Treatment Protocol Templates for Bangladesh Chambers.
 * Covers Acute Infections, Chronic Illnesses, Skin Diseases, and Pediatrics.
 */

export interface ProtocolMedicineDef {
  brand_name: string;
  generic_name: string;
  adult: {
    dosage_form: 'Tab' | 'Cap' | 'Syr' | 'Inj' | 'Oint' | 'Drop';
    strength: string;
    schedule: string;
    meal_timing: 'Before Meal' | 'After Meal' | 'With Meal' | 'Anytime';
    duration: string;
    special_instructions: string;
  };
  pediatric?: {
    dosage_form: 'Tab' | 'Cap' | 'Syr' | 'Inj' | 'Oint' | 'Drop';
    strength: string;
    schedule: string;
    meal_timing: 'Before Meal' | 'After Meal' | 'With Meal' | 'Anytime';
    duration: string;
    special_instructions: string;
    perKgDoseMg?: number; // e.g. 15 for paracetamol
    concentrationMgPerMl?: number; // e.g. 120/5 = 24
  };
}

export interface DiseaseProtocolTemplate {
  id: string;
  title: string;
  titleBn: string;
  category: 'Internal Medicine' | 'Skin & Dermatology' | 'Chronic Diseases' | 'Pediatrics & ENT' | 'Musculoskeletal';
  diagnosisMatch: string[];
  description: string;
  descriptionBn: string;
  medicines: ProtocolMedicineDef[];
  adviceBn: string[];
}

export const DISEASE_PROTOCOL_TEMPLATES: DiseaseProtocolTemplate[] = [
  // 1. Dengue Fever
  {
    id: 'dengue-fever',
    title: 'Dengue Fever (Non-severe / Group A)',
    titleBn: 'ডেঙ্গু জ্বর (সাধারণ ব্যবস্থাপনা)',
    category: 'Internal Medicine',
    diagnosisMatch: ['dengue', 'dengue fever', 'ডেঙ্গু', 'viral fever', 'fever'],
    description: 'DGHS National Guideline for uncomplicated Dengue. Adequate hydration, paracetamol only, strict NSAID avoidance.',
    descriptionBn: 'জাতীয় নির্দেশিকা অনুযায়ী প্রচুর তরল/স্যালাইন পান, শুধুমাত্র প্যারাসিটামল, সকল ব্যথানাশক (NSAID) সম্পূর্ণ নিষিদ্ধ।',
    medicines: [
      {
        brand_name: 'Napa',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'After Meal', duration: '3-5 Days', special_instructions: 'জ্বর বা শরীর ব্যথায় সেব্য। দিনে ৪ গ্রামের বেশি খাবেন না।' },
        pediatric: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '1+1+1 (SOS)', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর অনুভূত হলে প্রতি ৬-৮ ঘণ্টা পরপর মাপমতো সেব্য।', perKgDoseMg: 15, concentrationMgPerMl: 24 },
      },
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Syr', strength: '500 ml', schedule: '1+1+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিদিন অন্তত ২.৫ থেকে ৩ লিটার স্যালাইন ও তরল খাবার পান করুন।' },
        pediatric: { dosage_form: 'Syr', strength: '500 ml', schedule: '1+1+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রচুর ওআরএস, ডাবের পানি ও তরল খাবার খাওয়ান।' },
      },
    ],
    adviceBn: [
      'প্রচুর পরিমাণে পানি, খাবার স্যালাইন, ডাবের পানি ও ফলের রস পান করুন।',
      'কোনো অবস্থাতেই অ্যাসপিরিন, ডাইক্লোফেনাক বা ব্যথানাশক ওষুধ খাবেন না।',
      'বিপদচিহ্ন: তীব্র পেট ব্যথা, অতিরিক্ত বমি, মাড়ি বা নাক দিয়ে রক্তপাত হলে অবিলম্বে হাসপাতালে যান।',
      'প্রতিদিন বা চিকিৎসকের পরামর্শমতো রক্তে প্লাটিলেট ও সিবিসি পরীক্ষা করুন।',
    ],
  },

  // 2. Acute Watery Diarrhea / GE
  {
    id: 'acute-gastroenteritis',
    title: 'Acute Watery Diarrhea / Gastroenteritis',
    titleBn: 'ডায়রিয়া ও পাতলা পায়খানা (আইসিডিডিআর,বি প্রোটোকল)',
    category: 'Internal Medicine',
    diagnosisMatch: ['diarrhea', 'diarrhoea', 'gastroenteritis', 'পাতলা পায়খানা', 'ডায়রিয়া', 'cholera'],
    description: 'icddr,b dehydration management plan with oral rehydration, zinc supplementation, and gut rest.',
    descriptionBn: 'পানিশূন্যতা রোধে ওআরএস, শিশুদের জিঙ্ক সিরাপ এবং প্রয়োজনীয় অন্ত্র পুনঃস্থাপন।',
    medicines: [
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Syr', strength: '500 ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '3-5 Days', special_instructions: 'প্রতিবার পাতলা পায়খানার পর ১ গ্লাস (২৫০ মিলি) প্রস্তুত স্যালাইন পান করুন।' },
        pediatric: { dosage_form: 'Syr', strength: '500 ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '3-5 Days', special_instructions: 'প্রতিবার পাতলা পায়খানার পর আধা গ্লাস প্রস্তুত স্যালাইন চামচ দিয়ে খাওয়ান।' },
      },
      {
        brand_name: 'Baby Zinc',
        generic_name: 'Zinc Sulphate',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '10-14 Days', special_instructions: '১০ থেকে ১৪ দিন নিয়মিত সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '20 mg/5 ml', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'ডায়রিয়া ভালো হয়ে গেলেও টানা ১৪ দিন সম্পূর্ণ কোর্স শেষ করুন।' },
      },
      {
        brand_name: 'Enterogermina',
        generic_name: 'Bacillus clausii spores',
        adult: { dosage_form: 'Syr', strength: '2 billion/5 ml', schedule: '1+0+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'সরাসরি পান করুন অন্ত্রের উপকারী ব্যাকটেরিয়া ফিরিয়ে আনার জন্য।' },
        pediatric: { dosage_form: 'Syr', strength: '2 billion/5 ml', schedule: '1+0+0', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'মিনি বোতল খুলে সরাসরি অথবা পানির সাথে মিশিয়ে খাওয়ান।' },
      },
    ],
    adviceBn: [
      'আধ লিটার ফুটানো ঠাণ্ডা পানিতে পুরো ১ প্যাকেট স্যালাইন গুলিয়ে ১২ ঘণ্টার মধ্যে পান করবেন।',
      'কাঁচা পানি বা খোলা খাবার খাবেন না, সাবান দিয়ে হাত ধুয়ে খাবার গ্রহণ করুন।',
      'লক্ষণীয়: চোখ গর্তে যাওয়া, প্রস্রাব কমে যাওয়া বা চরম দুর্বলতা দেখা দিলে দ্রুত চিকিৎসকের কাছে আসুন।',
    ],
  },

  // 3. Peptic Ulcer Disease & GERD
  {
    id: 'pud-gerd',
    title: 'Peptic Ulcer Disease & Acid Reflux (GERD)',
    titleBn: 'গ্যাস্ট্রিক আলসার, এসিডিটি ও বুকজ্বালা',
    category: 'Internal Medicine',
    diagnosisMatch: ['pud', 'gerd', 'gastritis', 'dyspepsia', 'hyperacidity', 'গ্যাস্ট্রিক', 'বুকজ্বালা', 'আলসার'],
    description: 'Proton pump inhibitor acid suppression combined with prokinetic motility agent.',
    descriptionBn: 'খাবারের পূর্বে কার্যকর অ্যাসিড নিরাময়কারী পিপিআই ও বমি ভাব রোধক ওষুধ।',
    medicines: [
      {
        brand_name: 'Maxpro',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14-30 Days', special_instructions: 'সকাল ও রাতে খাবারের ৩০-৬০ মিনিট পূর্বে খালি পেটে গিলে খাবেন।' },
        pediatric: { dosage_form: 'Syr', strength: '20 mg/sachet', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'সকালে নাস্তার ৩০ মিনিট পূর্বে সেব্য।' },
      },
      {
        brand_name: 'Omidon',
        generic_name: 'Domperidone',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7-14 Days', special_instructions: 'খাবারের ১৫-৩০ মিনিট পূর্বে সেবন করুন বমি ও পেট ফাঁপা কমাতে।' },
        pediatric: { dosage_form: 'Drop', strength: '5 mg/ml', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'খাবারের পূর্বে চামচে মেপে খাওয়ান।' },
      },
      {
        brand_name: 'Almex Antacid',
        generic_name: 'Aluminium Hydroxide + Magnesium Hydroxide',
        adult: { dosage_form: 'Syr', strength: '200 ml', schedule: '1+1+1 (SOS)', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'বুকজ্বালা বা পেটে তীব্র জ্বালাপোড়ায় খাবারের ১ ঘণ্টা পর ২ চামচ সেব্য।' },
      },
    ],
    adviceBn: [
      'ভাজাপোড়া, অতিরিক্ত তেল-মশলাযুক্ত খাবার ও কোল্ড ড্রিংকস বর্জন করুন।',
      'খাওয়ার সাথে সাথে বিছানায় শোবেন না, অন্তত ২ ঘণ্টা পর ঘুমাতে যান।',
      'চা, কফি ও ধূমপান পরিহার করুন। একবারে বেশি না খেয়ে অল্প অল্প করে বারবার খান।',
    ],
  },

  // 4. Scabies (খোস-পাচড়া - Skin Disease)
  {
    id: 'scabies-protocol',
    title: 'Scabies Infestation (Dermatology)',
    titleBn: 'খোস-পাচড়া / স্ক্যাবিস (ত্বকের পরজীবী সংক্রমণ)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['scabies', 'itch', 'খোস-পাচড়া', 'পাঁচড়া', 'ত্বকের চুলকানি', 'mite'],
    description: 'Permethrin 5% whole-body topical eradication with family treatment and antihistamine itch control.',
    descriptionBn: 'পরিবারের সকলের একসাথে পারমেথ্রিন লোশন ব্যবহার ও চুলকানি নিরাময়ের জাতীয় প্রোটোকল।',
    medicines: [
      {
        brand_name: 'Scabex',
        generic_name: 'Permethrin',
        adult: { dosage_form: 'Oint', strength: '5%', schedule: '1 application', meal_timing: 'Anytime', duration: '1 Day', special_instructions: 'রাতে গোসলের পর গলা থেকে পায়ের পাতা পর্যন্ত মেখে ৮-১২ ঘণ্টা পর ধুয়ে ফেলুন। ৭ দিন পর পুনরায় একবার ব্যবহার করুন।' },
        pediatric: { dosage_form: 'Oint', strength: '5%', schedule: '1 application', meal_timing: 'Anytime', duration: '1 Day', special_instructions: 'শিশুদের মাথা ও মুখ বাদ দিয়ে সমস্ত শরীরে ৮ ঘণ্টা রেখে ধুয়ে ফেলুন। ৭ দিন পর ১ বার রিপিট।' },
      },
      {
        brand_name: 'Fexo',
        generic_name: 'Fexofenadine',
        adult: { dosage_form: 'Tab', strength: '120 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে শোবার পূর্বে সেব্য তীব্র চুলকানি কমাতে।' },
        pediatric: { dosage_form: 'Syr', strength: '30 mg/5 ml', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7-10 Days', special_instructions: 'চুলকানি কমাতে সকালে ও রাতে খাবারের পরে খাওয়ান।' },
      },
    ],
    adviceBn: [
      'পরিবারের সকল সদস্যের (লক্ষণ না থাকলেও) একই দিনে এই লোশন ব্যবহার করতে হবে।',
      'ব্যবহারের দিন ব্যবহৃত সকল কাপড়, বিছানার চাদর ও বালিশের কভার গরম পানিতে ফুটিয়ে কড়া রোদে শুকান।',
      'নখ ছোট করে কাটুন যাতে চুলকানোর কারণে ব্যাকটেরিয়াল ঘা না হয়।',
    ],
  },

  // 5. Tinea / Ringworm / Fungal Infection (দাদ)
  {
    id: 'tinea-fungal',
    title: 'Tinea / Ringworm Fungal Infection',
    titleBn: 'দাদ ও ছত্রাকজনিত ত্বকের সংক্রমণ (Tinea)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['tinea', 'ringworm', 'fungal', 'দাদ', 'ছত্রাক', 'fungus'],
    description: 'Topical antifungal therapy with systemic azole backup and anti-itch symptom relief.',
    descriptionBn: 'দাদ ও রিংওয়ার্ম দূরীকরণে উচ্চমানের অ্যান্টিফাঙ্গাল মলম ও ট্যাবলেট।',
    medicines: [
      {
        brand_name: 'Lulizol',
        generic_name: 'Luliconazole',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '2-4 Weeks', special_instructions: 'আক্রান্ত স্থান পরিষ্কার ও শুকনা করে ক্ষতস্থানের চারপাশ সহ হালকাভাবে লাগান।' },
        pediatric: { dosage_form: 'Oint', strength: '1%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '2 Weeks', special_instructions: 'ক্ষতস্থানে আলতো করে নিয়মিত লাগান।' },
      },
      {
        brand_name: 'Flugal',
        generic_name: 'Fluconazole',
        adult: { dosage_form: 'Cap', strength: '150 mg', schedule: '1 stat weekly', meal_timing: 'After Meal', duration: '4 Weeks', special_instructions: 'সপ্তাহে নির্দিষ্ট একটি দিনে ১টি ক্যাপসুল ভরা পেটে সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '50 mg/5 ml', schedule: '1 stat weekly', meal_timing: 'After Meal', duration: '2 Weeks', special_instructions: 'চিকিৎসকের নির্ধারিত মাত্রায় সপ্তাহে একবার সেব্য।' },
      },
      {
        brand_name: 'Bilatin',
        generic_name: 'Bilastine',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে শোবার পূর্বে সেব্য চুলকানি নিয়ন্ত্রণে।' },
        pediatric: { dosage_form: 'Syr', strength: '10 mg/5 ml', schedule: '0+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'রাতে শোবার পূর্বে সেব্য।' },
      },
    ],
    adviceBn: [
      'আক্রান্ত স্থান সবসময় শুষ্ক ও পরিষ্কার রাখুন। অন্যের গামছা, তোয়ালে বা কাপড় ব্যবহার করবেন না।',
      'ঢিলেঢালা সুতি কাপড় পরুন। চুলকানি বা লালচে ভাব কমে গেলেও পূর্ণ মেয়াদে মলম ব্যবহার চালিয়ে যান।',
      'আক্রান্ত স্থানে স্টেরয়েড বা মিশ্র মলম চিকিৎসকের পরামর্শ ছাড়া ব্যবহার করবেন না।',
    ],
  },

  // 6. Essential Hypertension (উচ্চ রক্তচাপ)
  {
    id: 'essential-hypertension',
    title: 'Essential Hypertension (Cardiovascular)',
    titleBn: 'উচ্চ রক্তচাপ (প্রাথমিক ও নিয়ন্ত্রণ চিকিৎসা)',
    category: 'Chronic Diseases',
    diagnosisMatch: ['hypertension', 'htn', 'high bp', 'উচ্চ রক্তচাপ', 'প্রেসার'],
    description: 'First-line calcium channel blocker or ARB monotherapy with lifestyle sodium restriction.',
    descriptionBn: 'রক্তচাপ নিয়ন্ত্রণে প্রতিদিন সকালে নিয়মিত সেব্য ওষুধ এবং খাদ্য নিয়ন্ত্রণ।',
    medicines: [
      {
        brand_name: 'Camlosart',
        generic_name: 'Amlodipine',
        adult: { dosage_form: 'Tab', strength: '5 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'প্রতিদিন সকালবেলা নাস্তার পর নির্দিষ্ট সময়ে সেব্য।' },
      },
      {
        brand_name: 'Osartil',
        generic_name: 'Losartan Potassium',
        adult: { dosage_form: 'Tab', strength: '50 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'সকালে নাস্তার পর নিয়মিত সেবন করবেন।' },
      },
    ],
    adviceBn: [
      'খাবারের পাতে বাড়তি কাঁচা লবণ সম্পূর্ণ বর্জন করুন।',
      'প্রতি সপ্তাহে অন্তত একবার রক্তচাপ মেপে ডায়েরিতে লিখে রাখুন।',
      'প্রেসার স্বাভাবিক থাকলেও চিকিৎসকের পরামর্শ ছাড়া কোনো অবস্থাতেই ওষুধ খাওয়া বন্ধ করবেন না।',
      'প্রতিদিন অন্তত ৩০-৪০ মিনিট দ্রুত হাঁটার অভ্যাস গড়ে তুলুন।',
    ],
  },

  // 7. Type 2 Diabetes Mellitus (ডায়াবেটিস)
  {
    id: 'type-2-diabetes',
    title: 'Type 2 Diabetes Mellitus (Endocrine)',
    titleBn: 'টাইপ-২ ডায়াবেটিস (ব্লাড সুগার নিয়ন্ত্রণ)',
    category: 'Chronic Diseases',
    diagnosisMatch: ['diabetes', 'dm', 't2dm', 'high sugar', 'ডায়াবেটিস', 'বহুমূত্র'],
    description: 'First-line biguanide insulin sensitization with strict carbohydrate lifestyle control.',
    descriptionBn: 'খাবারের সাথে সেব্য সুগার নিয়ন্ত্রণকারী ওষুধ ও খাদ্যতালিকা প্রোটোকল।',
    medicines: [
      {
        brand_name: 'Comet',
        generic_name: 'Metformin Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '30 Days', special_instructions: 'প্রধান খাবারের ঠিক মাঝখানে অথবা খাবার শেষ করার সাথে সাথে সেব্য।' },
      },
      {
        brand_name: 'Glina',
        generic_name: 'Linagliptin',
        adult: { dosage_form: 'Tab', strength: '5 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'প্রতিদিন নির্দিষ্ট সময়ে সকালের নাস্তার পর ১টি সেব্য।' },
      },
    ],
    adviceBn: [
      'চিনি, গুড়, মিষ্টি, কোল্ড ড্রিংকস ও পরিশোধিত ময়দার খাবার সম্পূর্ণ পরিহার করুন।',
      'প্রতি সপ্তাহে খালি পেটে (Fasting) এবং খাবার ২ ঘণ্টা পরের সুগার পরীক্ষা করে নোট করুন।',
      'নিয়মিত সময়মতো খাবার গ্রহণ করুন যাতে রক্তে সুগার হঠাৎ অতিরিক্ত কমে না যায়।',
      'পায়ের যত্ন নিন, সবসময় পরিষ্কার ও শুকনো রাখুন এবং নরম জুতো পরুন।',
    ],
  },

  // 8. Urinary Tract Infection (ইউটিআই)
  {
    id: 'urinary-tract-infection',
    title: 'Urinary Tract Infection (Acute Cystitis / UTI)',
    titleBn: 'মূত্রনালীর সংক্রমণ ও প্রস্রাবে জ্বালাপোড়া (UTI)',
    category: 'Internal Medicine',
    diagnosisMatch: ['uti', 'cystitis', 'dysuria', 'ইউটিআই', 'প্রস্রাবে জ্বালা', 'মূত্রনালী'],
    description: 'Empirical antimicrobial therapy for uncomplicated lower UTI with urinary alkalinization.',
    descriptionBn: 'প্রস্রাবের জ্বালাপোড়া ও জীবাণু সংক্রমণ দূরীকরণে উপযুক্ত অ্যান্টিবায়োটিক ও এলকালাইজার।',
    medicines: [
      {
        brand_name: 'Cef-3',
        generic_name: 'Cefixime',
        adult: { dosage_form: 'Cap', strength: '400 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'প্রতিদিন নির্দিষ্ট সময়ে নিয়মিত ৭ দিনের পূর্ণ কোর্স শেষ করুন।' },
        pediatric: { dosage_form: 'Syr', strength: '100 mg/5 ml', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'চিকিৎসকের নির্ধারিত মাত্রায় সকালে ও রাতে খাওয়ান।' },
      },
      {
        brand_name: 'Ural',
        generic_name: 'Sodium / Potassium Citrate',
        adult: { dosage_form: 'Syr', strength: '200 ml', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'এক গ্লাস পানিতে ২ চা চামচ গুলিয়ে দিনে ৩ বার পান করুন।' },
      },
    ],
    adviceBn: [
      'সারাদিনে পর্যাপ্ত পরিমাণে (প্রতিদিন ৩ লিটার) বিশুদ্ধ পানি পান করুন।',
      'প্রস্রাব চেপে রাখবেন না, নিয়মিত প্রস্রাবের বেগ হলে ত্যাগ করুন।',
      'উপসর্গ ভালো হয়ে গেলেও ৭ দিনের অ্যান্টিবায়োটিক কোর্স কোনো অবস্থাতেই অসমাপ্ত রাখবেন না।',
    ],
  },
];
