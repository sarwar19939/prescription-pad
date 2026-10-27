import type { DiseaseProtocolTemplate } from './types';

export const INFECTIONS_GENERAL: DiseaseProtocolTemplate[] = [
  {
    id: 'dengue-fever',
    title: 'Dengue Fever (Non-severe Group A)',
    titleBn: 'ডেঙ্গু জ্বর (সাধারণ ব্যবস্থাপনা)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['dengue', 'dengue fever', 'ডেঙ্গু', 'viral fever', 'fever with retro-orbital pain'],
    description: 'DGHS National Dengue Guideline. Paracetamol only, adequate hydration, strict NSAID avoidance.',
    descriptionBn: 'জাতীয় নির্দেশিকা অনুযায়ী প্রচুর তরল/স্যালাইন পান, শুধুমাত্র প্যারাসিটামল, ব্যথানাশক সম্পূর্ণ নিষিদ্ধ।',
    medicines: [
      {
        brand_name: 'Napa',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'After Meal', duration: '3-5 Days', special_instructions: 'জ্বর বা শরীর ব্যথায় সেব্য। দিনে ৪ গ্রামের বেশি খাবেন না।' },
        pediatric: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '1+1+1 (SOS)', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বরে প্রতি ৬-৮ ঘণ্টা পরপর মাপমতো সেব্য।', perKgDoseMg: 15, concentrationMgPerMl: 24 },
      },
      {
        brand_name: 'Maxpro',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে খালি পেটে।' },
      },
      {
        brand_name: 'Ceevit',
        generic_name: 'Ascorbic Acid (Vitamin C)',
        adult: { dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'রোগ প্রতিরোধ ক্ষমতা ও কৈশিকনালী সুরক্ষায় চুষে সেব্য।' },
      },
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Syr', strength: '500 ml', schedule: '1+1+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিদিন অন্তত ২.৫ থেকে ৩ লিটার স্যালাইন ও তরল খাবার পান করুন।' },
      },
    ],
    adviceBn: [
      'প্রচুর পরিমাণে পানি, খাবার স্যালাইন, ডাবের পানি ও ফলের রস পান করুন।',
      'কোনো অবস্থাতেই অ্যাসপিরিন, ডাইক্লোফেনাক বা ব্যথানাশক ওষুধ খাবেন না।',
      'বিপদচিহ্ন: তীব্র পেট ব্যথা, অতিরিক্ত বমি, মাড়ি দিয়ে রক্তপাত হলে হাসপাতালে ভর্তি হন।',
    ],
  },
  {
    id: 'enteric-fever-typhoid',
    title: 'Enteric Fever / Typhoid (Uncomplicated OPD)',
    titleBn: 'টাইফয়েড ও এন্টারিক ফিভার',
    category: 'Infectious Diseases',
    diagnosisMatch: ['typhoid', 'enteric fever', 'টাইফয়েড', 'salmonella', 'step-ladder fever'],
    description: 'Empirical outpatient regimen accounting for high fluoroquinolone resistance in BD.',
    descriptionBn: 'উচ্চ মাত্রার রেজিস্ট্যান্স বিবেচনায় অ্যাজিথ্রোমাইসিন বা সেফিক্সিম ভিত্তিক সম্পূর্ণ কোর্স।',
    medicines: [
      {
        brand_name: 'Zithrin',
        generic_name: 'Azithromycin',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '7-10 Days', special_instructions: 'খাবারের ১ ঘণ্টা আগে নিয়মিত সেবন করবেন।' },
        pediatric: { dosage_form: 'Syr', strength: '200 mg/5 ml', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '7-10 Days', special_instructions: '১০ মিগ্রা/কেজি হিসেবে সেব্য।', perKgDoseMg: 10, concentrationMgPerMl: 40 },
      },
      {
        brand_name: 'Napa Extend',
        generic_name: 'Paracetamol Extended Release',
        adult: { dosage_form: 'Tab', strength: '665 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'টানা জ্বরের সময় ৮ ঘণ্টা পর পর সেব্য।' },
      },
      {
        brand_name: 'Maxpro',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খালি পেটে সেব্য।' },
      },
    ],
    adviceBn: [
      'অ্যান্টিবায়োটিকের নির্ধারিত কোর্স কোনোভাবেই মাঝপথে বন্ধ করবেন না।',
      'ফুটিয়ে ঠাণ্ডা করা বিশুদ্ধ পানি পান করুন ও বাইরের খোলা খাবার সম্পূর্ণ পরিহার করুন।',
      'জ্বর কমলেও ৩ সপ্তাহ পর্যন্ত সহজে হজমযোগ্য নরম খাবার খান।',
    ],
  },
  {
    id: 'acute-viral-fever',
    title: 'Acute Viral Syndrome / Febrile Illness',
    titleBn: 'সাধারণ ভাইরাস জ্বর ও গা-ব্যথা',
    category: 'Infectious Diseases',
    diagnosisMatch: ['viral fever', 'fever', 'ভাইরাল জ্বর', 'জ্বর', 'body ache with fever'],
    description: 'Symptomatic supportive treatment, antipyretic control, avoiding unnecessary antibiotics.',
    descriptionBn: 'অপ্রয়োজনীয় অ্যান্টিবায়োটিক পরিহার করে লক্ষণভিত্তিক চিকিৎসা ও বিশ্রাম।',
    medicines: [
      {
        brand_name: 'Ace',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3-5 Days', special_instructions: 'জ্বর অনুভূত হলে সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'শিশুর ওজন অনুযায়ী ডোজ দিন।', perKgDoseMg: 15, concentrationMgPerMl: 24 },
      },
      {
        brand_name: 'Telfast',
        generic_name: 'Fexofenadine',
        adult: { dosage_form: 'Tab', strength: '120 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'নাক বন্ধ বা চোখ দিয়ে পানি পড়লে রাতে সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '30 mg/5 ml', schedule: '0+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'রাতের বেলা খাওয়ান।' },
      },
      {
        brand_name: 'Ceevit',
        generic_name: 'Ascorbic Acid (Vitamin C)',
        adult: { dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'চিবিয়ে সেবনযোগ্য ট্যাবলেট।' },
      },
    ],
    adviceBn: [
      'পর্যাপ্ত বিশ্রাম নিন ও কুসুম গরম পানিতে গোসল বা গা স্পঞ্জ করুন।',
      'লেবুর শরবত, ফলের রস ও ভিটামিন-সি সমৃদ্ধ খাবার খান।',
      '৩ দিনের বেশি তীব্র জ্বর স্থায়ী হলে রক্ত পরীক্ষা (CBC, Dengue NS1) করান।',
    ],
  },
  {
    id: 'chikungunya',
    title: 'Chikungunya Infection',
    titleBn: 'চিকুনগুনিয়া (সন্ধিব্যথা ও জ্বর)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['chikungunya', 'চিকুনগুনিয়া', 'severe joint pain with fever'],
    description: 'Post-febrile severe polyarthralgia management with paracetamol, hydration and physiotherapy.',
    descriptionBn: 'তীব্র জয়েন্ট ব্যথায় প্যারাসিটামল ও ফিজিওথেরাপি নির্দেশিকা।',
    medicines: [
      {
        brand_name: 'Napa Rapid',
        generic_name: 'Paracetamol Rapid Acting',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'প্রতি ৬ ঘণ্টায় তীব্র ব্যথায় সেব্য।' },
      },
      {
        brand_name: 'Calbo-D',
        generic_name: 'Calcium + Vitamin D3',
        adult: { dosage_form: 'Tab', strength: '500mg+200IU', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'হাড় ও পেশীর সুরক্ষায় রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'তীব্র ব্যথায় বরফ সেঁক বা হালকা কুসুম গরম পানির সেঁক দিন।',
      'ভারী পরিশ্রম ও ওজন তোলা এড়িয়ে চলুন, মৃদু নড়াচড়ার স্ট্রেচিং করুন।',
    ],
  },
  {
    id: 'urti-common-cold',
    title: 'Upper Respiratory Tract Infection / Common Cold',
    titleBn: 'সর্দি-কাশি ও সাধারণ শ্বাসতন্ত্র সংক্রমণ',
    category: 'Infectious Diseases',
    diagnosisMatch: ['urti', 'common cold', 'সর্দি কাশি', 'rhinitis', 'runny nose'],
    description: 'Self-limiting viral upper respiratory tract infection management without antibiotics.',
    descriptionBn: 'অ্যান্টিহিস্টামিন, প্যারাসিটামল ও ভাপ নেওয়ার মাধ্যমে লক্ষণ উপশম।',
    medicines: [
      {
        brand_name: 'Alatrol',
        generic_name: 'Cetirizine',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'ঘুমানোর আগে রাতে ১টি সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '5 mg/5 ml', schedule: '0+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'রাতে শোয়ার আগে খাওয়াবেন।' },
      },
      {
        brand_name: 'Antazol',
        generic_name: 'Xylometazoline',
        adult: { dosage_form: 'Drop', strength: '0.1%', schedule: '2 drops QDS', meal_timing: 'Anytime', duration: '3-5 Days', special_instructions: 'নাক বন্ধ থাকলে দুই নাকে ২ ফোঁটা করে। ৫ দিনের বেশি ব্যবহার করবেন না।' },
      },
    ],
    adviceBn: [
      'দিনে ২-৩ বার মেন্থল বা কুসুম গরম পানির ভাপ (steam inhalation) নিন।',
      'লবণ-গরম পানি দিয়ে নিয়মিত কুলকুচি করুন ও ঠাণ্ডা খাবার বর্জন করুন।',
    ],
  },
  {
    id: 'strep-pharyngitis-tonsillitis',
    title: 'Acute Streptococcal Tonsillitis / Pharyngitis',
    titleBn: 'তীব্র টনসিলাইটিস ও ফ্যারিঞ্জাইটিস',
    category: 'Infectious Diseases',
    diagnosisMatch: ['tonsillitis', 'pharyngitis', 'টনসিল', 'sore throat', 'gala betha'],
    description: 'Centor criteria positive bacterial tonsillopharyngitis eradication.',
    descriptionBn: 'ব্যাকটেরিয়াল টনসিলের প্রদাহে অ্যান্টিবায়োটিক ও ব্যথানাশক কোর্স।',
    medicines: [
      {
        brand_name: 'Moxaclav',
        generic_name: 'Amoxicillin + Clavulanic Acid',
        adult: { dosage_form: 'Tab', strength: '625 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '7-10 Days', special_instructions: 'খাবারের শুরুতে সেবন করলে পেটের অস্বস্তি কম হয়।' },
        pediatric: { dosage_form: 'Syr', strength: '156.25 mg/5 ml', schedule: '1+0+1', meal_timing: 'With Meal', duration: '7 Days', special_instructions: 'পরিমাপ অনুযায়ী দিনে দুইবার।' },
      },
      {
        brand_name: 'Sergel',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'খালি পেটে সেব্য অ্যান্টিবায়োটিকজনিত গ্যাস্ট্রিক প্রতিরোধে।' },
      },
      {
        brand_name: 'Povidone Iodine Gargle',
        generic_name: 'Povidone Iodine Mouthwash',
        adult: { dosage_form: 'Drop', strength: '1%', schedule: '1+0+1+1', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'সমপরিমাণ কুসুম গরম পানিতে মিশিয়ে গড়গড়া করুন।' },
      },
    ],
    adviceBn: [
      'নিয়মিত কুসুম গরম পানিতে লবণ দিয়ে বা পোভিডন আয়োডিন মাউথওয়াশ দিয়ে গড়গড়া করুন।',
      'অতিরিক্ত গরম বা অতিরিক্ত ঠাণ্ডা খাবার পরিহার করুন।',
    ],
  },
];
