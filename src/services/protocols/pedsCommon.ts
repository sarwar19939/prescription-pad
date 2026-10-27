import type { DiseaseProtocolTemplate } from './types';

export const PEDS_COMMON_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'pediatric-fever-teething',
    title: 'Pediatric Acute Febrile Illness & Teething Fever',
    titleBn: 'শিশুদের জ্বর ও দাঁত ওঠার অস্বস্তি',
    category: 'Pediatrics',
    diagnosisMatch: ['pediatric fever', 'child fever', 'বাচ্চার জ্বর', 'teething fever', 'infant fever'],
    description: 'Weight-based paracetamol dosing (15 mg/kg) and tepid sponging guidelines.',
    descriptionBn: 'ওজনভিত্তিক প্যারাসিটামল হিসাব (প্রতি কেজিতে ১৫ মিগ্রা) ও গা মোছানোর নিয়ম।',
    medicines: [
      {
        brand_name: 'Napa Syrup',
        generic_name: 'Paracetamol Syrup (120 mg/5 ml)',
        adult: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '1+1+1 (SOS)', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর ১০০°F ছাড়িয়ে গেলে।' },
        pediatric: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '6-8 hourly SOS', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর আসলে ৬-৮ ঘণ্টা পর পর মাপমতো চামচ দিয়ে খাওয়ান।', perKgDoseMg: 15, concentrationMgPerMl: 24 },
      },
    ],
    adviceBn: [
      'কুসুম গরম পানিতে নরম সুতির কাপড় ভিজিয়ে বাচ্চার সারা শরীর মুছে দিন (কখনও বরফ পানি দেবেন না)।',
      'বাচ্চাকে হালকা পাতলা সুতির জামা পরাবেন, কম্বল বা ভারী কাঁথা দিয়ে চেপে রাখবেন না।',
      'খিঁচুনি, নিস্তেজ ভাব বা প্রস্রাব বন্ধ হলে দ্রুত হাসপাতালে নিয়ে যান।',
    ],
  },
  {
    id: 'infantile-colic',
    title: 'Infantile Colic (Evening Inconsolable Crying)',
    titleBn: 'শিশুর পেটে গ্যাস ও মোচড়ানো কান্না (ইনফ্যান্টাইল কলিক)',
    category: 'Pediatrics',
    diagnosisMatch: ['colic', 'infant crying evening', 'বাচ্চার পেটে গ্যাস', 'infantile colic'],
    description: 'Simethicone drops with burping technique and maternal diet modification.',
    descriptionBn: 'সিমেথিকন ড্রপস, ঢেকুর তোলার সঠিক নিয়ম ও মায়ের খাদ্যাভ্যাস।',
    medicines: [
      {
        brand_name: 'Colic-Ease Drop',
        generic_name: 'Simethicone Paediatric Drops',
        adult: { dosage_form: 'Drop', strength: '40 mg/ml', schedule: '0.5 ml TDS', meal_timing: 'Before Meal', duration: '7-14 Days', special_instructions: 'দুধ খাওয়ানোর ১৫ মিনিট আগে।' },
        pediatric: { dosage_form: 'Drop', strength: '40 mg/ml', schedule: '10-15 drops before feed', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'দুধ খাওয়ানোর আগে ড্রপার দিয়ে মুখে দিন।' },
      },
    ],
    adviceBn: [
      'প্রতিবার দুধ খাওয়ানোর পর বাচ্চাকে কাঁধে নিয়ে পিঠে আলতো চাপড়ে ঢেকুর (Burp) তোলান।',
      'বাচ্চার পেট মালিশ করুন ও পা দুটো সাইকেলের মতো আলতো করে পেটের দিকে ভাঁজ করুন।',
    ],
  },
  {
    id: 'pediatric-iron-deficiency',
    title: 'Pediatric Nutritional Iron Deficiency Anemia',
    titleBn: 'শিশুদের রক্তস্বল্পতা ও আয়রনের ঘাটতি',
    category: 'Pediatrics',
    diagnosisMatch: ['pediatric anemia', 'বাচ্চার রক্তস্বল্পতা', 'pale child', 'iron deficiency child'],
    description: 'Elemental iron 3 mg/kg daily between meals with vitamin C and deworming.',
    descriptionBn: 'শিশুর রক্তে হিমোগ্লোবিন বাড়াতে নিরাপদ আয়রন ড্রপ/সিরাপ থেরাপি।',
    medicines: [
      {
        brand_name: 'Ferikid Syrup',
        generic_name: 'Iron Polymaltose Complex (50 mg elemental iron/5 ml)',
        adult: { dosage_form: 'Syr', strength: '50 mg/5 ml', schedule: '1 spoon OD', meal_timing: 'After Meal', duration: '3 Months', special_instructions: 'খাবারের পর ফলের রসের সাথে।' },
        pediatric: { dosage_form: 'Syr', strength: '50 mg/5 ml', schedule: '1 spoon OD', meal_timing: 'After Meal', duration: '3 Months', special_instructions: 'প্রতিদিন দুপুরে খাওয়ার পর চামচে করে খাওয়ান।', perKgDoseMg: 3, concentrationMgPerMl: 10 },
      },
    ],
    adviceBn: [
      'আয়রন খাওয়ার পর বাচ্চার পায়খানা কালো হতে পারে, এতে ভয়ের কিছু নেই।',
      'আয়রন দেওয়ার সাথে সাথে দুধ খাওয়াবেন না (কমপক্ষে ১ ঘণ্টার ব্যবধান রাখুন)।',
      'ডিমের কুসুম, ডাল, কলিজা, ডালিম ও সবুজ শাকসবজি নিয়মিত খেতে দিন।',
    ],
  },
  {
    id: 'diaper-rash-candidal',
    title: 'Diaper Dermatitis / Nappy Rash',
    titleBn: 'ডায়াপার র্যাশ (শিশুর কুঁচকিতে লালচে ফুসকুড়ি ও ক্ষত)',
    category: 'Pediatrics',
    diagnosisMatch: ['diaper rash', 'nappy rash', 'ডায়াপার র্যাশ', 'red groin baby'],
    description: 'Zinc oxide barrier paste + antifungal nystatin/clotrimazole cream.',
    descriptionBn: 'জিঙ্ক অক্সাইড ব্যারিয়ার ক্রিম ও ছত্রাকরোধী মলম থেরাপি।',
    medicines: [
      {
        brand_name: 'Rash-Off Cream',
        generic_name: 'Zinc Oxide + Clotrimazole 1%',
        adult: { dosage_form: 'Oint', strength: 'Standard', schedule: 'Apply after every change', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'প্রতিবার ডায়াপার বদলের পর শুকনা চামড়ায় মেখে দিন।' },
        pediatric: { dosage_form: 'Oint', strength: 'Standard', schedule: 'Apply TDS', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'কুঁচকির আক্রান্ত স্থানে আলতো করে মেখে দিন।' },
      },
    ],
    adviceBn: [
      'দিনে অন্তত কয়েক ঘণ্টা ডায়াপার ছাড়া বাচ্চাকে খোলা বাতাসে শুষ্ক রাখুন।',
      'ভেজা ডায়াপার বেশিক্ষণ রাখবেন না, কুসুম গরম পানি ও তুলা দিয়ে মুছে শুকিয়ে নিন।',
    ],
  },
  {
    id: 'pediatric-constipation-functional',
    title: 'Functional Constipation in Children',
    titleBn: 'শিশুদের শক্ত পায়খানা ও কোষ্ঠকাঠিন্য',
    category: 'Pediatrics',
    diagnosisMatch: ['pediatric constipation', 'child hard stool', 'বাচ্চার শক্ত পায়খানা', 'straining infant stool'],
    description: 'Osmotic stool softener (Lactulose/PEG), high fluid intake and toilet training.',
    descriptionBn: 'মল নরম রাখার ল্যাকটুলোজ সিরাপ ও পর্যাপ্ত তরল খাবার।',
    medicines: [
      {
        brand_name: 'Avolac Syrup',
        generic_name: 'Lactulose Oral Solution',
        adult: { dosage_form: 'Syr', strength: '3.35g/5ml', schedule: '2 spoons at night', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে শোয়ার আগে।' },
        pediatric: { dosage_form: 'Syr', strength: '3.35g/5ml', schedule: '1-2 spoons at night', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে শোবার আগে ৫-১০ মিলি দুধ বা পানির সাথে।' },
      },
    ],
    adviceBn: [
      'বাচ্চাকে পাকা পেঁপে, বেল, ডাবের পানি ও প্রচুর শাকসবজি খেতে দিন।',
      'গরুর দুধ অতিরিক্ত (দিনে ৫০০ মিলির বেশি) খাওয়া বন্ধ করুন।',
    ],
  },
  {
    id: 'pediatric-rickets-prevention-d3',
    title: 'Nutritional Rickets Prevention & Vitamin D Deficiency',
    titleBn: 'শিশুদের রিকেটস প্রতিরোধ ও ভিটামিন ডি ঘাটতি (হাড় বাঁকা হওয়া)',
    category: 'Pediatrics',
    diagnosisMatch: ['pediatric rickets', 'rickets', 'রিকেটস', 'bowed legs child', 'vitamin d child'],
    description: 'Vitamin D3 drop supplementation with dietary calcium optimization.',
    descriptionBn: 'ভিটামিন ডি৩ ড্রপ ও সকালের নরম রোদে বাচ্চাকে রাখা।',
    medicines: [
      {
        brand_name: 'D-Drop',
        generic_name: 'Cholecalciferol Drops (400 IU/ml)',
        adult: { dosage_form: 'Drop', strength: '400 IU/ml', schedule: '1 ml OD', meal_timing: 'After Meal', duration: '3 Months', special_instructions: 'সকালে ১ মিলি।' },
        pediatric: { dosage_form: 'Drop', strength: '400 IU/ml', schedule: '1 ml (400 IU) daily', meal_timing: 'After Meal', duration: '3 Months', special_instructions: 'প্রতিদিন সকালের খাবারের সাথে ১ মিলি মুখে দিন।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন সকালে বাচ্চাকে অন্তত ১৫-২০ মিনিট রোদে খেলাধুলা করতে দিন।',
      'দুধ, ডিমের কুসুম ও ক্যালসিয়ামসমৃদ্ধ খাবার নিয়মিত খাওয়ান।',
    ],
  },
  {
    id: 'febrile-convulsion-advice',
    title: 'Febrile Seizure / Convulsion (Post-Ictal Parent Counseling)',
    titleBn: 'জ্বরের খিঁচুনি (ফেব্রাইল কনভালশন ও প্রাথমিক সতর্কতা)',
    category: 'Pediatrics',
    diagnosisMatch: ['febrile seizure', 'febrile convulsion', 'জ্বরের খিঁচুনি', 'fever jerking baby'],
    description: 'Post-febrile seizure protocol: Paracetamol antipyretic, Rectal Diazepam SOS and reassurance.',
    descriptionBn: 'জরুরি প্যারাসিটামল প্রয়োগ ও খিঁচুনি হলে একপাশে কাত করে রাখার নির্দেশনা।',
    medicines: [
      {
        brand_name: 'Napa Suppository',
        generic_name: 'Paracetamol Suppository (125 mg / 250 mg)',
        adult: { dosage_form: 'Drop', strength: '250 mg', schedule: '1 suppository SOS', meal_timing: 'Anytime', duration: 'SOS', special_instructions: 'পায়ুপথে দিতে হবে।' },
        pediatric: { dosage_form: 'Drop', strength: '125 mg', schedule: '1 suppository for fever > 101°F', meal_timing: 'Anytime', duration: 'SOS', special_instructions: 'জ্বর ১০১°F ছাড়িয়ে গেলে পায়ুপথে ১টি সাপোজিটরি দিন।' },
      },
    ],
    adviceBn: [
      'খিঁচুনি উঠলে বাচ্চাকে শক্ত করে চেপে ধরবেন না, বাম কাতে শুইয়ে দিন যাতে বমি ফুসফুসে না যায়।',
      'মুখে কোনো চামচ, আঙুল বা পানি ঢালবেন না।',
      'খিঁচুনি ৫ মিনিটের বেশি স্থায়ী হলে অনতিবিলম্বে নিকটস্থ হাসপাতালে নিয়ে যান।',
    ],
  },
];
