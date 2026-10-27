import type { DiseaseProtocolTemplate } from './types';

export const GASTRO_LOWER_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'acute-gastroenteritis',
    title: 'Acute Watery Diarrhea / Gastroenteritis',
    titleBn: 'ডায়রিয়া ও পাতলা পায়খানা (আইসিডিডিআর,বি প্রোটোকল)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['diarrhea', 'diarrhoea', 'gastroenteritis', 'পাতলা পায়খানা', 'ডায়রিয়া', 'cholera'],
    description: 'icddr,b dehydration management plan with oral rehydration, zinc, and gut rest.',
    descriptionBn: 'পানিশূন্যতা রোধে ওআরএস, শিশুদের জিঙ্ক সিরাপ এবং প্রয়োজনীয় অন্ত্র পুনঃস্থাপন।',
    medicines: [
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Syr', strength: '500 ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '3-5 Days', special_instructions: 'প্রতিবার পাতলা পায়খানার পর ১ গ্লাস (২৫০ মিলি) প্রস্তুত স্যালাইন পান করুন।' },
        pediatric: { dosage_form: 'Syr', strength: '500 ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '3-5 Days', special_instructions: 'প্রতিবার পায়খানার পর আধা গ্লাস প্রস্তুত স্যালাইন চামচ দিয়ে খাওয়ান।' },
      },
      {
        brand_name: 'Baby Zinc',
        generic_name: 'Zinc Sulphate',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14 Days', special_instructions: '১০ থেকে ১৪ দিন নিয়মিত সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '20 mg/5 ml', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'ডায়রিয়া ভালো হয়ে গেলেও টানা ১৪ দিন সম্পূর্ণ কোর্স শেষ করুন।' },
      },
      {
        brand_name: 'Enterogermina',
        generic_name: 'Bacillus clausii spores',
        adult: { dosage_form: 'Syr', strength: '2 billion/5 ml', schedule: '1+0+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'অন্ত্রের উপকারী ব্যাকটেরিয়া ফিরিয়ে আনার জন্য মিনি অ্যাম্পুল সরাসরি পান করুন।' },
      },
    ],
    adviceBn: [
      'স্যালাইন বানানোর পর ১২ ঘণ্টার বেশি রাখবেন না, নতুন স্যালাইন গুলিয়ে পান করুন।',
      'চিঁড়ার পানি, ডাবের পানি, ভাতের মাড় ও কাঁচকলা দিয়ে পাতলা জাউ ভাত খান।',
      'চোখ বসে যাওয়া, প্রস্রাব বন্ধ হওয়া বা মাত্রাতিরিক্ত দুর্বলতা দেখা দিলে হাসপাতালে যান।',
    ],
  },
  {
    id: 'bacillary-dysentery',
    title: 'Bacillary Dysentery / Shigellosis (Bloody Mucoid Stool)',
    titleBn: 'আমাশয় / রক্ত আমাশয় (সিগেলা ইনফেকশন)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['dysentery', 'shigella', 'আমাশয়', 'bloody diarrhea', 'mucoid stool with fever'],
    description: 'Empirical management of acute invasive bacterial diarrhea with ciprofloxacin/azithromycin.',
    descriptionBn: 'রক্ত বা শ্লেষ্মাযুক্ত আমাশয়ে উপযুক্ত অ্যান্টিবায়োটিক কোর্স।',
    medicines: [
      {
        brand_name: 'Ciprocin',
        generic_name: 'Ciprofloxacin',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'প্রচুর পানিসহ নিয়মিত সকালে ও রাতে ১টি।' },
      },
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Syr', strength: '500 ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিবার মলত্যাগের পর ১ গ্লাস।' },
      },
    ],
    adviceBn: [
      'খাবারের আগে ও শৌচাগার ব্যবহারের পর সাবান দিয়ে ভালো করে হাত ধোবেন।',
      'তৈলাক্ত, মসলাদার খাবার ও দুধজাতীয় খাবার সাময়িক বর্জন করুন।',
    ],
  },
  {
    id: 'amoebic-dysentery',
    title: 'Amoebiasis / Amoebic Dysentery',
    titleBn: 'অ্যামিবিক আমাশয় ও পেট কামড়ানো',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['amoebiasis', 'amoebic dysentery', 'অ্যামিবা', 'tenesmus with mucus stool'],
    description: 'Luminal & tissue amoebicide therapy targeting Entamoeba histolytica.',
    descriptionBn: 'পেট কামড়ানো ও মিউকাস মল দূরীকরণে মেট্রোনিডাজল বা সেকনিডাজল কোর্স।',
    medicines: [
      {
        brand_name: 'Secnid',
        generic_name: 'Secnidazole',
        adult: { dosage_form: 'Tab', strength: '1 g', schedule: '2 tabs single dose', meal_timing: 'After Meal', duration: '1 Day', special_instructions: 'রাতে খাবারের পর একবারে ২টি ট্যাবলেট একসাথে সেবন করুন।' },
      },
      {
        brand_name: 'Filmet',
        generic_name: 'Metronidazole',
        adult: { dosage_form: 'Tab', strength: '400 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'খাবারের পর নিয়মিত সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '200 mg/5 ml', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'পরিমাপ অনুযায়ী খাওয়ান।' },
      },
    ],
    adviceBn: [
      'মেট্রোনিডাজল চলাকালীন অ্যালকোহল বা তামাক সম্পূর্ণ বর্জন করুন।',
      'বিশুদ্ধ পানি পান ও স্বাস্থ্যসম্মত খাবার নিশ্চিত করুন।',
    ],
  },
  {
    id: 'ibs-diarrhea',
    title: 'Irritable Bowel Syndrome - Diarrhea Predominant (IBS-D)',
    titleBn: 'আইবিএস (ডায়রিয়া প্রধান পেট ফাঁপা ও ঘন ঘন মলত্যাগ)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['ibs-d', 'ibs', 'irritable bowel syndrome', 'আইবিএস', 'spastic colon'],
    description: 'Antispasmodic, gut motility modulator and stress relief counseling.',
    descriptionBn: 'অন্ত্রের খিঁচুনি রোধে মেবেভেরিন ও পেট ফাঁপা নিবারণ।',
    medicines: [
      {
        brand_name: 'Colospa',
        generic_name: 'Mebeverine Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '135 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '30 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে সেব্য।' },
      },
      {
        brand_name: 'Fluanxol',
        generic_name: 'Flupentixol + Melitracen',
        adult: { dosage_form: 'Tab', strength: '0.5mg+10mg', schedule: '1+1+0', meal_timing: 'After Meal', duration: '14-30 Days', special_instructions: 'মানসিক চাপ ও পেটের অস্থিরতা উপশমে সকাল ও দুপুরে।' },
      },
    ],
    adviceBn: [
      'যে খাবারে সমস্যা বাড়ে (যেমন: দুধ, বাঁধাকপি, অতিরিক্ত ডাল) সেগুলো চিহ্নিত করে এড়িয়ে চলুন (FODMAP ডায়েট)।',
      'মানসিক চাপ কমান, প্রতিদিন ৩০ মিনিট হাঁটুন এবং পর্যাপ্ত ঘুমান।',
    ],
  },
  {
    id: 'chronic-constipation',
    title: 'Chronic Idiopathic Constipation',
    titleBn: 'দীর্ঘস্থায়ী কোষ্ঠকাঠিন্য ও শক্ত মল',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['constipation', 'কোষ্ঠকাঠিন্য', 'hard stool', 'straining at stool'],
    description: 'Osmotic laxative, bulk-forming fiber supplementation and hydration therapy.',
    descriptionBn: 'ইসবগুলের ভুষি, অসমোটিক ল্যাক্সোলেজ ও মল নরম করার থেরাপি।',
    medicines: [
      {
        brand_name: 'Avolac',
        generic_name: 'Lactulose Oral Solution',
        adult: { dosage_form: 'Syr', strength: '3.35g/5ml', schedule: '3 spoons at night', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে শোয়ার আগে ১৫ মিলি কুসুম গরম পানির সাথে।' },
        pediatric: { dosage_form: 'Syr', strength: '3.35g/5ml', schedule: '1 spoon at night', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'রাতে শোয়ার আগে ৫ মিলি।' },
      },
      {
        brand_name: 'Ispaghula Husk',
        generic_name: 'Psyllium Husk',
        adult: { dosage_form: 'Syr', strength: 'Standard', schedule: '1 spoon BD', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'পানিতে ভিজিয়ে সাথে সাথে খেয়ে ফেলবেন।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন অন্তত ৩ থেকে ৪ লিটার পানি পান করুন।',
      'প্রচুর পরিমাণে আঁশযুক্ত শাকসবজি, পেঁপে, বেল, লাল চালের ভাত ও ফলমূল খান।',
      'মল চেপে রাখবেন না, প্রতিদিন নির্দিষ্ট সময়ে পায়খানায় বসার অভ্যাস করুন।',
    ],
  },
  {
    id: 'hemorrhoids-piles',
    title: 'Hemorrhoids / Piles (Conservative Management)',
    titleBn: 'অর্শ / পাইলস ও পায়ুপথে রক্তপাত',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['hemorrhoids', 'piles', 'পাইলস', 'অর্শ', 'rectal bleeding with constipation'],
    description: 'Flavonoid vascular support, stool softener, and topical anesthetic.',
    descriptionBn: 'মল নরম রাখা, রক্তনালীর ফোলা কমানো ও সিটজ বাথ পরামর্শ।',
    medicines: [
      {
        brand_name: 'Daflon',
        generic_name: 'Micronized Purified Flavonoid Fraction',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '14-30 Days', special_instructions: 'খাবারের সাথে সেব্য, রক্তক্ষরণ ও ফোলা কমায়।' },
      },
      {
        brand_name: 'Anusol',
        generic_name: 'Zinc Oxide + Hydrocortisone Ointment',
        adult: { dosage_form: 'Oint', strength: 'Standard', schedule: '1+0+1', meal_timing: 'Anytime', duration: '7-14 Days', special_instructions: 'পায়ুপথে মলত্যাগের পর মেখে দিন।' },
      },
    ],
    adviceBn: [
      'কুসুম গরম পানিতে সামান্য লবণ দিয়ে প্রতিদিন ১০-১৫ মিনিট সিটজ বাথ (Sitz bath) নিন।',
      'পায়খানায় বসে অতিরিক্ত জোর দেওয়া সম্পূর্ণ বন্ধ করুন।',
    ],
  },
  {
    id: 'acute-anal-fissure',
    title: 'Acute Anal Fissure',
    titleBn: 'অ্যানাল ফিশার (মলদ্বারে তীব্র জ্বালাপোড়া ও ফেটে যাওয়া)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['anal fissure', 'fissure', 'ফিশার', 'severe anal pain after stool'],
    description: 'Sphincter relaxation with topical nitrate/calcium channel blocker and stool softening.',
    descriptionBn: 'মলদ্বার শিথিল করতে মলম ও মল নরম রাখার কম্বিনেশন।',
    medicines: [
      {
        brand_name: 'Angical Ointment',
        generic_name: 'Diltiazem 2% Gel',
        adult: { dosage_form: 'Oint', strength: '2%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '6-8 Weeks', special_instructions: 'পায়ুপথের ভেতরে আধা ইঞ্চি পরিমাণ আঙুল দিয়ে মেখে দিন।' },
      },
      {
        brand_name: 'Lactu',
        generic_name: 'Lactulose',
        adult: { dosage_form: 'Syr', strength: '3.35g/5ml', schedule: '3 spoons at night', meal_timing: 'After Meal', duration: '21 Days', special_instructions: 'মল যেন কোনোভাবেই শক্ত না হয়।' },
      },
    ],
    adviceBn: [
      'প্রতিবার পায়খানার পর কুসুম গরম পানিতে বসে সিটজ বাথ নিন।',
      'শুকনো বা শক্ত খাবার পরিহার করে নরম ফাইবারযুক্ত খাবার খান।',
    ],
  },
  {
    id: 'giardiasis',
    title: 'Intestinal Giardiasis',
    titleBn: 'জিয়ার্ডিয়াসিস (দুর্গন্ধযুক্ত পাতলা পায়খানা ও পেটে গ্যাস)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['giardiasis', 'giardia', 'জিয়ার্ডিয়া', 'foul smelling diarrhea with bloating'],
    description: 'Anti-protozoal eradication protocol targeting Giardia lamblia.',
    descriptionBn: 'জিয়ার্ডিয়া ধ্বংসকারী সেকনিডাজল বা টিনিডাজল চিকিৎসা।',
    medicines: [
      {
        brand_name: 'Tiniba',
        generic_name: 'Tinidazole',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '4 tabs at once', meal_timing: 'After Meal', duration: '1 Day', special_instructions: 'একবারে ৪টি ট্যাবলেট রাতে খাবারের পর সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '200 mg/5 ml', schedule: 'Single dose', meal_timing: 'After Meal', duration: '1 Day', special_instructions: '৫০ মিগ্রা/কেজি একবারে সেব্য।' },
      },
    ],
    adviceBn: [
      'পরিবারের সকল সদস্যের নখ কেটে ছোট রাখুন ও সাবান দিয়ে হাত ধোয়ার অভ্যাস করুন।',
      'রাস্তার খোলা শরবত বা কাঁচা সালাদ সম্পূর্ণ এড়িয়ে চলুন।',
    ],
  },
  {
    id: 'food-poisoning-acute',
    title: 'Acute Food Poisoning',
    titleBn: 'ফুড পয়জনিং (হঠাৎ বমি ও পাতলা পায়খানা)',
    category: 'Gastrointestinal & Liver',
    diagnosisMatch: ['food poisoning', 'ফুড পয়জনিং', 'acute vomiting and diarrhea after eating out'],
    description: 'Aggressive rehydration, anti-emetic, and broad gut antiseptic.',
    descriptionBn: 'দ্রুত পানিশূন্যতা পূরণ, বমি রোধ ও জীবাণু ধ্বংস।',
    medicines: [
      {
        brand_name: 'Emistat',
        generic_name: 'Ondansetron',
        adult: { dosage_form: 'Tab', strength: '8 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '3 Days', special_instructions: 'বমি কমাতে খাবারের ৩০ মিনিট আগে।' },
      },
      {
        brand_name: 'ORS Saline',
        generic_name: 'Oral Rehydration Salts',
        adult: { dosage_form: 'Syr', strength: '500 ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '3 Days', special_instructions: 'প্রতিবার বমি বা মলত্যাগের পর স্যালাইন খান।' },
      },
    ],
    adviceBn: [
      'তৈলাক্ত বা ভারী খাবার পরিহার করুন, সামান্য পাতলা খিচুড়ি বা ওআরএস খান।',
      'প্রস্রাবের রঙ লালচে বা প্রস্রাব কমে গেলে তাৎক্ষণিক হাসপাতালে যাবেন।',
    ],
  },
];
