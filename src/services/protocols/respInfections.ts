import type { DiseaseProtocolTemplate } from './types';

export const RESP_INFECTIONS_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'allergic-rhinitis-perennial',
    title: 'Allergic Rhinitis (Sneezing & Watery Rhinorrhea)',
    titleBn: 'অ্যালার্জিক রাইনাইটিস (ঘন ঘন হাঁচি ও নাক দিয়ে পানি পড়া)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['allergic rhinitis', 'rhinitis', 'হাঁচি', 'sneezing', 'allergy runny nose'],
    description: 'Intranasal corticosteroid spray first-line + non-sedating second-generation antihistamine.',
    descriptionBn: 'হাঁচি ও নাকের চুলকানি বন্ধে ফ্লুটিকাসোন স্প্রে ও বিলাস্টাইন।',
    medicines: [
      {
        brand_name: 'Avamys Nasal Spray',
        generic_name: 'Fluticasone Furoate (27.5 mcg/spray)',
        adult: { dosage_form: 'Drop', strength: '27.5 mcg/spray', schedule: '2 sprays each nostril OD', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'প্রতিদিন সকালে মাথা সামান্য নিচু করে প্রতি নাকে ২ চাপ। নাকের মাঝের পর্দা থেকে বাইরের দিকে স্প্রে করবেন।' },
      },
      {
        brand_name: 'Bilashin',
        generic_name: 'Bilastine',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '14-30 Days', special_instructions: 'সকালে খালি পেটে ১টি।' },
      },
    ],
    adviceBn: [
      'ঘরের পর্দা, তোশক, বালিশ রোদে দিন এবং ডাস্ট অ্যালার্জি এড়িয়ে চলুন।',
      'নরমাল স্যালাইন ড্রপ বা নেজাল ওয়াশ দিয়ে দিনে একবার নাক পরিষ্কার করুন।',
    ],
  },
  {
    id: 'post-nasal-drip-syndrome',
    title: 'Post-Nasal Drip Syndrome (Upper Airway Cough Syndrome)',
    titleBn: 'গলা খাঁকারি ও গলায় কফ জমে থাকা (পোস্ট-নেজাল ড্রিপ)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['post nasal drip', 'uacs', 'throat clearing cough', 'phlegm in throat'],
    description: 'Steroid nasal spray with azelastine or oral decongestant/antihistamine.',
    descriptionBn: 'গলার অস্বস্তি ও ঘন ঘন গলা পরিষ্কার করার কাশি দূরীকরণ।',
    medicines: [
      {
        brand_name: 'Flixonase Nasal Spray',
        generic_name: 'Fluticasone Propionate (50 mcg)',
        adult: { dosage_form: 'Drop', strength: '50 mcg', schedule: '2 sprays each nostril morning', meal_timing: 'Anytime', duration: '3-4 Weeks', special_instructions: 'সকালে নিয়মিত দুই নাকে স্প্রে করুন।' },
      },
      {
        brand_name: 'Montene-FX',
        generic_name: 'Montelukast + Fexofenadine',
        adult: { dosage_form: 'Tab', strength: '10/120 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14-21 Days', special_instructions: 'রাতে শোয়ার আগে ১টি।' },
      },
    ],
    adviceBn: [
      'কুসুম গরম পানিতে সামান্য লবণ দিয়ে দিনে ৩ বার গড়গড়া করুন।',
      'রাতে ঘুমানোর সময় মাথার দিক সামান্য উঁচুতে রাখুন।',
    ],
  },
  {
    id: 'acute-productive-cough',
    title: 'Acute Productive / Chest Cough (Phlegm / Bronchial Secretions)',
    titleBn: 'কফযুক্ত কাশি (বুকে কফ বসা ও ঘরঘর শব্দ)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['productive cough', 'cough with phlegm', 'কফ কাশি', 'chest congestion'],
    description: 'Mucolytic ambroxol/guaifenesin to reduce sputum viscosity and aid expectoration.',
    descriptionBn: 'কফ তরল করে সহজে বুক পরিষ্কারের ওষুধ ও ভাপ নেওয়া।',
    medicines: [
      {
        brand_name: 'Ambrox Syrup',
        generic_name: 'Ambroxol Hydrochloride',
        adult: { dosage_form: 'Syr', strength: '15 mg/5 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাবারের পর ২ চামচ করে দিনে ৩ বার।' },
        pediatric: { dosage_form: 'Syr', strength: '15 mg/5 ml', schedule: '1 spoon TDS', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'খাবারের পর দিনে ৩ বার।' },
      },
      {
        brand_name: 'Tusca',
        generic_name: 'Dextromethorphan + Phenylephrine + Triprolidine',
        adult: { dosage_form: 'Syr', strength: 'Standard', schedule: '2 spoons at night', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'রাতের কাশির কারণে ঘুম না হলে।' },
      },
    ],
    adviceBn: [
      'প্রচুর পরিমাণে কুসুম গরম পানি, আদা-লেবু চা ও মধু-তুলসি পাতার রস খান।',
      'ধোঁয়া ও ঠাণ্ডা বাতাস পরিহার করুন এবং মাস্ক ব্যবহার করুন।',
    ],
  },
  {
    id: 'post-infectious-dry-cough',
    title: 'Post-Infectious Dry Irritant Cough',
    titleBn: 'শুকনো কাশি (খুসখুসে কাশি ও গলার সুরসুরানি)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['dry cough', 'শুকনো কাশি', 'irritant cough', 'tickling cough throat'],
    description: 'Centrally-acting antitussive (Butamirate Citrate) and honey/glycerin demulcents.',
    descriptionBn: 'বুকে কোনো কফ ছাড়া শুধু শুকনো কাশির জন্য বিউটামিরেট সিরাপ।',
    medicines: [
      {
        brand_name: 'Mirapex Syrup',
        generic_name: 'Butamirate Citrate',
        adult: { dosage_form: 'Syr', strength: '7.5 mg/5 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'খাবারের পর ২ চামচ করে দিনে ৩ বার।' },
        pediatric: { dosage_form: 'Syr', strength: '7.5 mg/5 ml', schedule: '1 spoon BD', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'দিনে ২ বার।' },
      },
    ],
    adviceBn: [
      'কাশি উঠলে এক ঢোক কুসুম গরম পানি পান করুন বা মেন্থল লজেন্স চুষে খান।',
      '৩ সপ্তাহের বেশি কাশি স্থায়ী হলে বুকের এক্স-রে ও কফ পরীক্ষা জরুরি।',
    ],
  },
  {
    id: 'acute-laryngitis-hoarseness',
    title: 'Acute Laryngitis / Voice Strain (Hoarseness of Voice)',
    titleBn: 'স্বরভঙ্গ / গলা বসা (কণ্ঠনালীর প্রদাহ ও কথা বলতে কষ্ট)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['laryngitis', 'hoarseness', 'গলা বসা', 'স্বরভঙ্গ', 'loss of voice'],
    description: 'Strict voice rest, steam inhalation, and systemic anti-inflammatory if professional voice user.',
    descriptionBn: 'সম্পূর্ণ কণ্ঠবিশ্রাম (কথা না বলা), ফুটন্ত পানির ভাপ ও নিরাময়।',
    medicines: [
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'গলা ব্যথা ও অস্বস্তিতে সেব্য।' },
      },
    ],
    adviceBn: [
      'সম্পূর্ণ কথা বলা বন্ধ রাখুন (ফিসফিস করেও কথা বলবেন না, এতে ভয়েস কর্ডে বেশি চাপ পড়ে)।',
      'দিনে ৩-৪ বার ফুটন্ত গরম পানির ভাপ নিন এবং গরম পানি দিয়ে কুলকুচি করুন।',
    ],
  },
  {
    id: 'costochondritis-chest-pain',
    title: 'Costochondritis / Musculoskeletal Chest Wall Pain',
    titleBn: 'বুকের পাঁজরে ব্যথা (কস্টোকনড্রাইটিস / মাংসপেশির টান)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['costochondritis', 'chest wall pain', 'বুকে চাপলে ব্যথা', 'rib pain breathing'],
    description: 'Chest wall inflammation localized tenderness relief with topical NSAID and paracetamol.',
    descriptionBn: 'হৃদরোগের ব্যথার সাথে পার্থক্য নিশ্চিতকরণ ও ব্যথানাশক জেল।',
    medicines: [
      {
        brand_name: 'Voltalin Gel',
        generic_name: 'Diclofenac Diethylamine 1% Gel',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '7-14 Days', special_instructions: 'ব্যথার নির্দিষ্ট স্থানে আলতো করে মেখে দিন।' },
      },
      {
        brand_name: 'Napa Extend',
        generic_name: 'Paracetamol Extended Release',
        adult: { dosage_form: 'Tab', strength: '665 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ভরা পেটে সেব্য।' },
      },
    ],
    adviceBn: [
      'ভারী জিনিস তোলা বা বুক টান করার মতো ব্যায়াম সাময়িক বন্ধ রাখুন।',
      'বুকে হালকা গরম পানির সেঁক দিন।',
    ],
  },
  {
    id: 'suspected-pulmonary-tb-workup',
    title: 'Suspected Pulmonary Tuberculosis (Workup Protocol)',
    titleBn: 'যক্ষ্মা সন্দেহ (দীর্ঘস্থায়ী কাশি, সান্ধ্যকালীন জ্বর ও ওজন হ্রাস)',
    category: 'Respiratory & Chest',
    diagnosisMatch: ['tuberculosis', 'tb', 'যক্ষ্মা', 'cough > 3 weeks night sweats', 'hemoptysis'],
    description: 'National TB program workup: Sputum GeneXpert MTB/RIF + Chest X-ray. DO NOT give fluoroquinolones.',
    descriptionBn: 'জাতীয় যক্ষ্মা নিয়ন্ত্রণ কর্মসূচি অনুযায়ী জিন-এক্সপার্ট ও এক্স-রে নিশ্চিতকরণ (কুইনোলোন বর্জন)।',
    medicines: [
      {
        brand_name: 'Ceevit',
        generic_name: 'Ascorbic Acid (Vitamin C)',
        adult: { dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'পুষ্টি ও রোগ প্রতিরোধ সহায়তায় চিবিয়ে সেব্য।' },
      },
    ],
    adviceBn: [
      'সরকারি ডট সেন্টারে বিনামূল্যে কফের জিন-এক্সপার্ট (GeneXpert) পরীক্ষা ও এক্স-রে করান।',
      'যক্ষ্মা ধরা পড়লে সরকারি ডট কেন্দ্র থেকে বিনামূল্যে নিয়মিত ৬ মাসের ওষুধ পাওয়া যায়।',
      'কাশি-হাঁচির সময় রুমাল ব্যবহার করুন ও পুষ্টিকর খাবার গ্রহণ করুন।',
    ],
  },
];
