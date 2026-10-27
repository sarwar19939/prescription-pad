import type { DiseaseProtocolTemplate } from './types';

export const INFECTIONS_TROPICAL: DiseaseProtocolTemplate[] = [
  {
    id: 'acute-bronchitis',
    title: 'Acute Bronchitis (Infectious)',
    titleBn: 'তীব্র ব্রঙ্কাইটিস (শ্বাসনালীর সংক্রমণ)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['acute bronchitis', 'bronchitis', 'ব্রংকাইটিস', 'chest cold with cough'],
    description: 'Infectious airway inflammation relief with bronchodilator and mucolytics.',
    descriptionBn: 'কাশি উপশমে মিউকোলাইটিক ও ব্রঙ্কোডাইলেটর চিকিৎসা।',
    medicines: [
      {
        brand_name: 'Mucopect',
        generic_name: 'Ambroxol',
        adult: { dosage_form: 'Syr', strength: '15 mg/5 ml', schedule: '1+1+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'কফ পাতলা হয়ে সহজে বের হতে সাহায্য করে।' },
      },
      {
        brand_name: 'Brodil',
        generic_name: 'Salbutamol',
        adult: { dosage_form: 'Syr', strength: '2 mg/5 ml', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'বুকে সাঁই সাঁই বা শ্বাসটান থাকলে সেব্য।' },
      },
    ],
    adviceBn: [
      'ধোঁয়া, ধুলাবালি ও ধূমপান থেকে সম্পূর্ণ দূরে থাকুন।',
      'প্রচুর পরিমাণে কুসুম গরম পানি ও তুলসি/আদা চা পান করুন।',
    ],
  },
  {
    id: 'community-acquired-pneumonia-opd',
    title: 'Community-Acquired Pneumonia (Mild OPD)',
    titleBn: 'নিউমোনিয়া (মৃদু বহির্বিভাগ চিকিৎসা)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['pneumonia', 'cap', 'নিউমোনিয়া', 'chest infection'],
    description: 'CURB-65 score 0-1 mild outpatient pneumonia protocol with dual macrolide-beta lactam.',
    descriptionBn: 'জ্বর, কফ ও শ্বাসকষ্টে নির্দেশিত অ্যান্টিবায়োটিক সম্পূর্ণ কোর্স।',
    medicines: [
      {
        brand_name: 'Cef-3',
        generic_name: 'Cefixime',
        adult: { dosage_form: 'Cap', strength: '400 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '10 Days', special_instructions: 'প্রতিদিন নির্দিষ্ট সময়ে ১টি।' },
        pediatric: { dosage_form: 'Syr', strength: '100 mg/5 ml', schedule: '1+0+1', meal_timing: 'After Meal', duration: '10 Days', special_instructions: '৮ মিগ্রা/কেজি বিভক্ত মাত্রায়।', perKgDoseMg: 8, concentrationMgPerMl: 20 },
      },
      {
        brand_name: 'Azithral',
        generic_name: 'Azithromycin',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'খাবারের ১ ঘণ্টা পূর্বে।' },
      },
    ],
    adviceBn: [
      'শ্বাসকষ্ট বাড়লে বা অক্সিজেন স্যাচুরেশন ৯৩% এর নিচে নামলে দ্রুত হাসপাতালে যান।',
      'পুষ্টিকর তরল খাবার ও পর্যাপ্ত বিশ্রাম গ্রহণ করুন।',
    ],
  },
  {
    id: 'chickenpox-varicella',
    title: 'Chickenpox / Varicella Zoster (Uncomplicated)',
    titleBn: 'জলবসন্ত (চিকেনপক্স)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['chickenpox', 'varicella', 'জলবসন্ত', 'water blister fever'],
    description: 'Symptomatic itching control and secondary bacterial infection prevention.',
    descriptionBn: 'বসন্তের চুলকানি নিরাময় ও সেকেন্ডারি ইনফেকশন প্রতিরোধ।',
    medicines: [
      {
        brand_name: 'A-Cal',
        generic_name: 'Calamine Lotion',
        adult: { dosage_form: 'Drop', strength: 'Standard', schedule: '1+1+1', meal_timing: 'Anytime', duration: '7-10 Days', special_instructions: 'গুটি বা চুলকানির স্থানে আলতো করে মেখে রাখুন।' },
      },
      {
        brand_name: 'Fenadin',
        generic_name: 'Fexofenadine',
        adult: { dosage_form: 'Tab', strength: '120 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'চুলকানি কমাতে সকালে ও রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'গুটিগুলো নখ দিয়ে খুঁটবেন না, এতে স্থায়ী দাগ বা ব্যাকটেরিয়াল ইনফেকশন হতে পারে।',
      'রোগীর ব্যবহৃত কাপড়চোপড় ও বিছানার চাদর গরম পানিতে ধুয়ে রোদে শুকান।',
    ],
  },
  {
    id: 'acute-sinusitis',
    title: 'Acute Bacterial Rhinosinusitis',
    titleBn: 'তীব্র সাইনোসাইটিস (মাথাব্যথা ও সর্দি)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['sinusitis', 'rhinosinusitis', 'সাইনাস', 'facial pressure fever'],
    description: 'Facial fullness, purulent nasal discharge treatment with decongestants and amoxicillin.',
    descriptionBn: 'মাথাব্যথা ও সাইনাস পরিষ্কারে অ্যান্টিবায়োটিক ও স্প্রে।',
    medicines: [
      {
        brand_name: 'Moxaclav',
        generic_name: 'Amoxicillin + Clavulanic Acid',
        adult: { dosage_form: 'Tab', strength: '625 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '7 Days', special_instructions: 'ভারী খাবারের শুরুতে সেব্য।' },
      },
      {
        brand_name: 'Afrin',
        generic_name: 'Oxymetazoline Nasal Spray',
        adult: { dosage_form: 'Drop', strength: '0.05%', schedule: '1 puff BD', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতি নাকে ১ স্প্রে দিনে ২ বার। ৫ দিনের বেশি নয়।' },
      },
    ],
    adviceBn: [
      'দিনে ২-৩ বার ফুটন্ত পানির গরম ভাপ নিন।',
      'প্রচুর কুসুম গরম পানি ও পুষ্টিকর স্যুপ পান করুন।',
    ],
  },
  {
    id: 'malaria-falciparum-vivax',
    title: 'Uncomplicated Malaria',
    titleBn: 'ম্যালেরিয়া (সাধারণ ব্যবস্থাপনা)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['malaria', 'ম্যালেরিয়া', 'chills and rigor fever', 'plasmodium'],
    description: 'National malaria elimination protocol with Artemether-Lumefantrine combination.',
    descriptionBn: 'জাতীয় নির্দেশিকা অনুযায়ী আর্টেমেথার-লুমেফ্যান্ট্রিন কম্বিনেশন থেরাপি।',
    medicines: [
      {
        brand_name: 'Coartem',
        generic_name: 'Artemether + Lumefantrine',
        adult: { dosage_form: 'Tab', strength: '20mg/120mg', schedule: '4 tabs at 0, 8, 24, 36, 48, 60 hrs', meal_timing: 'With Meal', duration: '3 Days', special_instructions: 'চর্বিজাতীয় খাবারের সাথে খেলে ওষুধটি ভালো কাজ করে।' },
      },
      {
        brand_name: 'Napa',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জ্বর ও কাঁপুনিতে সেব্য।' },
      },
    ],
    adviceBn: [
      'অবশ্যই কোর্স অনুযায়ী প্রতিটি ডোজ ঘড়ির সময় মেনে শেষ করবেন।',
      'মশারি ব্যবহার করুন ও মশার বংশবিস্তার রোধে সচেতন থাকুন।',
    ],
  },
  {
    id: 'infectious-mononucleosis',
    title: 'Infectious Mononucleosis (Glandular Fever)',
    titleBn: 'মনোনিউক্লিওসিস (গ্ল্যান্ডুলার ফিভার)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['mononucleosis', 'epstein barr', 'glandular fever', 'lymphadenopathy with fever'],
    description: 'Supportive management, strict avoidance of amoxicillin (causes severe rash).',
    descriptionBn: 'পর্যাপ্ত বিশ্রাম ও লক্ষণভিত্তিক চিকিৎসা (এমোক্সিসিলিন সম্পূর্ণ বর্জন)।',
    medicines: [
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'গলা ব্যথা ও জ্বরে সেব্য।' },
      },
    ],
    adviceBn: [
      'প্লীহা (spleen) বড় হয়ে যাওয়ার ঝুঁকি থাকায় অন্তত ৪ সপ্তাহ ভারী খেলাধুলা ও পেটে আঘাত থেকে সাবধান থাকুন।',
      'প্রচুর বিশ্রাম ও তরল খাবার গ্রহণ করুন।',
    ],
  },
  {
    id: 'covid-19-mild-opd',
    title: 'COVID-19 (Mild Outpatient Care)',
    titleBn: 'করোনাভাইরাস / কোভিড-১৯ (মৃদু লক্ষণ)',
    category: 'Infectious Diseases',
    diagnosisMatch: ['covid', 'corona', 'sars-cov-2', 'করোনা', 'loss of smell fever'],
    description: 'Home isolation, SpO2 monitoring, antipyretics, hydration, and danger sign identification.',
    descriptionBn: 'হোম আইসোলেশন, পালস অক্সিমিটার পর্যবেক্ষণ ও লক্ষণভিত্তিক উপশম।',
    medicines: [
      {
        brand_name: 'Napa Extend',
        generic_name: 'Paracetamol Extended Release',
        adult: { dosage_form: 'Tab', strength: '665 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'জ্বর ও শরীর ব্যথায় নিয়মিত সেব্য।' },
      },
      {
        brand_name: 'Zinc',
        generic_name: 'Zinc Sulphate',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে।' },
      },
    ],
    adviceBn: [
      'দিনে ৩-৪ বার পালস অক্সিমিটারে SpO2 মাপুন। ৯৪% এর নিচে নামলে হাসপাতালে যোগাযোগ করুন।',
      'পৃথক কক্ষে থাকুন ও পরিবারের সদস্যদের থেকে শারীরিক দূরত্ব বজায় রাখুন।',
    ],
  },
];
